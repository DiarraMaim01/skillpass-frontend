import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
export class TestPlay implements OnInit, OnDestroy {
  testId!: number;
  questions: QuestionReponse[] = [];
  currentIndex = 0;
  selectedOptionId: number | null = null;
  reponses: { questionId: number; optionId: number }[] = [];
  isLoading = false;
  errorMessage = '';
  startTime!: number;
  timeLeft: number = 0;
  timerInterval: any;
  testTitre: string = '';


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

    this.testService.getTestById(this.testId).subscribe({
      next: (test: any) => {
        this.timeLeft = test.dureeMinutes * 60;
         this.testTitre = test.titre;
        this.testService.getTestQuestions(this.testId).subscribe({
          next: (data) => {
            this.questions = data;
            this.isLoading = false;
            this.startTime = Date.now();
            this.startTimer();
            this.cdr.markForCheck();
          },
          error: () => {
            this.errorMessage = 'Erreur lors du chargement des questions';
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du test';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.submitTest();  // ← soumet automatiquement
      }
      this.cdr.markForCheck();
    }, 1000);
  }

  get timerFormate(): string {
    const min = Math.floor(this.timeLeft / 60);
    const sec = this.timeLeft % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  get timerColor(): string {
    if (this.timeLeft <= 30) return '#ef4444';
    if (this.timeLeft <= 60) return '#f59e0b';
    return '#6366f1';
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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
    clearInterval(this.timerInterval);
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
    const selectedOptionIds = this.reponses.map(r => r.optionId);

    this.testService.calculateScore(this.testId, selectedOptionIds).subscribe({
      next: (result: any) => {
        this.testService.saveResult({
          testId: this.testId,
          score: result.score,
          totalPoints: result.totalPoints,
          totalQuestions: result.totalQuestions,
          correctAnswers: result.score,
          timeSpentSeconds: timeSpent
        }).subscribe({
          next: () => {
            this.router.navigate(['/tests', this.testId, 'result'], {
              state: {
                score: result.score,
                totalPoints: result.totalPoints,
                totalQuestions: result.totalQuestions,
                pourcentage: result.pourcentage,
                timeSpentSeconds: timeSpent,
                testId: this.testId,
                testTitre: this.testTitre
              }
            });
          },
          error: () => {
            this.router.navigate(['/tests', this.testId, 'result'], {
              state: {
                score: result.score,
                totalPoints: result.totalPoints,
                totalQuestions: result.totalQuestions,
                pourcentage: result.pourcentage,
                timeSpentSeconds: timeSpent,
                testId: this.testId,
                testTitre: this.testTitre  // ← ajoute ça

              }
            });
          }
        });
      },
      error: (err) => {
        console.log('❌ Erreur soumission:', err.status);
        this.errorMessage = 'Erreur lors de la soumission';
        this.cdr.markForCheck();
      }
    });
  }
}
