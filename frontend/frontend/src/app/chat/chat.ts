import {Component, OnInit, inject, signal} from '@angular/core';

import {ChatService} from '../services/chat.service';
import {Conversation} from '../models/conversation.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  private readonly chatService = inject(ChatService);

  conversations = signal<Conversation[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unterhaltungen konnten nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }
}
