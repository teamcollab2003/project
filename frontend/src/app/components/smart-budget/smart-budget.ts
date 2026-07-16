import { Component, ChangeDetectorRef } from '@angular/core'; // 🚀 Added ChangeDetectorRef
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-smart-budget',
  standalone: true, 
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './smart-budget.html', 
  styleUrl: './smart-budget.css'
})
export class SmartBudgetComponent {
  selectedPersona: string = 'worker'; 
  aiResponse: string = ''; // Holds response analysis string
  isLoading: boolean = false; // Controls loading state representation

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

  // 🚀 Inject ChangeDetectorRef alongside HttpClient
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  selectPersona(id: string) {
    this.selectedPersona = id;
  }

  submitForm() {
    const payload = {
      persona: this.selectedPersona,
      parameters: this.formData
    };
    
    console.log('Sending to Python Backend:', payload);
    this.isLoading = true;
    this.aiResponse = ''; // Clear previous report values
    this.cdr.detectChanges(); // Force UI to register loading state

    // Live backend HTTP POST analysis request
    this.http.post<any>('http://localhost:8000/api/budget/analyze', payload)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Backend response:', response);
          this.aiResponse = response.analysis; // Capture response payload
          
          // 🚀 FORCE UPDATE: Tells Angular to draw the received text to the screen instantly
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          this.isLoading = false;
          console.error('API Error:', err);
          alert('Error communicating with backend! Check the terminal/console.');
          this.cdr.detectChanges();
        }
      });
  }
}