import {Component, OnInit, inject, signal} from '@angular/core';

import {ChatService} from '../services/chat.service';
import {Conversation} from '../models/conversation.model';
import {Message} from '../models/message';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  private readonly chatService = inject(ChatService);

  conversations = signal<Conversation[]>([]);
  messages = signal<Message[]>([]);
  selectedConversationId = signal<number | null>(null);

  isLoading = signal(true);
  isLoadingMessages = signal(false);
  errorMessage = signal('');
  messageError = signal('');

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

  selectConversation(conversationId: number): void {
    this.selectedConversationId.set(conversationId);
    this.messages.set([]);
    this.messageError.set('');
    this.isLoadingMessages.set(true);

    this.chatService.getMessages(conversationId).subscribe({
      next: (response) => {
        this.messages.set(response.content ?? []);
        this.isLoadingMessages.set(false);
      },
      error: () => {
        this.messageError.set('Nachrichten konnten nicht geladen werden.');
        this.isLoadingMessages.set(false);
      },
    });
  }
}
