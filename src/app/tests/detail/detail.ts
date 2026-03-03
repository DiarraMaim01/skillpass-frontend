import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestService } from '../../services/test';
import { TestSummary } from '../../models/test';

@Component({
  selector: 'app-test-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestDetail implements OnInit {
  test: TestSummary | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.cdr.markForCheck();
    this.testService.getTestById(id).subscribe({
      next: (data) => {
        this.test = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Test introuvable';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  startTest(): void {
    if (this.test) {
      this.router.navigate(['/tests', this.test.id, 'play']);
    }
  }
}
