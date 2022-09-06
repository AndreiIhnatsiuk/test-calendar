export class MentorSubmissionRequest {
  status: string;
  comment: string;

  constructor(status: string, comment: string) {
    this.status = status;
    this.comment = comment;
  }
}
