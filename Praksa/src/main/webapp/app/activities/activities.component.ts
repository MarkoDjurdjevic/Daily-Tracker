import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityArrayResponseType, QuestionService } from '../entities/question/service/question.service';
import { IQuestion } from '../entities/question/question.model';

@Component({
  selector: 'jhi-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  questions: IQuestion[] = [];

  constructor(private questionService: QuestionService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.questionService.query().subscribe({
      next: (res: EntityArrayResponseType) => {
        console.log(res);
        this.questions = res.body || [];
      },
    });
  }
}
