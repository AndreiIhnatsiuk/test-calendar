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
  subtopicId: number;
  type: string;

  constructor(private route: ActivatedRoute,
              private problemService: ProblemService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      this.problemId = +map.get('problemId');
      this.subtopicId = +map.get('subtopicId');
      this.problemService.getProblemsBySubtopicId(this.subtopicId).subscribe(problems => {
        this.problems = problems;
        this.type = this.getTypeByProblemId();
      });
    });
  }

  public getTypeByProblemId(): string {
    for (const problem of this.problems) {
      if (problem.id === this.problemId) {
        return problem.type;
      }
    }
  }
}
