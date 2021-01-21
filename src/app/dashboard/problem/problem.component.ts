import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Problem} from '../../entities/problem';
import {ProblemService} from '../../services/problem.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {
  problems: Array<Problem>;
  problemId: number;
  lessonId: number;
  type: string;

  constructor(private route: ActivatedRoute,
              private problemService: ProblemService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      this.lessonId = +map.get('lessonId');
      const problemId = +map.get('problemId');
      this.problemService.getProblemsByLessonId(this.lessonId).subscribe(problems => {
        this.problems = problems;
        this.type = this.getTypeByProblemId(problemId);
        this.problemId = problemId;
      });
    });
  }

  public getTypeByProblemId(problemId: number): string {
    for (const problem of this.problems) {
      if (problem.id === problemId) {
        return problem.type;
      }
    }
  }
}
