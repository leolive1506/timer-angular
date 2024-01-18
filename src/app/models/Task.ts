export interface Task {
  id?: number;
  task: string;
  secondsAmount: number;
  createdAt?: Date
}

export type UnsaveTask = Omit<Task, 'secondsAmount'> & {
  minutesAmount: number
}
  