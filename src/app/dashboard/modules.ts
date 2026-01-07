export interface DashboardModule {
  id: string;
  title: string;
  description: string;
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  { id: 'habit', title: 'Habit Tracker', description: 'Daily habits tracking' },
  { id: 'mood', title: 'Mood Tracker', description: 'Track your mood' },
  { id: 'sleep', title: 'Sleep Tracker', description: 'Sleep hours' },
  { id: 'tasks', title: 'Task Planner', description: 'Daily tasks' },
  { id: 'water', title: 'Water Intake', description: 'Daily water intake' },
  { id: 'reflection', title: 'Daily Reflection', description: 'Calendar journal' }

];
