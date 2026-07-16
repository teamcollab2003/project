import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { ScrollTopComponent } from './components/scroll-top/scroll-top';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ScrollTopComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}