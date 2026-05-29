export interface UpdatePostRequest {
  title: string;
  description: string;
  isUrgent: boolean;
  urgentUntil: string | null; // ISO-String oder null
}
