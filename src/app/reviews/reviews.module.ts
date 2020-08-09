import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { RouterModule } from '@angular/router';
import { routes } from './reviews.routes';
import { ReviewListComponent } from './components/review-list/review-list.component';

@NgModule({
  declarations: [ReviewsComponent, ReviewListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ReviewsModule {}
