import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-agreement-content',
  templateUrl: './user-agreement-content.component.html',
  styleUrls: ['./user-agreement-content.component.scss']
})
export class UserAgreementContentComponent implements OnInit {
  text: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/assets/user-agreement.md', {responseType: 'text'}).subscribe(data => {
      console.log(data);
      this.text = data;
    });
  }

}
