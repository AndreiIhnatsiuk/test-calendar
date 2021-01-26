import { Component, OnInit } from '@angular/core';
import {AvailableLessonsService} from '../../services/available-lessons.service';
import {Topic} from '../../entities/topic';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TopicService} from '../../services/topic.service';
import {zip} from 'rxjs';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
  topics: Array<Topic>;
  availableLessons: Set<number>;
  linkLastLesson: number;

  dashboardContent = [
    ['ООП',
      'assets/343.jpg',
      'Квест Вы узнаете, что такое классы, объекты, методы, переменные, типы данных, массивы, условные операторы и циклы.'],

    ['Алгоритмы и структуры данных',
      'assets/344.jpg',
      'Квест Вы узнаете, что такое классы, объекты, методы, переменные, типы данных, массивы, условные операторы и циклы.'],

    ['SQL',
      'assets/349.jpg',
      'Квест Вы узнаете, что такое классы, объекты, методы, переменные, типы данных, массивы, условные операторы и циклы.'],

    ['Spring',
      'assets/336.jpg',
      'Квест Вы узнаете, что такое классы, объекты, методы, переменные, типы данных, массивы, условные операторы и циклы.']
  ];

  constructor(private availableTopicsService: AvailableLessonsService,
              private topicService: TopicService,
              private snackBar: MatSnackBar) {
    this.availableLessons = new Set<number>();
    this.topics = [];
  }

  ngOnInit(): void {
    zip(
      this.availableTopicsService.getAvailableLessons(),
      this.topicService.getTopics(),
    ).subscribe(([availableTopics, topics]) => {
      this.availableLessons = availableTopics;
      this.topics = topics;
      this.linkLastLesson = this.getLastOpenedLessons();
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

  public send() {
    this.snackBar.open('В разработке.', undefined, {
      duration: 5000
    });
  }
}
