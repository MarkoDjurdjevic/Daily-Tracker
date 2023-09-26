export interface IQuestion {
  id: number;
  question?: string | null;
}

export type NewQuestion = Omit<IQuestion, 'id'> & { id: null };
