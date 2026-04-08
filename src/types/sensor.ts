export interface SensorReading {
  ax: number;
  ay: number;
  az: number;
  shock_freq_hz: number;
  temperature_c: number;
  humidity_pct: number;
  resultant_g: number;
  delta_g: number;
  inference_ms: number;
}

export interface PredictionResult {
  status: "SAFE" | "WARNING" | "DANGER";
  safety_score: number;
  probabilities: {
    SAFE: number;
    WARNING: number;
    DANGER: number;
  };
  conclusion: {
    summary: string;
    action: string;
  };
}
