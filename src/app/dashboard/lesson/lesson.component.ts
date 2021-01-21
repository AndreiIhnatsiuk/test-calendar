import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LessonService} from '../../services/lesson.service';
import {FullLesson} from '../../entities/full-lesson';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LessonComponent implements OnInit {
  lesson: FullLesson;
  safeVideoUrl: Map<string, SafeUrl>;
  lessonId: number;

  constructor(private route: ActivatedRoute,
              private lessonService: LessonService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.lessonId = +map.get('lessonId');
      this.lessonService.getLessonById(this.lessonId).subscribe(fullTopic => {
        this.lesson = fullTopic;
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
