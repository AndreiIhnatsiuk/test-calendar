import {Component, OnInit} from '@angular/core';
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
    ['Алгоритмы и структуры данных',
      '#FFD64A',
      'Продолжайте тренировки в алгоритмах.\n\n' +
      'Узнайте как решать сложные задачи и как делать ваши программы быстрыми.\n\n' +
      'В конце модуля Вы научите робота выходить из лабиринта.'],

    ['ООП',
      '#FFB334',
      'Постигните дзэн ООП.\n\n' +
      'Научитесь писать переиспользуемый и масштабируемый код.\n\n' +
      'В конце модуля Вы напишите программу показывающую прогноз погоды.'],

    ['Java Core',
      '#51C574',
      'Осознайте всю мощь Java.\n\n' +
      'Научитесь решать сложные задачи в несколько строк кода и писать многопоточные программы.\n\n' +
      'В конце модуля Вы напишите программу позволяющую вести список задач (TODO-лист).'],

    ['SQL',
      '#5443C0',
      'Научитесь управлять данными.\n\n' +
      'Узнайте, что такое базы данных и выучите язык управления данными.\n\n' +
      'В конце модуля Вы усовершенствуете TODO-лист.'],

    ['Spring',
      '#5C2C1F',
      'Обуздайте интернет.\n\n' +
      'Узнайте как писать многопользовательские клиент-серверные приложения.\n\n' +
      'В конце модуля Вы превратите свой TODO-лист в многопользовательское приложение.'],

    ['Стажировка',
      '#050201',
      'Получите опыт в бою.\n\n' +
      'Научитесь работать в команде и решать коммерческие задачи.\n\n' +
      'После стажировки Вы получите свою первую работу.']
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
    this.snackBar.open('Пройдите предыдущий модуль.', undefined, {
      duration: 5000
    });
  }
}
