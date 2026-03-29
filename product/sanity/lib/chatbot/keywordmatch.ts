import { responseRules, fallbackResponse, ResponseRule } from './responses';

// checks what the user said and finds a matching response


export function matchKeywords(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim(); 
  // look through the rules and find the first one with a matching keyword
  const matchedRule = responseRules.find(rule =>
    rule.keywords.some(keyword => lowerMessage.includes(keyword))
  );
  
  if (matchedRule) {
    // pick a random response so its not the same response 
    const randomIndex = Math.floor(Math.random() * matchedRule.responses.length);
    return matchedRule.responses[randomIndex];
  }
  // no matches fallback just incae
  return fallbackResponse;
}

// responses buttons 
export function getQuickReplies(userMessage: string): string[] {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  const matchedRule = responseRules.find(rule =>
    rule.keywords.some(keyword => lowerMessage.includes(keyword))
  );
  
  // if no quick replies exist for this rule just return empty
  return matchedRule?.quickReplies || [];
}