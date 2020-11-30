export interface UserAnswer {
  problemId: number;
  right: boolean;
  userAnswer: Set<number>;
  createdDate: Date;
}
