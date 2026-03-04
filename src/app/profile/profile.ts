import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestService } from '../services/test';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile implements OnInit {
  results: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private testService: TestService,
    public authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.testService.getMyResults().subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
         console.log('❌ Status:', err.status);
  console.log('❌ Détail:', err.error);
        this.errorMessage = 'Erreur lors du chargement des résultats';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get totalPoints(): number {
    return this.results.reduce((sum, r) => sum + r.score, 0);
  }

  get averageScore(): number {
    if (this.results.length === 0) return 0;
    const avg = this.results.reduce((sum, r) => sum + r.percentage, 0) / this.results.length;
    return Math.round(avg);
  }

  getMention(percentage: number): string {
    if (percentage >= 80) return '🏆';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '😐';
    return '💪';
  }
}
