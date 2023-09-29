import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question/service/question.service';
import { AccountService } from 'app/core/auth/account.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IQuestion } from '../question/question.model';
import { Observable } from 'rxjs';
import { UserQuestionService } from '../user-question/service/user-question.service';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'jhi-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.css']
})
export class UserActivitiesComponent implements OnInit {

  constructor(private  questionService: QuestionService, private accountService: AccountService, private http: HttpClient, private userQuestionService: UserQuestionService) { }

  currentUser: any;
  currentUserQuestions: any;
  private resourceUrl = '/api/questions';
  showForm: boolean = false;

  ngOnInit(): void {
    this.load();
  }

  load(){
    
    this.accountService.getAuthenticationState().subscribe(
      (res) =>{
        console.log(res);
        this.currentUser = res;
        console.log(this.currentUser.id)
      },(error) =>{
      console.log("desila se greska");
      }
    )
    
    this.userQuestionService.getUserQuestionsForCurrentUser().subscribe(
      (res) => {
        console.log(res);
        this.currentUserQuestions = res.body;
        console.log(this.currentUserQuestions);
        
      },
      (error) => {
        console.log("Desila se neka greška",error);
      }
    ); 
  }

  createQuestion(form: NgForm){
  
  }
}
