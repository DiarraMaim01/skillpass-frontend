import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestSummary, ResultatTest } from '../models/test';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = 'http://localhost:8080/api/tests';

  constructor(private http: HttpClient) {}

  // GET : tous les tests
  getAllTests(): Observable<TestSummary[]> {
    return this.http.get<TestSummary[]>(this.apiUrl);
  }

  // GET : test par id
  getTestById(id: number): Observable<TestSummary> {
    return this.http.get<TestSummary>(`${this.apiUrl}/${id}`);
  }

  // GET : questions d'un test pour le jouer
  getTestQuestions(id: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${id}/questions`);
  }

  // POST : calculer le score
  calculateScore(testId: number, selectedOptionIds: number[]): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/${testId}/calculate-score`, selectedOptionIds);
  }

  // POST : créer un test aléatoire
  createRandomTest(titre: string, description: string, categorie: string, questionCount: number): Observable<TestSummary> {
    return this.http.post<TestSummary>(
      `${this.apiUrl}/random?titre=${titre}&description=${description}&categorie=${categorie}&questionCount=${questionCount}`,
      {}
    );
  }

  // POST : ajouter une question à un test
  addQuestion(testId: number, questionId: number): Observable<TestSummary> {
    return this.http.post<TestSummary>(`${this.apiUrl}/${testId}/questions/${questionId}`, {});
  }

  // DELETE : retirer une question d'un test
  removeQuestion(testId: number, questionId: number): Observable<TestSummary> {
    return this.http.delete<TestSummary>(`${this.apiUrl}/${testId}/questions/${questionId}`);
  }

  // DELETE : supprimer un test
  deleteTest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET : recherche par titre
  searchTests(titre: string): Observable<TestSummary[]> {
    return this.http.get<TestSummary[]>(`${this.apiUrl}/search?titre=${titre}`);
  }

  saveResult(body: any): Observable<any> {
  return this.http.post<any>('http://localhost:8080/api/results', body);
}

getMyResults(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8080/api/results/me');
}
}
