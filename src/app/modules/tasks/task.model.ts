export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}
