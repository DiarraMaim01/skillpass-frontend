import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, QuestionRequest } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
   private apiUrl = 'http://localhost:8080/api/questions';

  constructor(private http: HttpClient) { }

  // GET : TOUTES LES QUESTIONS
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  // GET : QUESTION PAR ID
  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  // GET : QUESTIONS ALÉATOIRES
  getRandomQuestions(count: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/random?count=${count}`);
  }

  // GET : QUESTIONS PAR CATÉGORIE
  getQuestionsByCategory(categorie: string, count: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/category/${categorie}?count=${count}`);
  }

  // POST : CRÉER UNE QUESTION
  createQuestion(question: QuestionRequest): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  // PUT : METTRE À JOUR
  updateQuestion(id: number, question: QuestionRequest): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question);
  }

  // DELETE : SUPPRIMER
  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET : STATISTIQUES
  getStats(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/stats`);
  }
}
