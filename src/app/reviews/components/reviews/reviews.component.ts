import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewListComponent } from '../review-list/review-list.component';
import { gsap, Expo } from 'gsap';
import { DataService } from '../../services/data.service';
import { ReviewComponent } from '../review/review.component';
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
  currentIndex = 0;

  @ViewChild('count', { static: true }) count: ElementRef;
  @ViewChild(ReviewListComponent) public reviews: ReviewListComponent;
  @ViewChild(ReviewComponent) public review: ReviewComponent;

  tl = gsap.timeline();

  constructor(private cdr: ChangeDetectorRef, private data: DataService) {}

  ngOnInit(): void {
    this.data$ = this.data.getMockData();
  }

  public onCalculatedWidth(width: string): void {
    this.calculatedWidth = width;
    this.cdr.detectChanges();
  }

  public next(): void {
    this.reviews.increaseCurrentIndex();
    this.reviews.goNext(false);
  }

  public indexChanged(event) {
    if (this.review) {
      this.review.animate();
    }
    this.tl
      .to(this.count.nativeElement, {
        delay: 0.2,
        duration: 0.3,
        y: 5,
        opacity: 0,
        ease: Expo.easeInOut as any,
      })
      .to(this.count.nativeElement, {
        duration: 0,
        y: -10,
        onComplete: () => {
          this.currentIndex = event;
          this.review.getElement(event + 1);
          this.cdr.detectChanges();
          gsap.to(this.count.nativeElement, {
            duration: 0.3,
            y: 0,
            opacity: 1,
            ease: Expo.easeInOut as any,
          });
        },
      });
  }
  public onDisabe = (event): void => (this.disabled = event);
  public onStabilize = (event): void => (this.stabilizing = event);
}
