import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { ReviewsModule } from './reviews/reviews.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ReviewsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
