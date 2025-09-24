import { GoogleGenAI, Type } from "@google/genai";
import type { InfographicData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const infographicSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A short, catchy title for the infographic (max 10 words).",
    },
    summary: {
      type: Type.STRING,
      description: "A concise summary of the text (2-3 sentences).",
    },
    keyFacts: {
      type: Type.ARRAY,
      description: "A list of 3 to 5 key facts or bullet points from the text. Each fact should be a complete sentence.",
      items: {
        type: Type.STRING,
      },
    },
    keyStats: {
      type: Type.ARRAY,
      description: "A list of 2 to 4 key statistics or numbers mentioned in the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          value: {
            type: Type.STRING,
            description: "The numerical value or stat (e.g., '6.5m', '$10B', '20 years').",
          },
          label: {
            type: Type.STRING,
            description: "A brief label describing the stat (e.g., 'Mirror Diameter', 'Project Cost', 'Operational Lifespan').",
          },
        },
        required: ["value", "label"],
      },
    },
    upscInsights: {
        type: Type.ARRAY,
        description: "A list of points from the text categorized according to the UPSC Mains syllabus. Only include categories for which relevant points are found.",
        items: {
            type: Type.OBJECT,
            properties: {
                category: {
                    type: Type.STRING,
                    description: "The UPSC General Studies paper category. Must be one of the specified enum values.",
                    enum: [
                        "General Studies - I",
                        "General Studies - II",
                        "General Studies - III",
                        "General Studies - IV"
                    ]
                },
                syllabusDescription: {
                    type: Type.STRING,
                    description: "The full description of the syllabus for this category (e.g., 'Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management')."
                },
                points: {
                    type: Type.ARRAY,
                    description: "A list of key points from the text that fall under this category.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            point: {
                                type: Type.STRING,
                                description: "The specific point or fact identified from the text."
                            },
                            syllabusTopic: {
                                type: Type.STRING,
                                description: "The specific part of the syllabus this point pertains to (e.g., 'Technology', 'Social Justice', 'History')."
                            }
                        },
                        required: ["point", "syllabusTopic"]
                    }
                }
            },
            required: ["category", "syllabusDescription", "points"],
        }
    }
  },
  required: ["title", "summary", "keyFacts", "keyStats", "upscInsights"],
};

export const generateInfographicData = async (text: string): Promise<InfographicData> => {
  const prompt = `Analyze the following text and transform it into a concise, visually engaging infographic. Extract a suitable title, a top-level summary, key facts, and key statistics.
Additionally, identify and categorize any relevant points according to the UPSC (Union Public Service Commission) Mains syllabus provided below.

For each identified UPSC point, you MUST specify which specific syllabus topic it pertains to (e.g., 'Technology', 'Social Justice', 'History'). You MUST also include the full syllabus description for each General Studies paper category that has relevant points.

**UPSC Mains Syllabus Categories:**
- **General Studies - I:** (Indian Heritage and Culture, History and Geography of the World and Society)
- **General Studies - II:** (Governance, Constitution, Polity, Social Justice and International relations)
- **General Studies - III:** (Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management)
- **General Studies - IV:** (Ethics, Integrity and Aptitude)

Format the entire output as a single JSON object that adheres to the provided schema. For the UPSC insights, only include categories for which you can find relevant points in the text.

Text to analyze:
---
${text}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: infographicSchema,
      },
    });

    const jsonString = response.text.trim();
    const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const parsedData = JSON.parse(cleanedJsonString);
    
    const data: InfographicData = {
      id: `analysis-${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`,
      ...parsedData,
    };
    
    return data;
  } catch (error) {
    console.error("Error generating infographic data from Gemini:", error);
    throw new Error("Failed to process the text with the AI model.");
  }
};