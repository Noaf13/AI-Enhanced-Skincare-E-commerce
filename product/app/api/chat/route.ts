import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// system prompt for the groq model - keeps responses short and on topic (Makes sure AI doesnt respond to unsafe prompts)
const SYSTEM_PROMPT = `You are a friendly skincare assistant for GLOWSKIN.Keep answer in 1-2 sentences maximum and be direct and helpful.
and make them short and helpful .Only answer skincare and product questions. Never give medical advice - suggest a dermatologist for skin conditions .If off topic, say: "I can only help with skincare questions!"`;

// const DISCLAIMER = `Hey! Just so you know I'm an AI skincare advisor, not a doctor. I can help with product questions and general tips, but if you have a medical skin concern, please see a dermatologist. Now, what can I help you with today?`;

// words that should never reach the AI - block before even calling groq
const BLOCKED_KEYWORDS = [
 "medical advice",  "diagnose", "prescription", "medication","cure", "treat disease","doctor said", "medical condition",
  "skin condition", "treatment", "therapy", "remedy", "heal","prescription drug","antibiotic", "steroid", "antifungal",
  "ointment","medicated"
];

/**
 * checks the message before it reaches groq
 * blocks medical keywords outright and filters off topic messages
 *
 * @function safetyCheck
 * @param {string} message - the users message
 * @returns {{ safe: boolean, reason?: string }}
 */
// layer 1 - keyword gate before API call blocks words from keyword blocked list
function safetyCheck(message: string) {
  const lower = message.toLowerCase();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        safe: false,
        reason: "I can't provide medical advice, please consult a dermatologist/A specialist. I can help with general skincare tips though!",
      };
    }
  }

  // layer 2 - if message is long enough and doesnt mention anything skincare related, block it
  // short messages like "hi" pass through so greetings still work
  const skincareTopics = [
    "skin", "face", "moisturisure", "cleanser", "serum", "toner", "spf",
    "sunscreen", "acne", "pore", "wrinkle", "hydrat", "oily", "dry",
    "sensitive", "ingredi", "product", "routine", "cream", "lotion",
    "vitamin", "retinol", "niacinamide", "order", "ship", "price",
    "buy", "cart", "wishlist", "hi", "hello", "hey", "thanks",
    "help", "what", "how", "recommend", "best", "glowskin",
    // Made sure to inset greetings and relevant terms so messages dont get blcoked
  ];

  const isRelevant = skincareTopics.some((topic) => lower.includes(topic));
  if (!isRelevant && message.length > 15) {
    return {
      safe: false,
      reason: "I'm a skincare assistant and can only help with skincare questions! What skin concerns can I help you with?",

    };
  }

  return { safe: true };
}

/**
 * fetches products from sanity that match what the user asked about
 * tries product type first then falls back to skin type
 *
 * @async
 * @function fetchRelevantProducts
 * @param {string} message - raw user message
 * @returns {Promise<any[]>} array of matching products, empty if none found
 *
 * @example
 * const products = await fetchRelevantProducts("recommend a serum for oily skin")
 */
// tries to find matching products from sanity based on what the user asked about
// checks product type first, then falls back to skin type if nothing found
async function fetchRelevantProducts(message: string) {
  const lower = message.toLowerCase();

  // map keywords to category names in sanity
  const productTypes: Record<string, string> = {
    cleanser: "Cleanser",
    serum: "Serum",
    moisturizer: "Moisturizer",
    toner: "Toner",
  };

  const skinTypes: Record<string, string> = {
    oily: "oily",
    dry: "dry",
    sensitive: "sensitive",
    combination: "combination",
    normal: "normal",
  };

  let products = [];

  // check product type and see if it matches
  for (const [keyword, categoryName] of Object.entries(productTypes)) {
    if (lower.includes(keyword)) {
      products = await client.fetch(
        `*[_type == "product" && stock == true && category->name match $cat][0...3]{
          _id, name, price,    "image": image.asset->url, slug
        }`,
        { cat: `*${categoryName}*` }
      );
      if (products.length > 0) break;
    }
  }

  // if nothing came back try matching by skin type instead
  if (products.length === 0) {
    for (const [keyword, skinType] of Object.entries(skinTypes)) {
      if (lower.includes(keyword)) {
        products = await client.fetch(
          `*[_type == "product" && stock == true && $skinType in skinType][0...3]{
            _id, name, price, "image": image.asset->url, slug
          }`,
          { skinType }
        ); if (products.length > 0) break;
      }
    }
  }

  return products;
}

/**
 * sends the message + product context to the groq api and returns the response
 *
 * @async
 * @function callGroq
 * @param {string} userMessage - the users message
 * @param {string} productContext - relevant products to inject into the prompt
 * @returns {Promise<string>} the ai response text
 *
 * @throws {Error} if the groq api returns a non ok response
 */
// PHASE 2
// sends the message to groq with the system prompt + any product context we found
async function callGroq(userMessage: string, productContext: string) {
  const messages: { role: string; content: string }[] = [{ role: "system", content: SYSTEM_PROMPT },
  ];

  // inject the matching products so the model knows what we actually sell
  if (productContext) {
    messages.push({
      role: "system",
      content: `Relevant GLOWSKIN products:\n${productContext}`,
    });
  }

  messages.push({ role: "user", content: userMessage });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages,
      max_tokens: 150, // keeping responses short + Limited
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "Please try again!";
}

/**
 * POST /api/chat
 *
 * main handler - runs safety check then fetches products and calls groq
 * returns the ai response and any matching product cards
 *
 * @async
 * @function POST
 * @param {NextRequest} req - request with { message } in the body
 * @returns {Promise<NextResponse>} { text, products? }
 *
 * @example
 * // Request
 * POST /api/chat
 * Body: { "message": "recommend a serum for dry skin" }
 *
 * // Response
 * { "text": "Try our hydrating serum...", "products": [...] }
 */
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Safety run - If blocked then return without API call
    const safety = safetyCheck(message);
    if (!safety.safe) {
      return NextResponse.json({ text: safety.reason, products: [] });
    }

    const products = await fetchRelevantProducts(message);
    // build product context string to pass to the model
    const productContext = products.length > 0
      ? products.map((p: any) => `- ${p.name} (£${p.price})`).join("\n")
      : "";

    const aiText = await callGroq(message, productContext);


    return NextResponse.json({
      text: aiText,
      products: products.length > 0 ? products : undefined,
    });

    

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { text: "Something went wrong, please try again!" },
      { status: 500 }
    );
  }
}