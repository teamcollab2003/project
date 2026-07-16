import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-budget-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container" style="max-width: 1200px; margin: auto; padding: 20px;">

      <div *ngIf="!isDataLoaded && !errorMessage" style="text-align: center; padding: 50px; font-size: 20px;">
        ⏳ Loading Budget Data...
      </div>

      <div *ngIf="errorMessage" style="text-align: center; padding: 50px; color: #dc3545; background: #ffe9e9; border-radius: 8px;">
        🚨 {{ errorMessage }}
      </div>

      <div *ngIf="isDataLoaded && !errorMessage" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">

        <div class="chart-card" style="grid-column: span 2; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <h2 style="text-align: center; color: #333; font-family: sans-serif;">Budget Allocation by Sector</h2>
          <canvas baseChart
                  [data]="sectorChartData"
                  [options]="sectorChartOptions"
                  [type]="'bar'">
          </canvas>
        </div>

        <div class="chart-card" style="grid-column: span 2; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <h2 style="text-align: center; color: #333; font-family: sans-serif;">Capital vs. Recurrent Spending</h2>
          <div style="max-width: 500px; margin: auto;">
            <canvas baseChart
                    [data]="categoryChartData"
                    [options]="categoryChartOptions"
                    [type]="'doughnut'">
            </canvas>
          </div>
        </div>

      </div>
    </div>
  `
})
export class BudgetChartComponent implements OnInit {
  isDataLoaded: boolean = false;
  errorMessage: string = '';

  // --- CHART 1 CONFIG (Horizontal Bar for Sectors) ---
  public sectorChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y', // This turns the bar chart sideways! Perfect for long names.
    plugins: {
      legend: { display: false }, // We hide the legend because the labels are on the left
      tooltip: { callbacks: { label: (ctx) => ` Rs ${ctx.raw} Million` } }
    }
  };
  public sectorChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  // --- CHART 2 CONFIG (Doughnut for Category) ---
  public categoryChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { callbacks: { label: (ctx) => ` Rs ${ctx.raw} Million` } }
    }
  };
  public categoryChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };


  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any>('/assets/budget_data_clean.json').subscribe({
      next: (budgetData) => {
        try {
          this.processSpending(budgetData);
          this.isDataLoaded = true;
          this.cdr.detectChanges();
        } catch (error: any) {
          this.errorMessage = "Error mapping chart data: " + error.message;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.errorMessage = "Failed to load JSON file.";
        this.cdr.detectChanges();
      }
    });
  }

  private processSpending(budgetData: any) {
    const rootData = budgetData?.budget_data ? budgetData.budget_data : budgetData;
    const spendingArr = rootData?.government_spending;

    if (!spendingArr || !Array.isArray(spendingArr)) {
      throw new Error("Could not find the 'government_spending' array in the JSON file.");
    }

    // 1. We use Maps to combine duplicates and sum up the totals
    const sectorMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();

    spendingArr.forEach((item: any) => {
      const sector = item.ministry_or_department || 'Other';
      const category = item.category || 'Uncategorized';
      const amount = Number(item.allocated_amount_mur_million) || 0;

      // Add to the existing total for this sector/category
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + amount);
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    });

    // 2. Sort the sectors from highest spending to lowest
    const sortedSectors = Array.from(sectorMap.entries()).sort((a, b) => b[1] - a[1]);

    // 3. Map the data to the Bar Chart (Adding the Rs value directly into the label text!)
    this.sectorChartData = {
      labels: sortedSectors.map(s => `${s[0]} (Rs ${s[1]}M)`), // Adds the value to the label
      datasets: [
        {
          data: sortedSectors.map(s => s[1]),
          label: 'Allocated Amount (M)',
          backgroundColor: '#007bff',
          borderRadius: 4
        }
      ]
    };

    // 4. Map the data to the Doughnut Chart
    this.categoryChartData = {
      labels: Array.from(categoryMap.keys()).map(k => `${k} (Rs ${categoryMap.get(k)}M)`),
      datasets: [
        {
          data: Array.from(categoryMap.values()),
          backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#6610f2']
        }
      ]
    };
  }
}
