import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TopicService} from '../services/topic.service';
import {ModuleService} from '../services/module.service';
import {LessonService} from '../services/lesson.service';
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
              private lessonService: LessonService,
              private problemService: ProblemService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      const problemId = +map.get('problemId');
      this.problemService.getProblemById(problemId).subscribe(problem => {
        this.lessonService.getLessonById(problem.lessonId).subscribe(lesson => {
          this.topicService.getById(lesson.topicId).subscribe(topic => {
            this.router.navigate([routes.DASHBOARD, routes.MODULE, topic.moduleId, routes.LESSON, lesson.id, routes.PROBLEM, problemId]);
          }, this.onError);
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
