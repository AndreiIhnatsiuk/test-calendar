export class SubmissionRequest {
  taskId: number;
  solution: string;

  constructor(taskId: number, solution: string) {
    this.taskId = taskId;
    this.solution = solution;
  }
}
