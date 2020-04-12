import { Component, OnInit } from '@angular/core';
import {Course} from '../../entities/course';
import {CourseService} from '../../services/course.service';
import {CourseRegistrationService} from '../../services/course-registration.service';
import {CourseRegistration} from '../../entities/course-registration';
import {Intro} from '../../entities/intro';
import {IntroService} from '../../services/intro.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Personal} from '../../entities/personal';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  personal: Personal;
  phone: string;

  constructor(private courseService: CourseService,
              private courseRegistrationService: CourseRegistrationService,
              private introService: IntroService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
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
    this.authService.getMe().subscribe(personal => this.personal = personal);
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
    }, error => {
      this.sending = false;
      this.snackBar.open(error.error.message, undefined, {
        duration: 5000
      });
    });
  }

  enrollWithPhone() {
    this.sending = true;
    this.authService.updatePhone('+375' + this.phone).subscribe(() => {
      this.authService.getMe().subscribe(personal => this.personal = personal);
      this.enroll();
    }, error => {
      this.sending = false;
      let message = error.error.message;
      if (message === 'Ошибка. Проверьте введенные данные.') {
        message = 'Телефон должен буть в формате: +375 25 xxx-xx-xx, +375 29 xxx-xx-xx, +375 33 xxx-xx-xx или +375 44 xxx-xx-xx';
      }
      this.snackBar.open(message, undefined, {
        duration: 10000
      });
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
