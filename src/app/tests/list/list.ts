import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestService } from '../../services/test';
import { TestSummary } from '../../models/test';

@Component({
  selector: 'app-tests-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestsList {
  tests: TestSummary[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private testService: TestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.testService.getAllTests().subscribe({
      next: (data) => {
        this.tests = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des tests';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
