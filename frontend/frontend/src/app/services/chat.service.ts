import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Conversation} from '../models/conversation.model';
import {Message} from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/conversations';

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.apiUrl);
  }

  getMessages(
    conversationId: number,
    page = 0,
    size = 20
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${conversationId}/messages`,
      {
        params: {
          page,
          size,
        },
      }
    );
  }

  sendMessage(conversationId: number, content: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrl}/${conversationId}/messages`,
      {content}
    );
  }
}
