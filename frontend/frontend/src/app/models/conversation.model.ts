export interface ConversationParticipant {
  userId: number;
  username: string;
}

export interface Conversation {
  id: number;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
}
