export interface Option {
  id: number;
  texte: string;
  correcte: boolean;
}

export interface Question {
  id: number;
  titre: string;
  contenu: string;
  categorie: string;
  niveau: string;
  points: number;
  options: Option[];
  createdAt?: string;
}

// Pour la création (sans id)
export interface QuestionRequest {
  titre: string;
  contenu: string;
  categorie: string;
  niveau: string;
  points: number;
  options: Omit<Option, 'id'>[];
}
