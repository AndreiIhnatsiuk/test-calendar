import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProblemService} from '../../services/problem.service';
import * as routes from '../routes';
import {TopicService} from '../../services/topic.service';
import {Topic} from '../../entities/topic';
import {AvailableProblemsService} from '../../services/available-problem.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopicComponent implements OnInit {
  topic: Topic;
  topicId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private topicService: TopicService,
              private availableProblemsService: AvailableProblemsService,
              private problemService: ProblemService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.topicId = +map.get('topicId');
      const moduleId = +this.route.parent.snapshot.paramMap.get('moduleId');
      this.topicService.getById(this.topicId).subscribe(fullTopic => {
        this.topic = fullTopic;
      });
      this.problemService.getProblemsByTopicId(this.topicId).subscribe(problems => {
        const problemId = problems[0].id;
        this.router.navigate([routes.DASHBOARD, routes.MODULE, moduleId,
          routes.TOPIC, this.topicId, routes.PROBLEM, problemId]);
      });
    });
  }
}
