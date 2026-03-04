import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TestService } from '../../services/test';
import { QuestionService } from '../../services/question';
import { TestSummary } from '../../models/test';
import { Question } from '../../models/question';

@Component({
  selector: 'app-tests-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestsAdmin implements OnInit {
  tests: TestSummary[] = [];
  questions: Question[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Formulaire création test aléatoire
  newTest = {
    titre: '',
    description: '',
    categorie: 'SPRING',
    questionCount: 5
  };
  categories = ['JAVA', 'SPRING', 'SQL', 'JAVASCRIPT', 'DOCKER', 'GIT'];

  // Ajout question à un test
  selectedTestId: number | null = null;
  selectedQuestionId: number | null = null;

  constructor(
    private testService: TestService,
    private questionService: QuestionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTests();
    this.loadQuestions();
  }

  loadTests(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.testService.getAllTests().subscribe({
      next: (data) => {
        this.tests = data;
        console.log('✅ Tests reçus:', data);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erreur chargement tests';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  createRandomTest(): void {
    if (!this.newTest.titre.trim()) {
      this.errorMessage = 'Le titre est requis';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.testService.createRandomTest(
      this.newTest.titre,
      this.newTest.description,
      this.newTest.categorie,
      this.newTest.questionCount
    ).subscribe({
      next: () => {
        this.successMessage = 'Test créé avec succès !';
        this.newTest = { titre: '', description: '', categorie: 'SPRING', questionCount: 5 };
        this.loadTests();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addQuestionToTest(): void {
    if (!this.selectedTestId || !this.selectedQuestionId) {
      this.errorMessage = 'Sélectionne un test et une question';
      return;
    }
    this.testService.addQuestion(this.selectedTestId, this.selectedQuestionId).subscribe({
      next: () => {
        this.successMessage = 'Question ajoutée !';
        this.selectedTestId = null;
        this.selectedQuestionId = null;
        this.loadTests();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'ajout';
        this.cdr.markForCheck();
      }
    });
  }

  deleteTest(id: number): void {
    if (confirm('Supprimer ce test ?')) {
      this.testService.deleteTest(id).subscribe({
        next: () => {
          this.successMessage = 'Test supprimé !';
          this.loadTests();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la suppression';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
