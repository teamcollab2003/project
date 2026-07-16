import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';     

@Component({
  selector: 'app-smart-budget',
  standalone: true,                           // <-- Fixes Error 1
  imports: [CommonModule, FormsModule], 
  templateUrl: './smart-budget.html',         // <-- Fixes Error 2
  styleUrl: './smart-budget.css'
})
export class SmartBudgetComponent {
  selectedPersona: string = 'worker'; 

  personas = [
    { id: 'student', title: 'Student', icon: '🎓' },
    { id: 'worker', title: 'Worker', icon: '💼' },
    { id: 'senior', title: 'Senior', icon: '👴' },
    { id: 'sme', title: 'SME', icon: '🏪' }
  ];

  formData: any = {
    age: null,
    studyLevel: '',
    studyLocation: '',
    transport: '',
    partTimeWork: '',
    salaryRange: '',
    sector: '',
    dependents: '',
    housingStatus: '',
    ageBracket: '',
    employmentStatus: '',
    allowances: '',
    homeowner: '',
    businessSector: '',
    turnover: '',
    employees: '',
    importExport: '',
    femaleEntrepreneur: ''
  };

  selectPersona(id: string) {
    this.selectedPersona = id;
  }

  submitForm() {
    const payload = {
      persona: this.selectedPersona,
      parameters: this.formData
    };
    
    console.log('Sending to Python Backend:', payload);
    // Future step: Add HttpClient to POST this payload to your FastAPI backend
    alert('Form submitted! Check the console to see the JSON payload.');
  }
}