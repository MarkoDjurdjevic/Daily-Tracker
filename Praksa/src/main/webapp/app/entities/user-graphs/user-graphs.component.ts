import { Component, OnInit } from '@angular/core';
import { IAnswer } from '../answer/answer.model';
import { AccountService } from 'app/core/auth/account.service';
import { AnswerService } from '../answer/service/answer.service';
import { UserQuestionService } from '../user-question/service/user-question.service';
import { Chart,ChartType} from "chart.js/auto"
import 'chartjs-adapter-date-fns';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'jhi-user-graphs',
  templateUrl: './user-graphs.component.html',
  styleUrls: ['./user-graphs.component.scss']
})
export class UserGraphsComponent implements OnInit {

  currentUserAnswers: IAnswer[] = [];
  currentUser: any;
  currentUserQuestions: any;
  chart: any;
  day: any = [];
  week: any = [];

  day2: any = [];
  week2: any = [];

  day3: any = [];
  week3: any = [];

  formattedDates: any;
  IdQuestionFromAnswer: any;
  currentFilteredQuestions: any = [];

  userMap1: any = new Map();
  userMap2: any = new Map();
  userMap3: any = new Map();

  counts1: any = [];
  counts2: any = [];
  counts3: any = [];


  constructor(private accountService: AccountService, private answerService: AnswerService,private userQuestionService: UserQuestionService) { }

   ngOnInit(): void {
     this.load();
    
  }

