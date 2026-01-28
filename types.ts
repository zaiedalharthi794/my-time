
export interface Task {
  id: string;
  title: string;
  duration: string;
  category: 'work' | 'personal' | 'focus' | 'rest';
  startTime?: string;
  completed: boolean;
}

export interface DaySchedule {
  date: string;
  tasks: Task[];
  focusScore: number;
}

export interface AIResponse {
  suggestedSchedule: Task[];
  reasoning: string;
  tips: string[];
}

export enum AppSection {
  Dashboard = 'dashboard',
  Planner = 'planner',
  Analytics = 'analytics',
  Chat = 'chat'
}
