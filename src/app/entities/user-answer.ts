export interface UserAnswer {
  questionId: number;
  right: boolean;
  userAnswer: Set<number>;
  createdDate: Date;
}
