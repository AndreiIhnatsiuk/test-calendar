import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SubtopicService} from '../../services/subtopic.service';
import {FullSubtopic} from '../../entities/full-subtopic';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-topic',
  templateUrl: './subtopic.component.html',
  styleUrls: ['./subtopic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SubtopicComponent implements OnInit {
  subtopic: FullSubtopic;
  safeVideoUrl: Map<string, SafeUrl>;
  subtopicId: number;

  constructor(private route: ActivatedRoute,
              private subtopicService: SubtopicService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.subtopicId = +map.get('subtopicId');
      this.subtopicService.getSubtopicById(this.subtopicId).subscribe(fullTopic => {
        this.subtopic = fullTopic;
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
