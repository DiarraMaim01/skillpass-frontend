import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuestionService } from '../../services/question';
import { Question } from '../../models/question';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Detail implements OnInit {
  question: Question | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.cdr.markForCheck();
    this.questionService.getQuestionById(id).subscribe({
      next: (data) => {
        this.question = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Question introuvable';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  delete(): void {
    if (!this.question) return;
    if (confirm('Supprimer cette question ?')) {
      this.questionService.deleteQuestion(this.question.id).subscribe({
        next: () => this.router.navigate(['/questions']),
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }
}
