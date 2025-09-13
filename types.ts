
export interface HsCodePrediction {
  hs_code: string;
  description: string;
  reasoning: string;
}

export interface Clarification {
  question: string;
  options: string[];
}
