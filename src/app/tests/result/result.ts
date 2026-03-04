import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import { Auth } from '../../services/auth';

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

  testTitre: string = '';
  userName: string = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
     public authService: Auth
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.testTitre = state.testTitre || 'Test';

     const userInfo = this.authService.getUserInfo();
     console.log('UserInfo:', userInfo);
console.log('State:', history.state);
  if (userInfo) {
    this.userName = `${userInfo.prenom} ${userInfo.nom}`;
  }

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

  downloadCertif(): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Fond
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Bordure extérieure
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageW - 20, pageH - 20);

  // Bordure intérieure
  doc.setLineWidth(0.5);
  doc.rect(14, 14, pageW - 28, pageH - 28);


  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(99, 102, 241);
  doc.text('SkillPass', pageW / 2, 35, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('CERTIFICAT DE RÉUSSITE', pageW / 2, 47, { align: 'center' });

  // Ligne décorative
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(1);
  doc.line(pageW / 2 - 60, 52, pageW / 2 + 60, 52);

  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text('Ce certificat atteste que', pageW / 2, 70, { align: 'center' });


  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(30, 41, 59);
  doc.text(this.userName || 'Utilisateur SkillPass', pageW / 2, 85, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text('a complété avec succès le test', pageW / 2, 100, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
doc.text(this.testTitre, pageW / 2, 115, { align: 'center' });

  // Score
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text(`avec un score de`, pageW / 2, 130, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(this.pourcentage >= 60 ? 34 : 239, this.pourcentage >= 60 ? 197 : 68, this.pourcentage >= 60 ? 94 : 68);
  doc.text(`${this.pourcentage}%`, pageW / 2, 148, { align: 'center' });

  // Stats
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text(`${this.score} / ${this.totalPoints} points  ·  ${this.totalQuestions} questions  ·  ${this.tempsFormate}`, pageW / 2, 160, { align: 'center' });

  // Date
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text(`Délivré le ${date}`, pageW / 2, pageH - 22, { align: 'center' });

  doc.save(`skillpass-certificat-${this.testId}.pdf`);
}
}
