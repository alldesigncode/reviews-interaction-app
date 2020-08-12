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
  disabled: boolean;
  stabilizing: boolean;
  @ViewChild(ReviewListComponent) revComponent: ReviewListComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.data$ = this.getMockData();
  }

  public onCalculatedWidth(width: string): void {
    this.calculatedWidth = width;
    this.cdr.detectChanges();
  }

  public next(): void {
    this.revComponent.goNext(false);
  }

  public onDisabe = (event): void => (this.disabled = event);
  public onStabilize = (event): void => (this.stabilizing = event);

  private getMockData(): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        return observer.next([
          {
            id: 1,
            name: 'item 1',
            url:
              'https://images.unsplash.com/photo-1597065298197-7f3e5bed173d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3233&q=80',
          },
          {
            id: 2,
            name: 'item 2',
            url:
              'https://images.unsplash.com/photo-1597147067031-ccbf8e66f722?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2108&q=80',
          },
          {
            id: 3,
            name: 'item 3',
            url:
              'https://images.unsplash.com/photo-1597077864840-44f0d85011a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
          },
          {
            id: 4,
            name: 'item 4',
            url:
              'https://images.unsplash.com/photo-1597132708057-f7f57aefd651?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
          },
          {
            id: 5,
            name: 'item 5',
            url:
              'https://images.unsplash.com/photo-1597067352482-f913dd817ac5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
          },
          {
            id: 6,
            name: 'item 6',
            url:
              'https://images.unsplash.com/photo-1596953814369-a2cde05939e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80',
          },
          {
            id: 7,
            name: 'item 7',
            url:
              'https://images.unsplash.com/photo-1571624762224-e58ef9009a12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80',
          },
          {
            id: 8,
            name: 'item 8',
            url:
              'https://images.unsplash.com/photo-1596981051311-491388a29427?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
          },
          {
            id: 9,
            name: 'item 9',
            url:
              'https://images.unsplash.com/photo-1597054279937-0085a9af70d1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
          },
          {
            id: 10,
            name: 'item 10',
            url:
              'https://images.unsplash.com/photo-1497582114636-bea95b4c8f53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
          },
          {
            id: 11,
            name: 'item 11',
            url:
              'https://images.unsplash.com/photo-1583942136480-1568b5b2afe6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
          },
          {
            id: 12,
            name: 'item 12',
            url:
              'https://images.unsplash.com/photo-1592739366177-d55cfbfe6a25?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1860&q=80',
          },
        ]);
      });
    });
  }
}
