import {Component, OnInit} from '@angular/core';
import {AvailableLessonsService} from '../../services/available-lessons.service';
import {Topic} from '../../entities/topic';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TopicService} from '../../services/topic.service';
import {zip} from 'rxjs';
import {ModuleService} from '../../services/module.service';
import {Module} from '../../entities/module';
import {LessonService} from '../../services/lesson.service';
import {ProblemService} from '../../services/problem.service';
import {Router} from '@angular/router';
import * as routes from '../routes';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
  modules: Array<Module>;
  availableModules: Set<number>;
  countLessonsByModules: Map<number, number>;
  countProblemsByModules: Map<number, number>;
  lessons: {[k: string]: string} = {
    'one': '# урок',
    'few': '# урока',
    'many': '# уроков'
  };
  tasks: {[k: string]: string} = {
    'one': '# задание',
    'few': '# задания',
    'many': '# заданий'
  };

  constructor(private availableTopicsService: AvailableLessonsService,
              private topicService: TopicService,
              private snackBar: MatSnackBar,
              private  moduleService: ModuleService,
              private  lessonService: LessonService,
              private  problemService: ProblemService,
              private router: Router) {
  }

  ngOnInit(): void {
    zip(
      this.moduleService.getModules(),
      this.moduleService.getAvailableModules(),
      this.lessonService.countByModules(),
      this.problemService.countByModules(),
    ).subscribe(([
                   modules,
                   availableModules,
                   countLessonsByModules,
                   countProblemsByModules
                 ]) => {
      this.modules = modules;
      this.availableModules = availableModules;
      this.countLessonsByModules = countLessonsByModules;
      this.countProblemsByModules = countProblemsByModules;
    });
  }

  public getLastOpenedLessons(moduleId: number) {
    zip(
      this.availableTopicsService.getAvailableLessons(moduleId),
      this.topicService.getTopics(moduleId),
    ).subscribe(([availableTopics, topics]) => {
      for (const topic of topics.reverse()) {
        for (const lesson of topic.lessons.reverse()) {
          if (availableTopics.has(lesson.id)) {
            this.router.navigate([routes.DASHBOARD, routes.MODULE, moduleId, routes.LESSON, lesson.id]);
          }
        }
      }
    });
  }

  public send(moduleId: number) {
    if (!this.availableModules.has(moduleId)) {
      this.snackBar.open('Пройдите предыдущий модуль.', undefined, {
        duration: 5000
      });
    } else {
      this.getLastOpenedLessons(moduleId);
    }
  }
}
