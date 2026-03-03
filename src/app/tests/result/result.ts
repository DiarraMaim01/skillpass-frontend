import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-test-result',
  imports: [CommonModule, RouterLink],
  templateUrl: './result.html',
  styleUrl: './result.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestResult implements OnInit {
  score = 0;
  totalPoints = 0;
  totalQuestions = 0;
  timeSpentSeconds = 0;
  testId = 0;
  pourcentage = 0;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const state = history.state;

    if (!state || state.score === undefined) {
      this.router.navigate(['/tests']);
      return;
    }

    this.score = state.score;
    this.totalPoints = state.totalPoints;
    this.totalQuestions = state.totalQuestions;
    this.timeSpentSeconds = state.timeSpentSeconds;
    this.testId = state.testId;
    this.pourcentage = state.pourcentage;
    this.cdr.markForCheck();
  }

  get mention(): string {
    if (this.pourcentage >= 80) return '🏆 Excellent !';
    if (this.pourcentage >= 60) return '👍 Bien !';
    if (this.pourcentage >= 40) return '😐 Passable';
    return '💪 À améliorer';
  }

  get scoreColor(): string {
    if (this.pourcentage >= 80) return '#22c55e';
    if (this.pourcentage >= 60) return '#6366f1';
    if (this.pourcentage >= 40) return '#f59e0b';
    return '#ef4444';
  }

  get tempsFormate(): string {
    const min = Math.floor(this.timeSpentSeconds / 60);
    const sec = this.timeSpentSeconds % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  }
}
