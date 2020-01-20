import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TopicService} from '../../services/topic.service';
import {FullTopic} from '../../entities/full-topic';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopicComponent implements OnInit {
  topic: FullTopic;

  constructor(private route: ActivatedRoute,
              private topicService: TopicService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      const topicId = +map.get('topicId');
      this.topicService.getTopicById(topicId).subscribe(fullTopic => this.topic = fullTopic);
    });
  }

  generateYoutubeLink(link: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + link);
  }

}