   load(): void{
    
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
        console.log(`PITANJA:`,this.currentUserQuestions);
      },
      (error) => {
              console.log("Desila se neka greška",error);
      }
    );
    

    // dobijanje odgovora
    this.answerService.query().subscribe(
      (res) => {
        if(res.body){

          //ODGOVORI TRENUTNOG KORISNIKA
          const filteredAnswers = res.body.filter(answer => answer.user && answer.user.id === this.currentUser.id);
          this.currentUserAnswers = filteredAnswers;
          console.log("Odgovori",this.currentUserAnswers);
          //FORMATIRANI DATUMI
          this.formattedDates = this.currentUserAnswers.map(answer => answer.date?.format('YYYY-MM-DD'));
          console.log(`formatirani datumi ${this.formattedDates.map}`)
          // IDOV-I PITANJA POVEZANIH SA ODGOVOROM
          this.IdQuestionFromAnswer = this.currentUserAnswers.map(answer => answer.question?.id);
          console.log("ID-EVI:",this.IdQuestionFromAnswer);
          //ARRAY SVIH PITANJA
          for(let question of this.currentUserQuestions){
            if(this.IdQuestionFromAnswer.includes(question.question?.id)) this.currentFilteredQuestions.push(question.question?.question)
          }
          // ZA AKTIVNOSTI

          
          for (let answer of this.currentUserAnswers) {
            const questionText = answer.question?.question;
            const result = answer.result;
            //console.log(questionText)
            if (questionText === this.currentFilteredQuestions[0]) {
              this.userMap1.set(answer.date?.format('YYYY-MM-DD HH:mm:ss [GMT]ZZ'), answer.result);
            } else if (questionText === this.currentFilteredQuestions[1]) {
              this.userMap2.set(answer.date?.format('YYYY-MM-DD HH:mm:ss [GMT]ZZ'), answer.result);
            } else if (questionText === this.currentFilteredQuestions[2]) {
              this.userMap3.set(answer.date?.format('YYYY-MM-DD HH:mm:ss [GMT]ZZ'), answer.result);
            }      
          }     
          console.log(this.currentFilteredQuestions)
          this.createChart();
        } 
      },(error)=> {
        console.log("Error",error)
      }
    )
  }
  
  timeFrame(period: string) {
    console.log(period);
    let datasets: any = this.chart.data.datasets;

    if (period === 'day') {
      this.chart.options.scales.x.time.unit = 'day';
      datasets[0].data = this.day;
      datasets[1].data = this.day2;
      datasets[2].data = this.day3;
    } else if (period === 'week') {
      this.chart.options.scales.x.time.unit = 'week';
       
        datasets[0].data = this.week;
        datasets[1].data = this.week2;
        datasets[2].data = this.week3;
      

      console.log(datasets)
      
    }
  
    this.chart.update();
  }

  countOccurrencesInMap(userMap:any, startDate:any = 0, endDate:any = 0) {
    let counts = [0, 0, 0, 0];
    for (let [key, value] of userMap.entries()) {
      const date = Date.parse(key);
      for (let i = 0; i < 4; i++) {
        const weekStartDate = Date.parse(startDate);
        const weekEndDate = Date.parse(endDate);
        if (date >= weekStartDate && date < weekEndDate) {
          counts[i]++;
          break;
        }
      }
    }
    return counts;
  }

  


  createChart(){ 
    this.day = [
      {x: Date.parse('2023-10-01 00:00:00 GMT+0200'), y: this.userMap1.get('2023-10-01 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-02 00:00:00 GMT+0200'), y: this.userMap1.get('2023-10-02 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-03 00:00:00 GMT+0200'), y: this.userMap1.get('2023-10-03 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-04 00:00:00 GMT+0200'), y: this.userMap1.get('2023-10-04 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-05 00:00:00 GMT+0200'), y: this.userMap1.get('2023-10-05 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-06 00:00:00 GMT+0200'), y: this.userMap1.get('2023-10-06 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-07 00:00:00 GMT+0200'), y: this.userMap1.get('2023-10-07 00:00:00 GMT+0200') ? 1 : 0},
    ]
    this.week= [
      {x: Date.parse('2023-10-01 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap1,'2023-10-01 00:00:00 GMT+0200','2023-10-08 00:00:00 GMT+0200')}, // count
      {x: Date.parse('2023-10-08 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap1,'2023-10-08 00:00:00 GMT+0200','2023-10-15 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-15 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap1,'2023-10-15 00:00:00 GMT+0200','2023-10-22 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-22 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap1,'2023-10-22 00:00:00 GMT+0200','2023-10-29 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-29 00:00:00 GMT+0200'), y: 0},
    ]

    this.day2 = [
      {x: Date.parse('2023-10-01 00:00:00 GMT+0200'), y: this.userMap2.get('2023-10-01 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-02 00:00:00 GMT+0200'), y: this.userMap2.get('2023-10-02 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-03 00:00:00 GMT+0200'), y: this.userMap2.get('2023-10-03 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-04 00:00:00 GMT+0200'), y: this.userMap2.get('2023-10-04 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-05 00:00:00 GMT+0200'), y: this.userMap2.get('2023-10-05 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-06 00:00:00 GMT+0200'), y: this.userMap2.get('2023-10-06 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-07 00:00:00 GMT+0200'), y: this.userMap2.get('2023-10-07 00:00:00 GMT+0200') ? 1 : 0},
    ]
    this.week2= [
      {x: Date.parse('2023-10-01 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap2,'2023-10-01 00:00:00 GMT+0200','2023-10-08 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-08 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap2,'2023-10-08 00:00:00 GMT+0200','2023-10-15 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-15 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap2,'2023-10-15 00:00:00 GMT+0200','2023-10-22 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-22 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap2,'2023-10-22 00:00:00 GMT+0200','2023-10-29 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-29 00:00:00 GMT+0200'), y: 0},
    ]

    this.day3 = [
      {x: Date.parse('2023-10-01 00:00:00 GMT+0200'), y: this.userMap3.get('2023-10-01 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-02 00:00:00 GMT+0200'), y: this.userMap3.get('2023-10-02 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-03 00:00:00 GMT+0200'), y: this.userMap3.get('2023-10-03 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-04 00:00:00 GMT+0200'), y: this.userMap3.get('2023-10-04 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-05 00:00:00 GMT+0200'), y: this.userMap3.get('2023-10-05 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-06 00:00:00 GMT+0200'), y: this.userMap3.get('2023-10-06 00:00:00 GMT+0200') ? 1 : 0},
      {x: Date.parse('2023-10-07 00:00:00 GMT+0200'), y: this.userMap3.get('2023-10-07 00:00:00 GMT+0200') ? 1 : 0},
    ]
    this.week3= [
      {x: Date.parse('2023-10-01 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap3,'2023-10-01 00:00:00 GMT+0200','2023-10-08 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-08 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap3,'2023-10-08 00:00:00 GMT+0200','2023-10-15 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-15 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap3,'2023-10-15 00:00:00 GMT+0200','2023-10-22 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-22 00:00:00 GMT+0200'), y: this.countOccurrencesInMap(this.userMap3,'2023-10-22 00:00:00 GMT+0200','2023-10-29 00:00:00 GMT+0200')},
      {x: Date.parse('2023-10-29 00:00:00 GMT+0200'), y: 0},
    ]


    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart
      
      data: {// values on X-Axis
        //labels: this.formattedDates, 
	       datasets: [
          {
            label: this.currentFilteredQuestions[0],
            data: this.day,//this.userActivityResult1,
            backgroundColor: '#e0ffcd'
          },
          {
            label: this.currentFilteredQuestions[1],
            data: this.day2,
            backgroundColor: '#edb1f1'
          } ,
          {
            label: this.currentFilteredQuestions[2],
            data: this.day3,
            backgroundColor: '#cadefc'
          }  
        ]
      },
      options: {
        aspectRatio:2.5,
        scales: {
          x: {
              type: 'time',
              time: {
                  unit: 'day'
              }
          },
          y: {
            beginAtZero: true
          }
      }
      }
      
    });
  }

}
