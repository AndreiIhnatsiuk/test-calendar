import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LessonService} from '../../services/lesson.service';
import {FullLesson} from '../../entities/full-lesson';
import {ProblemService} from '../../services/problem.service';
import * as routes from '../routes';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LessonComponent implements OnInit {
  lesson: FullLesson;
  lessonId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lessonService: LessonService,
              private problemService: ProblemService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.lessonId = +map.get('lessonId');
      const moduleId = +this.route.parent.snapshot.paramMap.get('moduleId');
      this.lessonService.getLessonById(this.lessonId).subscribe(fullTopic => {
        this.lesson = fullTopic;
      });
      this.problemService.getProblemsByLessonId(this.lessonId).subscribe(problems => {
        const problemId = problems[0].id;
        this.router.navigate([routes.DASHBOARD, routes.MODULE, moduleId,
          routes.LESSON, this.lessonId, routes.PROBLEM, problemId]);
      });
    });
  }
}
