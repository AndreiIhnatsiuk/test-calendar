export class SubmissionRequest {
  private taskId: number;
  private solution: string;

  constructor(taskId: number, solution: string) {
    this.taskId = taskId;
    this.solution = solution;
  }
}
