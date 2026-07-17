import { Component } from '@angular/core';
import { ChatbotComponent } from '../../components/chatbot/chatbot';

@Component({
  selector: 'app-social-welfare',
  standalone: true,
  imports: [ChatbotComponent],
  templateUrl: './social-welfare.html',
  styleUrl: './social-welfare.css'
})
export class SocialWelfare {

  cards = [

    {
      icon: '👴',
      title: 'State Age Pension Reform',
      subtitle: 'Modernising the retirement support system.',
      points: [
        'Basic Retirement Pension becomes the State Age Pension (SAP) from January 2027.',
        'Monthly pension set at Rs 16,555.',
        'Income-based means testing introduced.',
        'Flexible retirement options available.',
        'Delayed retirement provides a higher monthly pension.'
      ],
      expanded: false
    },

    {
      icon: '🤱',
      title: 'Extended Maternity Leave',
      subtitle: 'More support for working mothers.',
      points: [
        'Total maternity leave extended to 12 months.',
        'First 6 months paid at full salary.',
        'Optional additional 6 months at half pay.',
        'Supports early childcare and family wellbeing.'
      ],
      expanded: false
    },

    {
      icon: '👨‍👩‍👧',
      title: 'Extended Paternity Leave',
      subtitle: 'Encouraging greater family involvement.',
      points: [
        'Paid paternity leave increased from 4 weeks to 6 weeks.',
        'Allows fathers to support mothers after childbirth.',
        'Promotes stronger family bonding.',
        'Encourages better work-life balance.'
      ],
      expanded: false
    },

    {
      icon: '🌸',
      title: 'Menstrual Leave',
      subtitle: 'Supporting women in the workplace.',
      points: [
        'One paid day of menstrual leave per month.',
        'Applies to both public and private sectors.',
        'Supports women with severe menstrual symptoms.',
        'Promotes healthier and more inclusive workplaces.'
      ],
      expanded: false
    },

    {
      icon: '❤️',
      title: "Higher Carer's Allowance",
      subtitle: 'More financial assistance for carers.',
      points: [
        "Carer's Allowance increases from Rs 3,500 to Rs 4,250.",
        'Supports carers of elderly, disabled and seriously ill relatives.',
        'Helps families manage increasing living costs.'
      ],
      expanded: false
    },

    {
      icon: '🏠',
      title: 'Affordable Housing Programme',
      subtitle: 'Providing secure housing for vulnerable families.',
      points: [
        'Rs 2 billion allocated for low-income social housing.',
        'Accelerates construction of affordable homes.',
        'Additional Rs 150 million for serviced residential plots.',
        'Supports both low and middle-income families.'
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