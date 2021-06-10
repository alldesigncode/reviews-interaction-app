import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewComponent } from './components/review/review.component';
import { RouterModule } from '@angular/router';
import { routes } from './reviews.routes';

@NgModule({
  declarations: [ReviewsComponent, ReviewListComponent, ReviewComponent],
  providers: [DataService],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ReviewsModule {}
