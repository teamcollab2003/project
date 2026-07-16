import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.css'
})
export class ScrollTopComponent {

  showButton = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.showButton = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}