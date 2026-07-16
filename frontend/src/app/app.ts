import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmartBudgetComponent } from './components/smart-budget/smart-budget';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SmartBudgetComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
