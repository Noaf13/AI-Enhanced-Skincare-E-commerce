import { responseRules, fallbackResponse, ResponseRule } from './responses';

// checks what the user said and finds a matching response

/**
 * matchKeywords
 *
 * scans the message against the responseRules keyword list and returns
 * a matching response string. picks randomly from the matching rules
 * responses array so the bot doesnt always say the same thing
 *
 * @function matchKeywords
 * @param {string} userMessage - raw message from the user
 * @returns {string} matched response or fallback if nothing matched
 *
 * @example
 * matchKeywords("hi there") // returns a greeting response
 * matchKeywords("xyz123")   // returns fallbackResponse
 */
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

/**
 * getQuickReplies
 *
 * returns the quick reply buttons for whichever rule matched the message.
 * not every rule has quick replies so this can return an empty array
 *
 * @function getQuickReplies
 * @param {string} userMessage - raw message from the user
 * @returns {string[]} array of quick reply labels, empty if none defined
 */
// responses buttons 
export function getQuickReplies(userMessage: string): string[] {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  const matchedRule = responseRules.find(rule =>
    rule.keywords.some(keyword => lowerMessage.includes(keyword))
  );
  
  // if no quick replies exist for this rule just return empty
  return matchedRule?.quickReplies || [];
}