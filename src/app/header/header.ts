import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  constructor(
    public authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.cdr.markForCheck();
  }
}
