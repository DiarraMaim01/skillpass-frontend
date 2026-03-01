import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuestionService } from '../../services/question';
import { Question } from '../../models/question';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  categories: string[] = ['JAVA', 'SPRING', 'SQL', 'JAVASCRIPT', 'DOCKER', 'GIT'];
  selectedCategory: string = 'TOUTES';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    public questionService: QuestionService,
    public authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.questionService.getAllQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.filterQuestions();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des questions';
        this.isLoading = false;
        this.cdr.markForCheck();
        console.error('Erreur:', error);
      }
    });
  }

  filterQuestions(): void {
    if (this.selectedCategory === 'TOUTES') {
      this.filteredQuestions = this.questions;
    } else {
      this.filteredQuestions = this.questions.filter(
        q => q.categorie === this.selectedCategory
      );
    }
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterQuestions();
    this.cdr.markForCheck();
  }

  deleteQuestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      this.questionService.deleteQuestion(id).subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q.id !== id);
          this.filterQuestions();
          this.cdr.markForCheck();
        },
        error: (error) => {
          alert('Erreur lors de la suppression');
          console.error(error);
        }
      });
    }
  }
}
