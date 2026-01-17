import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = "AIzaSyAo4WNM5m0GrZa1l4yBLQCOrh-lnd8ITK8";
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });
  }
  async generateProjectPlan(description: string) {
    const today = new Date().toISOString().split("T")[0];
    const prompt = `You are an expert Project Manager API. 
    
    Current Date: ${today} (YYYY-MM-DD).
    
    Generate a structured project plan for: "${description}".
    
    Requirements:
    1. Calculate a realistic "estimatedEndDate" starting from ${today} based on the project's complexity. 
       The date MUST be in the future (after ${today}).
    2. "category" MUST be exactly one of: "PROJET", "DEVOIR", "EXAM".
    3. Use the key "Tasks" (capital T) for the list of tasks.
    4. Create at least 3 levels of depth (Phase -> Task -> Subtask).
    5. Generate a concise "description" (2-3 sentences) summarizing the project goals.
    
    Strictly follow this JSON structure and return ONLY the JSON object:
    {
      "title": "Project Title",
      "description": "A brief summary of the project goals and scope",
      "estimatedEndDate": "ISO-8601 Date String (YYYY-MM-DD)",
      "category": "PROJET",
      "Tasks": [
        {
          "name": "Task Name",
          "description": "Short description",
          "children": [] 
        }
      ]
    }
  `;
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return JSON.parse(text);
    } catch (error) {
      console.error("AI Error:", error);
      throw new Error("Failed to generate project");
    }
  }
}
