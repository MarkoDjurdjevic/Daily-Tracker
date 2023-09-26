import { IUserQuestion, NewUserQuestion } from './user-question.model';

export const sampleWithRequiredData: IUserQuestion = {
  id: 25081,
};

export const sampleWithPartialData: IUserQuestion = {
  id: 10569,
};

export const sampleWithFullData: IUserQuestion = {
  id: 59221,
};

export const sampleWithNewData: NewUserQuestion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
