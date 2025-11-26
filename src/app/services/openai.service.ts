import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  //private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  apiKey: WritableSignal<string> = signal('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')

  private inizializeMessage = "I'm going to give you a pgn sequence of chess moves representing an opening. " +
    " I want you to explain me that opening, focusing on which one are the main tactical tricks." +
    " It's very important to have  your response html formatted. don't question if i need further help, just give me the best explanation you can. " +
    " You are my chess teacher. you have to keep in mind i need the html response for all the next questions i have for you. cause it seem you are not taking care of it"
    + " To improve readability add extra lines <br> beetwen paragraphs."
    + " don't add html and body tags give me back just a div fragment to reuse. "
    + " all css inline."

  constructor(private http: HttpClient) {
  }



  chat(message: string): Observable<any> {
    if (this.apiKey() == '') {
      throw new Error("OpenAI API key is not set.");
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey()}`,
    });

    const body = {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: this.inizializeMessage + " " + message }],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  generateText(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    const body = {
      model: 'gpt-4',
      prompt,
      max_tokens: 150,
      temperature: 0.7
    };
    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
