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

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
  topics: Array<Topic>;
  modules: Array<Module>;
  availableModules: Set<number>;
  availableLessons: Set<number>;
  linkLastLesson: number;
  countLessonsByModules: Map<number, number>;
  countProblemsByModules: Map<number, number>;

  constructor(private availableTopicsService: AvailableLessonsService,
              private topicService: TopicService,
              private snackBar: MatSnackBar,
              private  moduleService: ModuleService,
              private  lessonService: LessonService,
              private  problemService: ProblemService,
              private router: Router) {
    this.availableLessons = new Set<number>();
    this.topics = [];
  }

  ngOnInit(): void {
    zip(
      this.availableTopicsService.getAvailableLessons(),
      this.topicService.getTopics(),
      this.moduleService.getModules(),
      this.moduleService.getAvailableModules(),
      this.lessonService.countByModules(),
      this.problemService.countByModules(),
    ).subscribe(([
                   availableTopics,
                   topics,
                   modules,
                   availableModules,
                   countLessonsByModules,
                   countProblemsByModules
                 ]) => {
      this.availableLessons = availableTopics;
      this.topics = topics;
      this.linkLastLesson = this.getLastOpenedLessons();
      this.modules = modules;
      this.availableModules = availableModules;
      this.countLessonsByModules = countLessonsByModules;
      this.countProblemsByModules = countProblemsByModules;
    });
  }

  public getLastOpenedLessons() {
    for (const topic of this.topics.reverse()) {
      for (const lesson of topic.lessons.reverse()) {
        if (this.availableLessons.has(lesson.id)) {
          return lesson.id;
        }
      }
    }
    return 1;
  }

  public send(moduleId: number) {
    if (!this.availableModules.has(moduleId)) {
      this.snackBar.open('Пройдите предыдущий модуль.', undefined, {
        duration: 5000
      });
    } else {
      this.router.navigate(['dashboard', 'java', 'lesson', this.linkLastLesson]);
    }
  }

  public declination(number, text): string {
    const cases = [2, 0, 1, 1, 1, 2];
    const declination = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5];
    return number + ' ' + text[declination];
  }
}
