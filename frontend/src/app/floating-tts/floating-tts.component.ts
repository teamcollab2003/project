import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-tts', // 1. Set to 'app-floating-tts' to match her template selector
  standalone: true,
  imports: [CommonModule],       // HttpClientModule is handled globally by her app.config.ts, so we can clean this up!
  templateUrl: './floating-tts.component.html', // 2. Point to her local HTML file
  styleUrl: './floating-tts.component.css'     // 3. Point to her local CSS file using her modern styleUrl convention
})
export class FloatingTtsComponent {
  selectedLanguage: 'eng' | 'fra' | 'mfe' = 'eng';
  isTtsEnabled: boolean = true;
  statusMessage: string = 'Hover over any text on the screen to listen!';
  private currentAudio: HTMLAudioElement | null = null;
  private lastHoveredElement: HTMLElement | null = null;

  constructor(private http: HttpClient) {}

  // ... (Keep the rest of your hover and speech code exactly as it is below!)

  toggleTts() {
    this.isTtsEnabled = !this.isTtsEnabled;
    if (this.isTtsEnabled) {
      this.statusMessage = '👉 Choose a language below!';
    } else {
      this.statusMessage = '';
      this.stopAudio();
    }
  }

  setLanguage(lang: 'eng' | 'fra' | 'mfe') {
    this.selectedLanguage = lang;
    this.statusMessage = `Language: ${lang.toUpperCase()}`;
    this.stopAudio();
  }

  // 1. GLOBAL INTERCEPTOR: Listens to mouseover events on the ENTIRE document
  @HostListener('document:mouseover', ['$event'])
  onDocumentHover(event: MouseEvent) {
    if (!this.isTtsEnabled) return;

    const target = event.target as HTMLElement;
    if (!target) return;

    // RULE A: Ignore hovers that happen inside our floating settings controller
    if (target.closest('.floating-tts-container')) return;

    // RULE B: Only read text elements (paragraphs, links, list items, headings, etc.)
    // This stops it from reading huge, empty background wrapper divs.
    const readableTags = ['P', 'SPAN', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BUTTON', 'STRONG', 'EM', 'TD', 'TH'];
    if (!readableTags.includes(target.tagName)) return;

    // RULE C: Don't repeatedly trigger the engine if the mouse moves slightly within the same word
    if (target === this.lastHoveredElement) return;
    this.lastHoveredElement = target;

    // 2. Extract whatever text is physically rendered inside the hovered element
    const textToSpeak = target.innerText || target.textContent;
    if (textToSpeak && textToSpeak.trim().length > 0) {
      this.speakText(textToSpeak.trim());
    }
  }

  // 3. GLOBAL LEAVE EVENT: Stops talking immediately if your mouse leaves an element
  @HostListener('document:mouseout', ['$event'])
  onDocumentMouseOut(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target === this.lastHoveredElement) {
      this.lastHoveredElement = null;
      this.stopAudio();
    }
  }

  private speakText(text: string) {
    this.stopAudio(); // Instantly kill previous sounds for crisp responsiveness
    this.statusMessage = '🔊 Speaking...';

    this.http.post('http://127.0.0.1:5000/api/tts',
      { text: text, language: this.selectedLanguage },
      { responseType: 'blob' }
    ).subscribe({
      next: (audioBlob: Blob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        this.currentAudio = new Audio(audioUrl);

        this.currentAudio.play()
          .catch(err => {
            console.error('Playback blocked:', err);
            this.statusMessage = '❌ Blocked. Click once on screen!';
          });
      },
      error: (err) => {
        console.error('Error contacting python backend:', err);
        this.statusMessage = '❌ Local backend offline!';
      }
    });
  }

  private stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.statusMessage = this.isTtsEnabled ? '🎤 Ready' : '';
    }
  }
}
