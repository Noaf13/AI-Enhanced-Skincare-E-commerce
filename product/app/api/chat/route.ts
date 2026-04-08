import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const SYSTEM_PROMPT = `You are a friendly skincare assistant for GLOWSKIN.
Answer in 1-2 sentences maximum and be direct and helpful.
Only answer skincare and product questions.
Never give medical advice - suggest a dermatologist for skin conditions.
If off topic, say: "I can only help with skincare questions!"`;

const BLOCKED_KEYWORDS = [
  "medical advice", "diagnose", "prescription", "medication",
  "cure", "treat disease", "doctor said", "medical condition",
];

function safetyCheck(message: string) {
  const lower = message.toLowerCase();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        safe: false,
        reason: "I can't provide medical advice — please consult a dermatologist. I can help with general skincare tips though!",
      };
    }
  }

  const skincareTopics = [
    "skin", "face", "moisturisure", "cleanser", "serum", "toner", "spf",
    "sunscreen", "acne", "pore", "wrinkle", "hydrat", "oily", "dry",
    "sensitive", "ingredi", "product", "routine", "cream", "lotion",
    "vitamin", "retinol", "niacinamide", "order", "ship", "price",
    "buy", "cart", "wishlist", "hi", "hello", "hey", "thanks",
    "help", "what", "how", "recommend", "best", "glowskin",
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

async function fetchRelevantProducts(message: string) {
  const lower = message.toLowerCase();

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

  for (const [keyword, categoryName] of Object.entries(productTypes)) {
    if (lower.includes(keyword)) {
      products = await client.fetch(
        `*[_type == "product" && stock == true && category->name match $cat][0...3]{
          _id, name, price, "image": image.asset->url, slug
        }`,
        { cat: `*${categoryName}*` }
      );
      if (products.length > 0) break;
    }
  }

  if (products.length === 0) {
    for (const [keyword, skinType] of Object.entries(skinTypes)) {
      if (lower.includes(keyword)) {
        products = await client.fetch(
          `*[_type == "product" && stock == true && $skinType in skinType][0...3]{
            _id, name, price, "image": image.asset->url, slug
          }`,
          { skinType }
        );
        if (products.length > 0) break;
      }
    }
  }

  return products;
}

async function callGroq(userMessage: string, productContext: string) {
  const messages: { role: string; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

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
      max_tokens: 100,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "Please try again!";
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const safety = safetyCheck(message);
    if (!safety.safe) {
      return NextResponse.json({ text: safety.reason, products: [] });
    }

    const products = await fetchRelevantProducts(message);
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