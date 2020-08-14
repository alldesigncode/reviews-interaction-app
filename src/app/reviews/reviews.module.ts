import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { RouterModule } from '@angular/router';
import { routes } from './reviews.routes';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewComponent } from './components/review/review.component';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [ReviewsComponent, ReviewListComponent, ReviewComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [DataService],
})
export class ReviewsModule {}
