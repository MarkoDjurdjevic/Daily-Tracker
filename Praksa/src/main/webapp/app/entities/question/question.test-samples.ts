import { IQuestion, NewQuestion } from './question.model';

export const sampleWithRequiredData: IQuestion = {
  id: 47363,
};

export const sampleWithPartialData: IQuestion = {
  id: 59352,
  question: 'copying Proactive',
};

export const sampleWithFullData: IQuestion = {
  id: 66695,
  question: 'tan methodology',
};

export const sampleWithNewData: NewQuestion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
