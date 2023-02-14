import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../entities/message';
import {AuthService} from '../../auth/auth.service';
import {WebSocketService} from '../../services/web-socket.service';
import {ChatSnapshot} from '../../entities/chat-snapshot';
import {Router} from '@angular/router';
import {Gtag} from 'angular-gtag';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  isOpen: boolean;
  messages: Array<Message>;
  message: string;
  name: string;
  @ViewChild('messagesContainer')
  messagesContainer: ElementRef;

  constructor(private authService: AuthService,
              private webSocketService: WebSocketService,
              private router: Router,
              private gtag: Gtag) {
    this.isOpen = false;
    this.name = '';
    this.messages = [];
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe(personal => this.name = personal.name);
    this.webSocketService.watch<Message>('/user/queue/messages')
      .subscribe(message => {
        this.messages.push(message);
        this.receiveMessage();
      });
    this.webSocketService.send<ChatSnapshot>('/app/snapshot/messages', null)
      .subscribe(snapshot => {
        this.messages.unshift(...snapshot.messages);
        this.receiveMessage();
      });
  }

  open() {
    this.gtag.event('open', {
      event_category: 'chat'
    });
    this.scrollToBottom();
    this.isOpen = true;
  }

  close() {
    this.gtag.event('close', {
      event_category: 'chat'
    });
    this.isOpen = false;
  }

  getName(type: string) {
    return type === 'User' ? this.name : 'ITMan';
  }

  send() {
    if (this.message && this.message.length > 0) {
      this.webSocketService.send<Message>(
        '/app/messages',
        {
          path: this.router.url,
          message: this.message
        }
      ).subscribe(() => {
        this.gtag.event('send-message', {
          event_category: 'chat'
        });
      });
      this.message = '';
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 1);
  }

  receiveMessage(): void {
    this.scrollToBottom();
  }
}
