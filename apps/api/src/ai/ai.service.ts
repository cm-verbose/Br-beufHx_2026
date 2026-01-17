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
    const prompt = `
      You are a Project Manager API. 
      Generate a structured project plan for: "${description}".
      
      Strictly follow this JSON structure. 
      1. "category" MUST be exactly one of: "PROJET", "DEVOIR", "EXAM".
      2. Use the key "Tasks" (capital T) for the list of tasks to match my database.
      
      Return a single object:
      {
        "title": "Project Title",
        "estimatedEndDate": "ISO-8601 Date String",
        "category": "PROJET",
        "Tasks": [
          {
            "name": "Task Name",
            "description": "Short description",
            "children": [] 
          }
        ]
      }
      Create at least 3 levels of depth.
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
