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
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage.set('Bitte melde dich an, um deine Unterhaltungen zu sehen.');
        } else if (error.status === 403) {
          this.errorMessage.set('Du hast keinen Zugriff auf diese Unterhaltungen.');
        } else {
          this.errorMessage.set('Unterhaltungen konnten nicht geladen werden.');
        }

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
      error: (error) => {
        if (error.status === 403) {
          this.messageError.set('Kein Zugriff auf diese Unterhaltung.');
        } else if (error.status === 401) {
          this.messageError.set('Bitte melde dich erneut an.');
        } else {
          this.messageError.set('Nachrichten konnten nicht geladen werden.');
        }

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
      error: (error) => {
        if (error.status === 403) {
          this.sendMessageError.set('Kein Zugriff auf diese Unterhaltung.');
        } else if (error.status === 401) {
          this.sendMessageError.set('Bitte melde dich erneut an.');
        } else {
          this.sendMessageError.set('Nachricht konnte nicht gesendet werden.');
        }

        this.isSendingMessage.set(false);
      },
    });
  }
}
