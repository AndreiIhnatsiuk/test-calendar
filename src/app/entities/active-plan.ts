import {PlanProblem} from './plan-problem';

export interface ActivePlan {
  id: number;
  deadline: string;
  problems: Array<PlanProblem>;
}
