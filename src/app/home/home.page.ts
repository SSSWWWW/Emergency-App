import { Component, ViewChild } from '@angular/core';

import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { CrudService } from 'src/app/service/crud.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  speechText: any;
  language: string;
  talkSpeed: number;

  evento: string;
  checkedUber: boolean;
  checkedLlamada: boolean ;
  checkedWA: boolean;


  constructor(
  private crudService: CrudService,
  private tts: TextToSpeech,
  private sr: SpeechRecognition,
  public alertController: AlertController
  ) {
      this.speechText = '';
      this.language = 'es-CR';
      this.talkSpeed = 1;
  }

  escucharEvento() {

    this.crudService.read_Evento().subscribe(data => {
 
      const evento = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          app: e.payload.doc.data()['app'],
          comando: e.payload.doc.data()['comando'],
          mensaje: e.payload.doc.data()['mensaje'],
          numero: e.payload.doc.data()['numero'],
        };
      })
      const comando = this.speechText;
      console.log(evento.find(x => x.comando === comando));
 
    });
  }

  getEvent(e) {


    if (e.target.value === 'uber') {

      this.evento = e.target.value;
      this.checkedUber = this.checkedUber ? false : true;
      this.checkedWA = false;
      this.checkedLlamada = false;

    }

    if (e.target.value === 'llamada') {

      this.evento = e.target.value;
      this.checkedLlamada = this.checkedLlamada ? false : true;
      this.checkedUber = false;
      this.checkedWA = false;

    }

    if (e.target.value === 'wa') {

      this.evento = e.target.value;
      this.checkedWA = this.checkedWA ? false : true;
      this.checkedLlamada = false;
      this.checkedUber = false;
    }

   // alert('hola ' +  this.evento + ' - cUber: ' + this.checkedUber + ' - cLlamada: ' + this.checkedLlamada + ' - cWA: ' + this.checkedWA);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Evento creado exitosamente',
      buttons: ['OK']
    });

    await alert.present();
  }


  guardarEvento(){

    alert(this.evento + ' ' + this.speechText );

    let record = {};
    record['app'] = this.evento;
    record['comando'] = this.speechText;
    this.crudService.create_Evento(record).then(resp => {
      this.evento = '';
      this.speechText = '';
      console.log(resp);
      this.presentAlert();
    })
      .catch(error => {
        console.log(error);
      });


  }



  ionViewDidLoad(){
    // Check feature available
    //this.sr.isRecognitionAvailable()
      //.then((available: boolean) => console.log(available));
  }



  speakText(){
    let talkRate = 1 + this.talkSpeed/10;

    this.tts.speak({
      text: this.speechText,
      locale: this.language,
      rate: talkRate
    })
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }



  listen2(){
    this.sr.startListening().subscribe((speech:any) => {
      this.speechText = speech;
    }, (onerror) => {
      console.log('error:', onerror)
    });/**/
  }



  listen(){
    try {
      const SpeechRecognition = (<any>window).SpeechRecognition
      || (<any>window).webkitSpeechRecognition
      || (<any>window).mozSpeechRecognition
      || (<any>window).msSpeechRecognition;

      const sr = new SpeechRecognition();

      sr.start();

      sr.onresult = async (event) => {
        this.speechText = await event.results[0][0].transcript;
        //console.log(sr.onresult());
        //return of()
        sr.stop();
      }

    }
    catch(e) {
      console.error(e);
    }
  }



}
