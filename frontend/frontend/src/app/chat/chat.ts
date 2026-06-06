import {Component, OnInit, inject, signal} from '@angular/core';

import {ChatService} from '../services/chat.service';
import {Conversation} from '../models/conversation.model';
import {Message} from '../models/message';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  private readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
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

  currentMessagePage = signal(0);
  hasMoreMessages = signal(false);
  isLoadingMoreMessages = signal(false);


  ngOnInit(): void {
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.isLoading.set(false);

        const conversationId = Number(this.route.snapshot.queryParamMap.get('conversationId'));

        if (Number.isInteger(conversationId) && conversationId > 0) {
          const exists = conversations.some((conversation) => conversation.id === conversationId);

          if (exists) {
            this.selectConversation(conversationId);

          }
        }
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

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {conversationId},
      queryParamsHandling: 'merge',
    });
    this.messages.set([]);
    this.messageError.set('');
    this.sendMessageError.set('');
    this.isLoadingMessages.set(true);

    this.currentMessagePage.set(0);
    this.hasMoreMessages.set(false);
    this.isLoadingMoreMessages.set(false);

    this.chatService.getMessages(conversationId, 0).subscribe({
      next: (response) => {
        const messages = [...(response.content ?? [])].reverse();
        this.messages.set(messages);
        this.hasMoreMessages.set(!response.last);
        this.currentMessagePage.set(response.number ?? 0);
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

  loadOlderMessages(): void {
    const conversationId = this.selectedConversationId();

    if (!conversationId || !this.hasMoreMessages() || this.isLoadingMoreMessages()) {
      return;
    }

    const nextPage = this.currentMessagePage() + 1;

    this.isLoadingMoreMessages.set(true);
    this.messageError.set('');

    this.chatService.getMessages(conversationId, nextPage).subscribe({
      next: (response) => {
        const existingIds = new Set(this.messages().map((message) => message.id));
        const olderMessages = [...(response.content ?? [])]
            .reverse()
            .filter((message: Message) => !existingIds.has(message.id));

        this.messages.update((currentMessages) => [
          ...olderMessages,
          ...currentMessages,
        ]);

        this.hasMoreMessages.set(!response.last);
        this.currentMessagePage.set(response.number ?? nextPage);
        this.isLoadingMoreMessages.set(false);
      },
      error: (error) => {
        if (error.status === 403) {
          this.messageError.set('Kein Zugriff auf diese Unterhaltung.');
        } else if (error.status === 401) {
          this.messageError.set('Bitte melde dich erneut an.');
        } else {
          this.messageError.set('Ältere Nachrichten konnten nicht geladen werden.');
        }

        this.isLoadingMoreMessages.set(false);
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

  getOtherParticipantName(conversation: Conversation): string {
    const currentUsernames = this.messages().map((message) => message.senderUsername);

    const knownCurrentUsername = currentUsernames[0];

    const otherParticipant = conversation.participants.find(
      (participant) => participant.username !== knownCurrentUsername
    );

    return otherParticipant?.username ?? 'Unbekannter Nutzer';
  }

}
