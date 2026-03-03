export interface TestSummary {
  id: number;
  titre: string;
  description: string;
  dureeMinutes: number;
  nombreQuestions: number;
  dureeEstimeeMinutes: number;
}

export interface QuestionReponse {
  id: number;
  titre: string;
  contenu: string;
  options: {
    id: number;
    texte: string;
  }[];
}

export interface ReponseUtilisateur {
  questionId: number;
  optionId: number;
}

export interface ResultatTest {
  id?: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt?: string;
}

export interface ScoreRequest {
  reponses: ReponseUtilisateur[];
}
