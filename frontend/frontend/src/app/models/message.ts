export interface Message {
  id: number;
  conversationId: number;
  senderUserId: number;
  senderUsername: string;
  content: string;
  createdAt: string;
}
