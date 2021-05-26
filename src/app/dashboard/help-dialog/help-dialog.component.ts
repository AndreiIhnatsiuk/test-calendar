import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ModuleService} from 'src/app/services/module.service';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent implements OnInit {
  isOpen: boolean;
  isAvailableSecondModule: boolean;

  constructor(private moduleService: ModuleService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.moduleService.getAvailableModules().subscribe(modules => {
      if (modules.size > 1) {
        this.isAvailableSecondModule = true;
      }
    });
  }

  openGoogleCalendarInNewTab() {
    if (this.isAvailableSecondModule) {
      window.open('https://calendar.google.com/calendar/u/0/r', '_blank');
    } else {
      this.snackBar.open('Доступно со второго модуля', undefined, {
        duration: 5000
      });
    }
  }
}
