import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MentorSubmission} from '../entities/mentor-submission';
import {MentorSubmissionRequest} from '../entities/mentor-submission-request';

@Injectable({providedIn: 'root'})
export class MentorSubmissionService {
  constructor(private http: HttpClient) {
  }

  public getManualSubmissionInQueue(): Observable<Array<MentorSubmission>> {
    return this.http.get<Array<MentorSubmission>>('/mentor/api/submissions/');
  }

  public sentMentorReviewOnSubmission(mentorSubmissionRequest: MentorSubmissionRequest, id: string): Observable<any> {
    return this.http.patch<MentorSubmissionRequest>('mentor/api/submissions/' + id, {mentorSubmissionRequest});
  }

}
