import {
  Component,
  Input,
  inject,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { OnInit } from '@angular/core';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatbotComponent implements OnInit, AfterViewChecked {

  @Input() section = 'general';

  @ViewChild('chatContainer')
  chatContainer!: ElementRef<HTMLDivElement>;

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/chat';

  messages: ChatMessage[] = [];

  userMessage = '';

  loading = false;

  ngOnInit(): void {

    this.messages.push({

      sender: 'assistant',

      text: this.getGreeting()

    });

  }

  ngAfterViewChecked(): void {

    this.scrollToBottom();

  }

  private scrollToBottom() {

    if (!this.chatContainer) return;

    const element = this.chatContainer.nativeElement;

    element.scrollTop = element.scrollHeight;

  }

  private cleanReply(reply: string): string {

    return reply

      // Remove bold markdown
      .replace(/\*\*/g, '')

      // Convert markdown bullets
      .replace(/^\*\s+/gm, '• ')
      .replace(/^-\s+/gm, '• ')

      // Remove excessive blank lines
      .replace(/\n{3,}/g, '\n\n')

      .trim();

  }

  private getGreeting(): string {

    switch (this.section) {

      case 'social_welfare':

        return `Hello! 👋

I'm Smart Budget Assistant.

I can help you understand the Social Welfare measures announced in the Mauritius Budget 2026–2027.

You can ask me about:

• Pension Reform
• Housing Assistance
• Family Support
• Disability Assistance
• Purchasing Power Shield

How can I help you today?`;

      case 'sme':

        return `Hello! 👋

I'm Smart Budget Assistant.

I can help you understand the Enterprise and SME measures announced in the Mauritius Budget 2026–2027.

You can ask me about:

• SMEs
• Start-ups
• Employment
• Investment
• Innovation

How can I help you today?`;

      case 'agriculture':

        return `Hello! 👋

I can explain the Agriculture and Food Security measures announced in the Mauritius Budget 2026–2027.

How can I help you today?`;

      case 'infrastructure':

        return `Hello! 👋

I can explain the Infrastructure and Public Investment measures announced in the Mauritius Budget 2026–2027.

How can I help you today?`;

      default:

        return `Hello! 👋

I'm Smart Budget Assistant.

Ask me any question related to the Mauritius Budget 2026–2027.`;

    }

  }

  sendMessage() {

    const message = this.userMessage.trim();

    if (!message || this.loading) {

      return;

    }

    this.messages.push({

      sender: 'user',

      text: message

    });

    this.userMessage = '';

    this.loading = true;

    this.http.post<{ reply: string }>(

      this.apiUrl,

      {

        section: this.section,

        message: message

      }

    ).subscribe({

      next: (response) => {

        console.log("Response received:", response);

        this.messages.push({

          sender: 'assistant',

          text: this.cleanReply(response.reply)

        });

        this.loading = false;

        console.log("Loading false");

      },

      error: (err) => {

        console.error(err);

        this.messages.push({

          sender: 'assistant',

          text: 'Sorry, I could not contact the Smart Budget server.'

        });

        this.loading = false;

      }

    });

  }

  onKeyDown(event: KeyboardEvent) {

    if (event.key === 'Enter' && !event.shiftKey) {

      event.preventDefault();

      this.sendMessage();

    }

  }

}