import dayjs from 'dayjs/esm';
import { IQuestion } from 'app/entities/question/question.model';
import { IUser } from 'app/entities/user/user.model';

export interface IAnswer {
  id: number;
  result?: number | null;
  date?: dayjs.Dayjs | null;
  question?: any; //Pick<IQuestion, 'id'> | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewAnswer = Omit<IAnswer, 'id'> & { id: null };
