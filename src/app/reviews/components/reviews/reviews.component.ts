import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewListComponent } from '../review-list/review-list.component';

@Component({
  selector: 'rv-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  data$: Observable<any[]>;
  calculatedWidth: string;
  @ViewChild(ReviewListComponent) revComponent: ReviewListComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.data$ = this.getMockData();
  }

  public onCalculatedWidth(width: string): void {
    this.calculatedWidth = width;
    this.cdr.detectChanges();
  }

  next() {
    this.revComponent.goNext();
  }

  public getMockData(): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        return observer.next([
          {
            id: 1,
            name: 'item 1',
          },
          {
            id: 2,
            name: 'item 2',
          },
          {
            id: 3,
            name: 'item 3',
          },
          {
            id: 4,
            name: 'item 4',
          },
          {
            id: 5,
            name: 'item 5',
          },
          {
            id: 6,
            name: 'item 6',
          },
        ]);
      });
    });
  }
}
