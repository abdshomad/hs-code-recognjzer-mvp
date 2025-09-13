
export interface HsCodePrediction {
  hs_code: string;
  description: string;
  reasoning: string;
  tariff?: string;
  classification_steps?: string;
}

export interface Clarification {
  question: string;
  options: string[];
}