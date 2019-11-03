import { Component, ViewChild } from '@angular/core';

import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { CrudService } from 'src/app/service/crud.service';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';


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
  private callNumber: CallNumber,
  private nativeGeocoder: NativeGeocoder,
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
          direccion: e.payload.doc.data()['direccion'],
          maximo: e.payload.doc.data()['maximo']
        };
      })
      const comando = this.speechText;
      const ev = evento.find(x => x.comando === comando); 
      console.log(ev);

      if (ev.app === 'wa') {

        window.open('https://api.whatsapp.com/send?phone=506' + ev.numero + '&text=%20' + ev.mensaje);

      }

      if (ev.app === 'llamada') {

        var tel = ev.numero;

        window.open('tel:'+ ev.numero  +"'", '_system', 'location=yes')
        
      }

      if (ev.app === 'uber') {

        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
      };

      this.nativeGeocoder.forwardGeocode(ev.direccion, options)
  .then((result: NativeGeocoderResult[]) => alert('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
  .catch((error: any) => console.log(error));

        window.open('uber://?action=setPickup&pickup');
        
      }
 
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



  listen() {
    let element: HTMLElement = document.getElementById('comand') as HTMLElement;
    try {
      const SpeechRecognition = (<any>window).SpeechRecognition
      || (<any>window).webkitSpeechRecognition
      || (<any>window).mozSpeechRecognition
      || (<any>window).msSpeechRecognition;

      const sr = new SpeechRecognition();

      sr.start();

      sr.onresult = async (event) => {
        this.speechText = await event.results[0][0].transcript;
        console.log(this.speechText);
        element.click();
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
