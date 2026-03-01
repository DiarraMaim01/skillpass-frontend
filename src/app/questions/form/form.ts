import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuestionService } from '../../services/question';
import { QuestionRequest } from '../../models/question';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form implements OnInit {
  isEditMode: boolean = false;
  questionId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  categories = ['JAVA', 'SPRING', 'SQL', 'JAVASCRIPT', 'DOCKER', 'GIT'];
  niveaux = ['DÉBUTANT', 'INTERMÉDIAIRE', 'EXPERT'];

  form: QuestionRequest = {
    titre: '',
    contenu: '',
    categorie: 'JAVA',
    niveau: 'DÉBUTANT',
    points: 5,
    options: [
      { texte: '', correcte: false },
      { texte: '', correcte: false },
      { texte: '', correcte: false },
      { texte: '', correcte: false },
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.questionId = Number(id);
      this.loadQuestion(this.questionId);
    }
  }

  loadQuestion(id: number): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.questionService.getQuestionById(id).subscribe({
      next: (data) => {
        this.form = {
          titre: data.titre,
          contenu: data.contenu,
          categorie: data.categorie,
          niveau: data.niveau,
          points: data.points,
          options: data.options.map(o => ({ texte: o.texte, correcte: o.correcte }))
        };
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

  addOption(): void {
    this.form.options.push({ texte: '', correcte: false });
    this.cdr.markForCheck();
  }

  removeOption(index: number): void {
    if (this.form.options.length > 2) {
      this.form.options.splice(index, 1);
      this.cdr.markForCheck();
    }
  }

  setCorrect(index: number): void {
    this.form.options = this.form.options.map((opt, i) => ({
      ...opt,
      correcte: i === index
    }));
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (!this.form.options.some(o => o.correcte)) {
      this.errorMessage = 'Veuillez sélectionner une bonne réponse';
      return;
    }
    if (this.form.options.some(o => !o.texte.trim())) {
      this.errorMessage = 'Toutes les options doivent être remplies';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const request$ = this.isEditMode && this.questionId
      ? this.questionService.updateQuestion(this.questionId, this.form)
      : this.questionService.createQuestion(this.form);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/questions']);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la sauvegarde';
        this.isLoading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }
}
