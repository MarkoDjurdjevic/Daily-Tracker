import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserQuestion } from '../user-question.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-question.test-samples';

import { UserQuestionService } from './user-question.service';

const requireRestSample: IUserQuestion = {
  ...sampleWithRequiredData,
};

describe('UserQuestion Service', () => {
  let service: UserQuestionService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserQuestion | IUserQuestion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserQuestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a UserQuestion', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userQuestion = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userQuestion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserQuestion', () => {
      const userQuestion = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userQuestion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserQuestion', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserQuestion', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserQuestion', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserQuestionToCollectionIfMissing', () => {
      it('should add a UserQuestion to an empty array', () => {
        const userQuestion: IUserQuestion = sampleWithRequiredData;
        expectedResult = service.addUserQuestionToCollectionIfMissing([], userQuestion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userQuestion);
      });

      it('should not add a UserQuestion to an array that contains it', () => {
        const userQuestion: IUserQuestion = sampleWithRequiredData;
        const userQuestionCollection: IUserQuestion[] = [
          {
            ...userQuestion,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserQuestionToCollectionIfMissing(userQuestionCollection, userQuestion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserQuestion to an array that doesn't contain it", () => {
        const userQuestion: IUserQuestion = sampleWithRequiredData;
        const userQuestionCollection: IUserQuestion[] = [sampleWithPartialData];
        expectedResult = service.addUserQuestionToCollectionIfMissing(userQuestionCollection, userQuestion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userQuestion);
      });

      it('should add only unique UserQuestion to an array', () => {
        const userQuestionArray: IUserQuestion[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userQuestionCollection: IUserQuestion[] = [sampleWithRequiredData];
        expectedResult = service.addUserQuestionToCollectionIfMissing(userQuestionCollection, ...userQuestionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userQuestion: IUserQuestion = sampleWithRequiredData;
        const userQuestion2: IUserQuestion = sampleWithPartialData;
        expectedResult = service.addUserQuestionToCollectionIfMissing([], userQuestion, userQuestion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userQuestion);
        expect(expectedResult).toContain(userQuestion2);
      });

      it('should accept null and undefined values', () => {
        const userQuestion: IUserQuestion = sampleWithRequiredData;
        expectedResult = service.addUserQuestionToCollectionIfMissing([], null, userQuestion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userQuestion);
      });

      it('should return initial array if no UserQuestion is added', () => {
        const userQuestionCollection: IUserQuestion[] = [sampleWithRequiredData];
        expectedResult = service.addUserQuestionToCollectionIfMissing(userQuestionCollection, undefined, null);
        expect(expectedResult).toEqual(userQuestionCollection);
      });
    });

    describe('compareUserQuestion', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserQuestion(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserQuestion(entity1, entity2);
        const compareResult2 = service.compareUserQuestion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserQuestion(entity1, entity2);
        const compareResult2 = service.compareUserQuestion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserQuestion(entity1, entity2);
        const compareResult2 = service.compareUserQuestion(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
