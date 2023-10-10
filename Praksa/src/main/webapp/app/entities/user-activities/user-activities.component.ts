import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuestionService } from '../question/service/question.service';
import { AccountService } from 'app/core/auth/account.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IQuestion } from '../question/question.model';
import { Observable } from 'rxjs';
import { UserQuestionService } from '../user-question/service/user-question.service';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AnswerService } from '../answer/service/answer.service';
import dayjs from 'dayjs';
import { IAnswer } from '../answer/answer.model';



@Component({
  selector: 'jhi-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.css']
})
export class UserActivitiesComponent implements OnInit {

  constructor(private  questionService: QuestionService, private accountService: AccountService, private http: HttpClient, 
    private userQuestionService: UserQuestionService, private router: Router, private answerService: AnswerService) { }

  currentUser: any;
  currentUserQuestions: any;
  currentUserAnswers: IAnswer[] = [];
  private resourceUrl = '/api/questions';
  showForm: boolean = false;
  isChecked: boolean = false;
  currentDate: Date = new Date();
 

  ngOnInit(): void {
    this.load();
  }

  load(){
    //dobijanje usera
    this.accountService.getAuthenticationState().subscribe(
      (res) =>{
        console.log(res);
        this.currentUser = res;
      },(error) =>{
      console.log("desila se greska");
      }
    )
    // dobijanje user questiona
    this.userQuestionService.getUserQuestionsForCurrentUser().subscribe(
      (res) => {
        this.currentUserQuestions = res.body;
        console.log(this.currentUserQuestions);
      },
      (error) => {
        console.log("Desila se neka greška",error);
      }
    ); 
    // dobijanje odgovora
      this.answerService.query().subscribe(
        (res) => {
          if(res.body){
            const filteredAnswers = res.body.filter(answer => answer.user && answer.user.id === this.currentUser.id);
            this.currentUserAnswers = filteredAnswers;
            console.log("Odgovori",filteredAnswers);
          }
          
          
        },(error)=> {
          console.log("Error",error)
        }
      )
    
  }
  //createUserQuestionImmediatly

  createQuestion(form: NgForm){
    console.log(`form submitted`)
    console.log(form.value.newQuestionText)
     const userQuestion = {
      question: {
        question: form.value.newQuestionText
      },
      user: this.currentUser,
     }

  this.userQuestionService.createUserQuestionImmediatly(userQuestion).subscribe(
    (res) => {
      console.log(res);
      form.reset();
      this.load();
      this.showForm = false;
    },(error) => console.log(`Something bad happened`, error)
  );
}



  previousDay() {
    this.incrementDay(-1);
    console.log(this.currentDate)
    this.load();
    
  }

  nextDay() {
    this.incrementDay(1);
    console.log(this.currentDate)
    this.load();
  }

  private incrementDay(delta: number): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() + delta);
  }

  submitAnswer(event: any, question1: any){
    console.log(event);
    console.log(question1);
    if(event.target.checked === true){
     const answer =  {
      result: 1,
      date: dayjs(this.currentDate).format("YYYY-MM-DD"),
      user: this.currentUser,
      question: {
        question: question1.question
      }
     }
     console.log(answer)
     console.log(`Checkbox is checked`)
     this.answerService.createAnswer(answer).subscribe((res)=>{
      console.log(`RESPONSE`, res);
     },(error)=>{
      console.log("Error:",error);
     })
    } else {
      console.log("checkbox isn't checked")
      const answer = this.currentUserAnswers.find(answer => answer.question && answer.question.id === question1.id);
      const answerId: number | undefined = answer?.id;
      console.log(`answer Id: `,answerId);
      console.log("question id", question1.id);

      if(answerId != undefined){
        this.answerService.delete(answerId).subscribe(
          (res)=> {
            console.log("Uspesno obrisan odgovor:",res);
          },(error)=>{
            console.log("desila se neka greska",error);
          }
        )
      }
      
      
      
    }

  }

  isItChecked(questionId: number): boolean {
    const formattedCurrentDate  = dayjs(this.currentDate).format('YYYY-MM-DD');
    //console.log(`Ovo je trenutni datum:`,formattedCurrentDate);
    const dateValue = this.currentUserAnswers[0]?.date?.format('YYYY-MM-DD');
    //console.log(`Ovo je date dayJS: `,dateValue);
    return this.currentUserAnswers.some(answer => answer.question && answer.question.id === questionId && answer?.date?.format('YYYY-MM-DD') === formattedCurrentDate);
  }



  
}
