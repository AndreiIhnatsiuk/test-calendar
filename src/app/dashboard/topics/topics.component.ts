import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Topic} from '../../entities/topic';
import {TopicService} from '../../services/topic.service';
import {FullTopic} from '../../entities/full-topic';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  id: number;
  topics: Array<Topic>;
  topic: FullTopic;

  constructor(private route: ActivatedRoute,
              private topicService: TopicService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.id = +map.get('id');
      this.topicService.getTopicById(this.id).subscribe(fullTopic => this.topic = fullTopic);
    });
    this.topicService.getTopics().subscribe(topics => this.topics = topics);
  }

  generateYoutubeLink(link: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + link);
  }

}
