import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TopicService} from '../services/topic.service';
import {ModuleService} from '../services/module.service';
import {ProblemService} from '../services/problem.service';
import * as routes from '../dashboard/routes';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private topicService: TopicService,
              private moduleService: ModuleService,
              private problemService: ProblemService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      const problemId = +map.get('problemId');
      this.problemService.getProblemById(problemId).subscribe(problem => {
        this.topicService.getById(problem.topicId).subscribe(topic => {
          this.router.navigate([routes.DASHBOARD, routes.MODULE, topic.moduleId, routes.PROBLEM, problemId]);
        }, this.onError);
      }, this.onError);
    });
  }

  onError(e) {
    this.snackBar.open(e.error.message, undefined, {
      duration: 10000,
    });
    this.router.navigate([routes.DASHBOARD]);
  }
}
