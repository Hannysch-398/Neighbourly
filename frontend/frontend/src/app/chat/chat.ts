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
  newMessage = signal('');
  isSendingMessage = signal(false);
  sendMessageError = signal('');

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

  updateNewMessage(value: string): void {
    this.newMessage.set(value);
  }

  sendMessage(): void {
    const conversationId = this.selectedConversationId();
    const content = this.newMessage().trim();

    if (!conversationId || !content || this.isSendingMessage()) {
      return;
    }

    this.isSendingMessage.set(true);
    this.sendMessageError.set('');

    this.chatService.sendMessage(conversationId, content).subscribe({
      next: (message) => {
        this.messages.update((currentMessages) => [...currentMessages, message]);
        this.newMessage.set('');
        this.isSendingMessage.set(false);
      },
      error: () => {
        this.sendMessageError.set('Nachricht konnte nicht gesendet werden.');
        this.isSendingMessage.set(false);
      },
    });
  }
}
