export interface Topic {
  id: number;
  moduleId: number;
  name: string;
  parentId: number;
  acceptedProblemsAmount: number;
  totalProblemsAmount: number;
  children?: Topic[];
}
