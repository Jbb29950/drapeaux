import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

interface Country {
  name: {
    shortname: string;
  };
  flag: {
    officialflag: {
      svg: string;
    };
  };
}

@Component({
  selector: 'app-play',
  templateUrl: 'play.page.html',
  styleUrls: ['play.page.scss'],
})
export class PlayPage implements OnInit {
  countries: Country[] = [];
  randomCountry: Country | undefined;
  correctAnswer: string = '';
  userAnswer: string = '';
  score: number = 0;
  totalQuestions: number = 0;
  indice: string = '';
  gameOver : boolean=false;

  constructor(private http: HttpClient,private alertController:AlertController) {}
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Notification',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  ngOnInit() {
    this.getCountries();
  }

  getRandomCountry() {
    const randomIndex = Math.floor(Math.random() * this.countries.length);
    this.randomCountry = this.countries[randomIndex];
    this.correctAnswer = this.randomCountry.name.shortname;
  }

  checkAnswer() {
    if(this.totalQuestions<5){
    if (this.userAnswer.toLowerCase() === this.correctAnswer.toLowerCase()) {
      this.score++;
      const applauseAudio = new Audio();
      applauseAudio.src = 'assets/sf_applaudissements_enfants_01.mp3';
      applauseAudio.load();
      applauseAudio.play();
      this.presentAlert( `Bravo, préparez vous à la question suivante !`);
    } else {
      const applauseAudio=new Audio();
      applauseAudio.src = 'assets/1486.mp3';
      applauseAudio.load();
      applauseAudio.play();
      this.presentAlert(`Désolé, mauvaise réponse. C'était : ${this.correctAnswer}`);
    }
    this.getRandomCountry();
    this.userAnswer = '';
    this.indice='';
    this.totalQuestions++;
  }else{
   
    this.presentAlert(`C'est terminé. Votre score est : ${this.score}/${this.totalQuestions}`);
    this.gameOver=true;
   
    
  }
  
  }

  async getCountries() {
    const url = 'https://rest-countries10.p.rapidapi.com/countries';
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': '9c610fb80cmsh60e198d41e23213p1bd3dcjsn3a3862204473',
      'X-RapidAPI-Host': 'rest-countries10.p.rapidapi.com'
    });

    try {
      const response: any = await this.http.get(url, { headers }).toPromise();
      if (Array.isArray(response)) {
        this.countries = response.map((country: any) => ({
          name: {
            shortname: country.name.shortname
          },
          flag: country.flag
        }));
        this.getRandomCountry();
      }
    } catch (error) {
      console.error(error);
    }
  }
  playApplauseSound() {
    const applauseAudio = new Audio();
    applauseAudio.src = 'assets/sf_applaudissements_enfants_01.mp3';
    applauseAudio.load();
    applauseAudio.play();
  }
  showIndice() {
    if (this.randomCountry) {
     this.indice = this.randomCountry.name.shortname.slice(0, 3);
    }
  }
  disableScroll: boolean = false;

  onFocus() {
    this.disableScroll = true;
  }

  onBlur() {
    this.disableScroll = false;
  }
  replay() {
    this.totalQuestions = 0;
    this.score = 0;
    this.getRandomCountry();
    this.gameOver = false;
  }
  
}
