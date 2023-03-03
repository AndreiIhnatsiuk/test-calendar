import {Component, OnInit} from '@angular/core';
import {Topic} from '../../entities/topic';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import {concat, of} from 'rxjs';
import {TopicService} from '../../services/topic.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

interface Node {
  id: number;
  expandable: boolean;
  parentId: number;
  name: string;
  level: number;
  acceptedProblemsAmount: number;
  totalProblemsAmount: number;
}

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {
  topicId: number;
  treeControl: FlatTreeControl<Node>;
  treeFlattener: MatTreeFlattener<Topic, Node>;
  dataSource: MatTreeFlatDataSource<Topic, Node>;

  constructor(private topicService: TopicService,
              private router: Router,
              private route: ActivatedRoute) {
    this.treeControl = new FlatTreeControl<Node>(
      node => node.level,
      node => node.expandable,
    );
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    const moduleId = Number.parseFloat(this.route.snapshot.paramMap.get('moduleId'));
    this.topicService.getAllByModuleId(moduleId).subscribe((topics) => {
      this.dataSource.data = topics;
      concat(
        of(this.route.firstChild),
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => this.route.firstChild)
        )
      )
        .pipe(switchMap(route => route.paramMap))
        .subscribe(paramMap => {
          const topicId = +paramMap.get('topicId');
          if (topicId !== this.topicId) {
            this.topicId = topicId;
            this.expandOnInit(topicId);
          }
        });
    });
  }

  private transformer = (node: Topic, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      id: node.id,
      name: node.name,
      level: level,
      acceptedProblemsAmount: node.acceptedProblemsAmount,
      totalProblemsAmount: node.totalProblemsAmount,
      parentId: node.parentId
    };
  }

  hasChild = (_: number, node: Node) => node.expandable;

  expandOnInit(topicId: number) {
    let nodeToExpandOnInit = this.treeControl.dataNodes.find(node => node.id === topicId);
    if (this.treeControl.isExpandable(nodeToExpandOnInit)) {
      const nodeIndexToExpandOnInit = this.treeControl.dataNodes.findIndex(node => node.id === topicId);
      this.treeControl.expand(this.treeControl.dataNodes[nodeIndexToExpandOnInit]);
    } else {
      while (nodeToExpandOnInit.level > 0) {
        const parentNode = this.treeControl.dataNodes.find(node => node.id === nodeToExpandOnInit.parentId);
        const parentNodeIndex = this.treeControl.dataNodes.findIndex(node => node.id === parentNode.id);
        this.treeControl.expand(this.treeControl.dataNodes[parentNodeIndex]);
        nodeToExpandOnInit = parentNode;
      }
    }
  }

  expandOneCollapseOther(node) {
    if (this.treeControl.isExpanded(node)) {
      let parent = null;
      const index = this.treeControl.dataNodes.findIndex((n) => n === node);
      for (let i = index; i >= 0; i--) {
        if (node.level > this.treeControl.dataNodes[i].level) {
          parent = this.treeControl.dataNodes[i];
          break;
        }
      }
      if (parent) {
        this.treeControl.collapseDescendants(parent);
        this.treeControl.expand(parent);
      } else {
        this.treeControl.collapseAll();
      }
      this.treeControl.expand(node);
    }
  }
}
