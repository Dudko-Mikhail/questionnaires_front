import {Component, Input, OnInit} from '@angular/core';
import {Metadata} from "../../model/PagedResponse";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  size: number
  page: number

  @Input() pageInfo: Metadata
  @Input() basePath: string

  @Input() centralLength: number = 5
  @Input() centralLeftIndent: number = 1

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.size = params['size']
    })
  }

  goToPage(): void {
    if (this.page && this.page > 0) {
      this.router.navigate([`${this.basePath}`], {queryParams: {'page': this.page, 'size': this.size}})
    }
  }

  getCentralPageNumbers(): number[] {
    return this.makeRange(this.calculateStartValue(), this.calculateEndValue())
  }

  public calculateStartValue(): number {
    return Math.max(2, Math.min(this.pageInfo.page - this.centralLeftIndent, this.pageInfo.totalPages - this.centralLength))
  }

  public calculateEndValue(): number {
    return Math.min(this.calculateStartValue() + this.centralLength, this.pageInfo.totalPages)
  }

  makeRange(start: number, end: number, step: number = 1): number[] {
    const arr: number[] = []
    for (let i = start; i < end; i += step) {
      arr.push(i)
    }
    return arr
  }

  computeFirstElementIndex(): number {
    return this.pageInfo.size * (this.pageInfo.page - 1) + (this.pageInfo.numberOfElements != 0 ? 1 : 0)
  }

  computeLastElementIndex(): number {
    return this.pageInfo.size * (this.pageInfo.page - 1) + this.pageInfo.numberOfElements
  }

  showLeftThreeDots(): boolean {
    return this.calculateStartValue() > 2
  }

  showRightThreeDots(): boolean {
    return this.calculateEndValue() < this.pageInfo.totalPages
  }

  isFirst(): boolean {
    return this.pageInfo.page === 1
  }

  isLast(): boolean {
    return this.pageInfo.page >= this.pageInfo.totalPages
  }
}
