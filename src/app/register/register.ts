import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email: string = '';
  password: string = '';
  nom: string = '';
  prenom: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      email: this.email,
      password: this.password,
      nom: this.nom,
      prenom: this.prenom
    }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 400) {
          this.errorMessage = 'Email déjà utilisé ou données invalides';
        } else {
          this.errorMessage = 'Erreur de connexion au serveur';
        }
        console.error('Register error:', error);
      }
    });
  }

}
