import { IUser } from 'app/entities/user/user.model';
import { IQuestion } from 'app/entities/question/question.model';

export interface IUserQuestion {
  id: number;
  user?: Pick<IUser, 'id'> | null;
  question?: Pick<IQuestion, 'id'> | null;
}

export type NewUserQuestion = Omit<IUserQuestion, 'id'> & { id: null };
