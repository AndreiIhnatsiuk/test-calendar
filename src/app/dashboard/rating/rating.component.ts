import {Component, Input, OnChanges} from '@angular/core';
import {UserRatingService} from '../../services/user-rating.service';
import {UserRating} from '../../entities/user-rating';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnChanges {
  @Input() problemId: number;
  triesRank: UserRating;
  timeRank: UserRating;
  errorTimeRankMsg: string;
  errorTriesRankMsg: string;

  constructor(
    private ratingService: UserRatingService) {
  }

  ngOnChanges(): void {
    this.triesRank = undefined;
    this.timeRank = undefined;
    this.ratingService.getRankByTime(this.problemId).subscribe(timeRank => {
      this.timeRank = timeRank;
    }, error => {
      this.errorTimeRankMsg = error.error.message;
    });
    this.ratingService.getRankByTries(this.problemId).subscribe(triesRank => {
      this.triesRank = triesRank;
    }, error => {
      this.errorTriesRankMsg = error.error.message;
    });
  }


}
