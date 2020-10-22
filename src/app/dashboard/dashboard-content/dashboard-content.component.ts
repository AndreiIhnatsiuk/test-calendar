import { Component, OnInit } from '@angular/core';
import {AvailableSubtopicsService} from '../../services/available-subtopics.service';
import {Subtopic} from '../../entities/subtopic';
import {SubtopicService} from '../../services/subtopic.service';
import {Topic} from '../../entities/topic';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit {
  topics: Array<Topic>;
  availableSubtopics: Set<number>;

  constructor(private availableTopicsService: AvailableSubtopicsService,
              private subtopicService: SubtopicService,
              private snackBar: MatSnackBar) {
    this.availableSubtopics = new Set<number>();
  }

  ngOnInit(): void {
    this.availableTopicsService.getAvailableSubtopics()
      .subscribe(availableTopics => this.availableSubtopics = availableTopics);
    this.subtopicService.getTopics()
      .subscribe(topics => this.topics = topics);
  }

  public getLastOpenedSubtopics() {
    for (const topic of this.topics.reverse()) {
      for (const subtopic of topic.subtopics.reverse()) {
        if (this.availableSubtopics.has(subtopic.id)) {
          return subtopic.id;
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

  public getDashboardContent() {
    return [
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
  }
}
