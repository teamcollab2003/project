import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FloatingTtsComponent } from '../../floating-tts/floating-tts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FloatingTtsComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private router = inject(Router);

  goTo(path: string) {

    this.router.navigate([path]);

  }

}