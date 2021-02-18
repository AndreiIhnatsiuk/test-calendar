import {Component, OnDestroy, OnInit} from '@angular/core';
import {Topic} from '../../entities/topic';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import {concat, of, Subscription} from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {Lesson} from '../../entities/lesson';
import {AvailableLessonsService} from '../../services/available-lessons.service';
import {ProblemService} from '../../services/problem.service';
import {TopicService} from '../../services/topic.service';

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss']
})
export class BeginnerComponent implements OnInit, OnDestroy {
  topics: Array<Topic>;
  lessonId: number;
  availableLessons: Set<number>;
  acceptedLessons: Set<number>;
  acceptedProblemsByLessons: Map<number, number>;
  countProblemsByLessons: Map<number, number>;
  private acceptedProblemsByLessonsSubscription: Subscription;
  private availableLessonsSubscription: Subscription;

  constructor(private topicService: TopicService,
              private problemService: ProblemService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private availableTopicsService: AvailableLessonsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedLessons = new Set<number>();
    this.availableLessons = new Set<number>();
  }

  ngOnInit() {
    const moduleId = Number.parseFloat(this.route.snapshot.paramMap.get('moduleId'));
    this.topicService.getTopics(moduleId)
      .subscribe(topics => this.topics = topics);
    this.acceptedProblemsByLessonsSubscription = this.acceptedSubmissionService.getAcceptedByLessons(moduleId)
      .subscribe(accepted => this.acceptedProblemsByLessons = accepted);
    this.problemService.countByLesson(moduleId)
      .subscribe(number => this.countProblemsByLessons = number);
    this.availableLessonsSubscription = this.availableTopicsService.getAvailableLessons(moduleId)
      .subscribe(availableTopics => this.availableLessons = availableTopics);

    concat(
      of(this.route.firstChild),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route.firstChild)
      )
    )
      .pipe(switchMap(route => route.paramMap))
      .subscribe(paramMap => {
        const lessonId = +paramMap.get('lessonId');
        if (lessonId !== this.lessonId) {
          this.lessonId = lessonId;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.acceptedProblemsByLessonsSubscription) {
      this.acceptedProblemsByLessonsSubscription.unsubscribe();
    }
    if (this.availableLessonsSubscription) {
      this.availableLessonsSubscription.unsubscribe();
    }
  }

  public getAcceptedProblem(id: number) {
    if (!this.acceptedProblemsByLessons) {
      return '';
    }
    const accepted = this.acceptedProblemsByLessons.get(id);
    return accepted ? accepted : 0;
  }

  public getTotalProblem(id: number) {
    if (!this.countProblemsByLessons) {
      return '';
    }
    const count = this.countProblemsByLessons.get(id);
    return count ? count : 0;
  }

  public getAcceptedInTopic(lessons: Array<Lesson>): boolean {
    for (const lesson of lessons) {
      if (this.getAcceptedProblem(lesson.id) !== this.getTotalProblem(lesson.id)) {
        return false;
      }
    }
    return true;
  }

  public getAcceptedInLesson(lesson: Lesson): boolean {
    return this.getAcceptedProblem(lesson.id) === this.getTotalProblem(lesson.id);
  }

  public hasAvailableLessons(lessons: Array<Lesson>) {
    for (const lesson of lessons) {
      if (this.availableLessons.has(lesson.id)) {
        return true;
      }
    }
    return false;
  }

  public isOpened(topic: Topic) {
    for (const lesson of topic.lessons) {
      if (lesson.id === this.lessonId) {
        return true;
      }
    }
    return false;
  }
}
