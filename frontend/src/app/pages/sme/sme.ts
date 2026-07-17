import { Component } from '@angular/core';
import { ChatbotComponent } from '../../components/chatbot/chatbot';

@Component({
  selector: 'app-sme',
  standalone: true,
  imports: [ChatbotComponent],
  templateUrl: './sme.html',
  styleUrl: './sme.css'
})
export class Sme {

  cards = [

    {
      icon: '🚀',
      title: 'Start-Up Revolution',
      subtitle: 'Helping innovative businesses grow.',
      points: [
        '10-year income tax holiday for eligible start-ups.',
        'Encourages innovation and entrepreneurship.',
        'Supports the creation of new businesses.',
        'Improves the start-up ecosystem in Mauritius.'
      ],
      expanded: false
    },

    {
      icon: '🤖',
      title: 'AI & Innovation Support',
      subtitle: 'Encouraging digital transformation.',
      points: [
        'Investment tax credit for AI solutions.',
        'Support for patents and innovation.',
        'Promotes technology adoption.',
        'Improves business competitiveness.'
      ],
      expanded: false
    },

    {
      icon: '🏭',
      title: 'Manufacturing Incentives',
      subtitle: 'Boosting local production.',
      points: [
        'Tax incentives for manufacturers.',
        'Support for plant and machinery investment.',
        'Encourages export-oriented industries.',
        'Promotes sustainable industrial growth.'
      ],
      expanded: false
    },

    {
      icon: '🌍',
      title: 'Export & Investment',
      subtitle: 'Helping Mauritian businesses expand.',
      points: [
        'Improved investment framework.',
        'Support for exporting companies.',
        'Measures to attract foreign investment.',
        'Strengthens international competitiveness.'
      ],
      expanded: false
    },

    {
      icon: '💰',
      title: 'Business Tax Measures',
      subtitle: 'Creating a fair business environment.',
      points: [
        'Changes to income tax rules.',
        'Updated corporate taxation measures.',
        'Support for long-term business growth.',
        'Encourages responsible investment.'
      ],
      expanded: false
    }

  ];

  toggle(selected: any) {

    this.cards.forEach(card => {

      if (card !== selected) {

        card.expanded = false;

      }

    });

    selected.expanded = !selected.expanded;

  }

}