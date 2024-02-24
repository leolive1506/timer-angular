export interface Task {
  id?: number;
  task: string;
  secondsAmount: number;
  secondsRemaining?: number;
  continuedAt?: Date;
  createdAt: Date
  finishedAt?: Date
  interruptedAt?: Date
}

export type UnsavedTask = Omit<Task, 'secondsAmount'> & {
  task: string;
  secondsAmount: number;
}
