import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
// import { setTimeout } from 'timers';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name: string="";
  public questionList : any = [];
  public currentQuestion : number = 0;
  public points : number = 0;
  counter = 60;
  correctAnswer = 0;
  incorrectAnswer = 0;
  interval$ : any;
  progress : string = "0";
  isQuizCompleted : boolean = false;
  isFail : boolean = true;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllquestions();
    this.startCounter();
  }

  getAllquestions(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      console.log(res.questions);
      this.questionList = res.questions;
    }) 
  }

  nextQuestion(){
    this.currentQuestion++;
    this.resetCounter();
  }
  previousQuestion(){
    this.currentQuestion--;
  }

  answer(currentQno:number, option:any){
    if(currentQno === this.questionList.length){
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    if(option.correct){
      this.points += 10;
      this.correctAnswer++;
      setTimeout(()=>{
        this.currentQuestion++;
      this.resetCounter();
      this.getProgressPercent();
      this.isPass();
    },1000)}
    else{
      setTimeout(() => {
        this.currentQuestion++;
        this.incorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();  
      }, 1000);
      this.points -=5;
      this.isPass();
    }
  }
  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter = 60;
        this.points -= 5;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();
    },60000); 
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllquestions();
    this.points = 0;
    this.counter=60; 
    this.currentQuestion=0;
  }

  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

  isPass(){
    if(this.points>=60){
      this.isFail = false;
    }
    else{
      this.isFail = true;
    }
  }
  
}
