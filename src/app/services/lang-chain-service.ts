import { Injectable } from "@angular/core";
import { OpenAIService } from "./openai.service";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LangChainService {
  private knowledgeBase: any[] = []; // Simulated knowledge base
  constructor(
    private openAiService: OpenAIService,
    private http: HttpClient
  ) {
    // Initialize knowledge base or fetch from API
    this.loadKnowledgeBase();
  }
  private loadKnowledgeBase() {
    // Simulate loading or fetch from a real database
    this.knowledgeBase = [
      { id: 1, topic: 'Angular', content: 'Angular is a platform for building web applications.' },
      { id: 2, topic: 'AI', content: 'Artificial Intelligence mimics human intelligence in machines.' }
      // Add more knowledge items
    ];
  }
  searchKnowledgeBase(query: string): any[] {
    // Simple search implementation
    return this.knowledgeBase.filter(item => 
      item.topic.toLowerCase().includes(query.toLowerCase()) || 
      item.content.toLowerCase().includes(query.toLowerCase())
    );
  }
  generateStructuredResponse(query: string): Observable<any> {
    // First search knowledge base
    const relevantInfo = this.searchKnowledgeBase(query);
    
    // Create context-aware prompt
    let contextPrompt = `Based on the following information:\n`;
    relevantInfo.forEach(info => {
      contextPrompt += `- ${info.topic}: ${info.content}\n`;
    });
    
    const structuredPrompt = `${contextPrompt}
    
    Answer the following query with a structured response:
    
    Query: ${query}
    
    Response format:
    1. Main answer (2-3 sentences)
    2. Key points (bulletpoints)
    3. Additional resources or related topics
    
    Response:`;
    
    return this.openAiService.chat(structuredPrompt)
      .pipe(
        map(response => {
          // Process the response if needed
          return {
            query,
            response: response.choices[0].text.trim(),
            sources: relevantInfo.map(info => info.topic)
          };
        }),
        catchError(error => {
          console.error('Error in LangChain processing:', error);
          return of({
            query,
            response: 'Error processing your request with LangChain.',
            sources: []
          });
        })
      );
  }
}