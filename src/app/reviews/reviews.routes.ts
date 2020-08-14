import { Routes } from '@angular/router';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { ReviewComponent } from './components/review/review.component';

export const routes: Routes = [
  {
    path: 'reviews',
    component: ReviewsComponent,
  },
];
