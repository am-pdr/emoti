export type MilestoneStatus = 'Done' | 'In Progress' | 'Upcoming';

export interface Milestone {
  id: number;
  title: string;
  status: MilestoneStatus;
  percent: number;
  date: string;
  bullets: string[];
}
