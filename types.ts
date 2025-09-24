export interface KeyStat {
  value: string;
  label: string;
}

export enum GSPaper {
  GS1 = "General Studies - I",
  GS2 = "General Studies - II",
  GS3 = "General Studies - III",
  GS4 = "General Studies - IV",
}

export interface UPSCPoint {
  point: string;
  syllabusTopic: string;
}

export interface UPSCInsight {
  category: GSPaper;
  syllabusDescription: string;
  points: UPSCPoint[];
}


export interface InfographicData {
  id: string;
  title: string;
  summary: string;
  keyFacts: string[];
  keyStats: KeyStat[];
  upscInsights: UPSCInsight[];
}