export interface ConversationParticipant {
  userId: number;
  username: string;
}

export interface Conversation {
  id: number;
  postId: number | null;
  postTitle: string | null;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
}
