export interface Task {
  id?: number;
  task: string;
  secondsAmount: number;
  createdAt: Date
  finishedAt?: Date
  interruptedAt?: Date
}

export type UnsavedTask = Omit<Task, 'secondsAmount'> & {
  minutesAmount: number
}

export interface TaskPagination {
	content: Task[],
	pageable: Pageable,
	totalPages: number,
	totalElements: number,
	size: number,
	number: number,
	last: boolean,
	sort: Sort,
	numberOfElements: number,
	first: boolean,
	empty: boolean
}

interface Pageable {
  pageNumber: number,
  pageSize: number,
  sort: Sort,
  offset: number,
  paged: boolean,
  unpaged: boolean
}

interface Sort {
  empty: boolean,
  sorted: boolean,
  unsorted: boolean
}
