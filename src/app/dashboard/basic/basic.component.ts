import { Component, OnInit } from '@angular/core';
import {Course} from '../../entities/course';
import {CourseService} from '../../services/course.service';
import {CourseRegistrationService} from '../../services/course-registration.service';
import {CourseRegistration} from '../../entities/course-registration';
import {Intro} from '../../entities/intro';
import {IntroService} from '../../services/intro.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {
  courses: Array<Course>;
  registration: CourseRegistration;
  sending: boolean;
  isEnroll: boolean;
  intros: Array<Intro>;
  loading: boolean;

  constructor(private courseService: CourseService,
              private courseRegistrationService: CourseRegistrationService,
              private introService: IntroService,
              private router: Router) {
    this.sending = false;
    this.intros = [];
    this.loading = false;
  }

  ngOnInit() {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      if (courses.length) {
        this.updateStatus(courses[0].id);
      }
    });
  }

  private updateStatus(courseId: number) {
    this.courseRegistrationService.getByCourseId(courseId).subscribe(registration => {
      this.registration = registration;
      this.isEnroll = true;
      this.introService.getIntroByRegistrationId(registration.id).subscribe(intros => {
        this.intros = intros;
        this.loading = true;
      });
    }, e => {
      if (e.status === 404) {
        this.isEnroll = false;
        this.intros = [];
        this.loading = true;
      }
    });
  }

  enroll() {
    this.sending = true;
    this.courseRegistrationService.registration(this.courses[0].id).subscribe(() => {
      this.updateStatus(this.courses[0].id);
      this.sending = false;
    }, () => {
      this.sending = false;
    });
  }

  start() {
    this.sending = true;
    if (this.intros.length !== 0) {
      this.router.navigate(['dashboard/basic/intro/' + this.registration.id]);
    } else {
      this.introService.start(this.registration.id).subscribe(() => {
        this.introService.getIntroByRegistrationId(this.registration.id).subscribe(() => {
          this.router.navigate(['dashboard/basic/intro/' + this.registration.id]);
        });
      });
    }
  }
}
