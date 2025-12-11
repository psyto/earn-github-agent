export interface ReviewResult {
  score: number;
  notes: string;
  labels: string[];
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

