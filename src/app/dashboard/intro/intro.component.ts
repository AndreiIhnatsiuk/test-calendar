import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Intro} from '../../entities/intro';
import {IntroService} from '../../services/intro.service';
import {concat, Observable, of, Subscription} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import { timer } from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, OnDestroy {
  registrationId: number;
  taskId: number;
  intro: Intro;
  acceptedTasks: Set<number>;
  time: Date;
  private timerSubscription: Subscription;
  private acceptedTasksSubscription: Subscription;

  constructor(private taskService: TaskService,
              private introService: IntroService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedTasks = new Set();
  }

  ngOnInit() {
    concat(
      of(this.route),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route)
      )
    )
      .pipe(switchMap(route => route.paramMap))
      .subscribe(paramMap => {
        const registrationId = +paramMap.get('registrationId');
        const taskId = +paramMap.get('taskId');
        if (registrationId !== this.registrationId) {
          this.registrationId = registrationId;
          this.introService.getIntroByRegistrationId(registrationId).subscribe(intros => {
            this.intro = intros[0];
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe();
              this.timerSubscription = null;
            }
            this.timerSubscription = timer(0, 1000)
              .subscribe(() => {
                const now = new Date();
                this.time = new Date(Math.max(0, this.intro.end.getTime() - now.getTime()));
              });
            this.getAccepted();
          });
        } else if (taskId !== this.taskId) {
          this.getAccepted();
        }
        this.taskId = taskId;
      });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.acceptedTasksSubscription) {
      this.acceptedTasksSubscription.unsubscribe();
    }
  }

  getAccepted() {
    if (this.acceptedTasksSubscription) {
      this.acceptedTasksSubscription.unsubscribe();
      this.acceptedTasksSubscription = undefined;
    }
    if (this.intro) {
      this.acceptedTasksSubscription = this.acceptedSubmissionService.getAccepted(this.intro.taskIds, this.intro.start, this.intro.end)
        .subscribe(accepted => this.acceptedTasks = accepted);
    }
  }
}
