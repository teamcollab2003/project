import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-tts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-tts.component.html',
  styleUrl: './floating-tts.component.css'
})
export class FloatingTtsComponent {
  selectedLanguage: 'eng' | 'fra' | 'mfe' = 'eng';
  isTtsEnabled: boolean = true;
  statusMessage: string = 'Hover over any text on the screen to listen!';
  private currentAudio: HTMLAudioElement | null = null;
  private lastHoveredElement: HTMLElement | null = null;

  // 1. Storage Map to preserve the original English text of your website
  private originalTexts = new Map<HTMLElement, string>();

  constructor(private http: HttpClient) {}

  toggleTts() {
    this.isTtsEnabled = !this.isTtsEnabled;
    if (this.isTtsEnabled) {
      this.statusMessage = '👉 Choose language above!';
    } else {
      this.statusMessage = '';
      this.stopAudio();
    }
  }

  setLanguage(lang: 'eng' | 'fra' | 'mfe') {
    this.selectedLanguage = lang;
    this.statusMessage = `Language: ${lang.toUpperCase()}`;
    this.stopAudio();

    // 2. Trigger global webpage translation!
    this.translatePage(lang);
  }

  // --- DYNAMIC GLOBAL TRANSLATION FUNCTION ---
  translatePage(targetLang: 'eng' | 'fra' | 'mfe') {
    this.statusMessage = '🌐 Translating page...';

    // Grab common readable text tags on the current page
    const elements = Array.from(document.querySelectorAll('p, span, a, h1, h2, h3, h4, h5, h6, li, button, strong, em, td, th')) as HTMLElement[];

    const elementsToTranslate: HTMLElement[] = [];
    const textsToTranslate: string[] = [];

    elements.forEach(el => {
      // Ignore text inside our floating translation widget itself
      if (el.closest('.floating-tts-container')) return;

      const text = el.innerText?.trim();
      if (!text) return;

      // Keep track of the original English text forever so we can always revert or re-translate cleanly
      if (!this.originalTexts.has(el)) {
        this.originalTexts.set(el, text);
      }

      elementsToTranslate.push(el);
      textsToTranslate.push(this.originalTexts.get(el)!);
    });

    if (textsToTranslate.length === 0) {
      this.statusMessage = '✅ Page is ready!';
      return;
    }

    // Send the collected text list to our Python server in one single payload
    this.http.post<{ translations: string[] }>('http://127.0.0.1:5000/api/translate', {
      texts: textsToTranslate,
      target: targetLang
    }).subscribe({
      next: (response) => {
        // Swap out the DOM texts with the translated results on the fly!
        response.translations.forEach((translatedText, index) => {
          if (translatedText) {
            elementsToTranslate[index].innerText = translatedText;
          }
        });
        this.statusMessage = `✅ Switched to ${targetLang.toUpperCase()}`;
      },
      error: (err) => {
        console.error('Translation failed:', err);
        this.statusMessage = '❌ Translation offline. Run Python server!';
      }
    });
  }

  // --- TEXT TO SPEECH GLOBAL HOVER LISTENER ---
  @HostListener('document:mouseover', ['$event'])
  onDocumentHover(event: MouseEvent) {
    if (!this.isTtsEnabled) return;

    const target = event.target as HTMLElement;
    if (!target) return;

    if (target.closest('.floating-tts-container')) return;

    const readableTags = ['P', 'SPAN', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BUTTON', 'STRONG', 'EM', 'TD', 'TH'];
    if (!readableTags.includes(target.tagName)) return;

    if (target === this.lastHoveredElement) return;
    this.lastHoveredElement = target;

    const textToSpeak = target.innerText || target.textContent;
    if (textToSpeak && textToSpeak.trim().length > 0) {
      this.speakText(textToSpeak.trim());
    }
  }

  @HostListener('document:mouseout', ['$event'])
  onDocumentMouseOut(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target === this.lastHoveredElement) {
      this.lastHoveredElement = null;
      this.stopAudio();
    }
  }

  private speakText(text: string) {
    this.stopAudio();
    this.statusMessage = '🔊 Speaking...';

    this.http.post('http://127.0.0.1:5000/api/tts',
      { text: text, language: this.selectedLanguage },
      { responseType: 'blob' }
    ).subscribe({
      next: (audioBlob: Blob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.play().catch(err => {
          console.error('Audio playback blocked:', err);
          this.statusMessage = '❌ Click screen once to unlock audio!';
        });
      },
      error: (err) => {
        console.error('Error generating offline TTS:', err);
        this.statusMessage = '❌ TTS Offline!';
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
