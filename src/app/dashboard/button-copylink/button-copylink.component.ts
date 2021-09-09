import {Component, Input, OnInit} from '@angular/core';
import {ClipboardService} from 'ngx-clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-button-copylink',
  templateUrl: './button-copylink.component.html',
  styleUrls: ['./button-copylink.component.scss']
})
export class ButtonCopylinkComponent implements OnInit {

  @Input() problemId = 0;

  constructor(
    private snackBar: MatSnackBar,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
  }

  copyToClipboard() {
    const linkToCopy = `https://study.itman.by/problem/${this.problemId}`;
    this.clipboardService.copy(linkToCopy);
    this.snackBar.open('Ссылка скопирована', null, {duration: 1000});
  }
}
