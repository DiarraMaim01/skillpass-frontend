import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../services/test';
import { QuestionReponse } from '../../models/test';

@Component({
  selector: 'app-test-play',
  imports: [CommonModule],
  templateUrl: './play.html',
  styleUrl: './play.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestPlay implements OnInit {
  testId!: number;
  questions: QuestionReponse[] = [];
  currentIndex = 0;
  selectedOptionId: number | null = null;
  reponses: { questionId: number; optionId: number }[] = [];
  isLoading = false;
  errorMessage = '';
  startTime!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.cdr.markForCheck();
    this.testService.getTestQuestions(this.testId).subscribe({
      next: (data) => {
        this.questions = data;
        this.isLoading = false;
        this.startTime = Date.now();
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des questions';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get currentQuestion(): QuestionReponse {
    return this.questions[this.currentIndex];
  }

  get progression(): number {
    return Math.round(((this.currentIndex + 1) / this.questions.length) * 100);
  }

  selectOption(optionId: number): void {
    this.selectedOptionId = optionId;
    this.cdr.markForCheck();
  }

  next(): void {
    if (this.selectedOptionId === null) return;

    this.reponses.push({
      questionId: this.currentQuestion.id,
      optionId: this.selectedOptionId
    });

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.selectedOptionId = null;
      this.cdr.markForCheck();
    } else {
      this.submitTest();
    }
  }

submitTest(): void {
  const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
  const selectedOptionIds = this.reponses.map(r => r.optionId);

  this.testService.calculateScore(this.testId, selectedOptionIds).subscribe({
    next: (result: any) => {  // ← result est un objet
      this.router.navigate(['/tests', this.testId, 'result'], {
        state: {
          score: result.score,              // ← extrais chaque champ
          totalPoints: result.totalPoints,
          totalQuestions: result.totalQuestions,
          pourcentage: result.pourcentage,
          timeSpentSeconds: timeSpent,
          testId: this.testId
        }
      });
    },
    error: (err) => {
      console.log('❌ Erreur soumission:', err.status);
      console.log('❌ Détail:', err.error);
      this.errorMessage = 'Erreur lors de la soumission';
      this.cdr.markForCheck();
    }
  });
}
}
