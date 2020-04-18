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
  safeVideoUrl: Map<string, SafeUrl>;

  constructor(private route: ActivatedRoute,
              private topicService: TopicService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      const topicId = +map.get('topicId');
      this.topicService.getTopicById(topicId).subscribe(fullTopic => {
        this.topic = fullTopic;
        // https://github.com/ionic-team/ionic-v3/issues/605
        const videos = fullTopic.parts
          .filter(x => x.youtubeId)
          .map(x => [x.youtubeId, this.generateYoutubeLink(x.youtubeId)] as [string, SafeUrl]);
        this.safeVideoUrl = new Map(videos);
      });
    });
  }

  generateYoutubeLink(link: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + link);
  }

}
