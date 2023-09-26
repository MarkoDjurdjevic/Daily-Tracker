import dayjs from 'dayjs/esm';

import { IAnswer, NewAnswer } from './answer.model';

export const sampleWithRequiredData: IAnswer = {
  id: 52963,
};

export const sampleWithPartialData: IAnswer = {
  id: 40964,
};

export const sampleWithFullData: IAnswer = {
  id: 1501,
  result: 2600,
  date: dayjs('2023-09-25'),
};

export const sampleWithNewData: NewAnswer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
