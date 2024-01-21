import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Pagination } from 'src/app/models/pagination';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  private _pagination: Pagination<Task>
  @Output() changePageTo = new EventEmitter<number>();

  numbersPage: number[];

  get pagination(): Pagination<Task> {
    return this._pagination
  }

  @Input() set pagination(value: Pagination<Task>) {
    this._pagination = value
    this.numbersPage = Array(this.pagination.totalPages).fill(0).map((x, i) => i + 1)
  }

  @Input() previousPage = (): void => { throw new Error('Method nextPage() not implemented.') }
  @Input() nextPage = (): void => { throw new Error('Method nextPage() not implemented.') }

  changePageToFn = (page: number): void => {
    this.changePageTo.emit(page)
   }

  currentPage(): number {
    return this.pagination.pageable.pageNumber
  }
}
