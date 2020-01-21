import { Component, OnInit } from '@angular/core';
import {Course} from '../../entities/course';
import {CourseService} from '../../services/course.service';
import {CourseRegistrationService} from '../../services/course-registration.service';
import {CourseRegistration} from '../../entities/course-registration';
import {error} from '@angular/compiler/src/util';

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

  constructor(private courseService: CourseService,
              private courseRegistrationService: CourseRegistrationService) {
    this.sending = false;
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
    }, e => {
      if (e.status === 404) {
        this.isEnroll = false;
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
}
