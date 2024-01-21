export interface IPagination {
  previousPage(): void
  nextPage(): void
  changePageTo(page: number): void
}
