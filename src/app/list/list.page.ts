import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})

export class ListPage implements OnInit {
  private selectedItem: any;
  public evento: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(private crudService: CrudService,
  public alertController: AlertController) {
    this.crudService.read_Evento().subscribe(data => {
 
      this.evento = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          app: e.payload.doc.data()['app'],
          comando: e.payload.doc.data()['comando'],
          mensaje: e.payload.doc.data()['mensaje'],
          numero: e.payload.doc.data()['numero'],
          direccion: e.payload.doc.data()['direccion'],
          maximo: e.payload.doc.data()['maximo'],
        };
      })
      console.log(this.evento);
 
    });

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Evento actualizado exitosamente',
      buttons: ['OK']
    });

    await alert.present();
  }

  editarEvento(evento , comando, id , numero, mensaje, direccion, maximo) {

    if (evento === 'wa') {

      this.formWA(comando , id , numero , mensaje);

    }

    if (evento === 'uber') {

      this.formUber(comando , id, direccion, maximo);
    }

    if (evento === 'llamada') {

      this.formLlamada(comando , id , numero);

    }

  }

  editarEventoWA(id, numero, mensaje){

    let record = {};
    record['numero'] = numero;
    record['mensaje'] = mensaje;
    this.crudService.update_Evento(id, record);
    this.presentAlert();

  }

  editarEventoLlamada(id, numero){

    let record = {};
    record['numero'] = numero;
    this.crudService.update_Evento(id, record);
    this.presentAlert();

  }

  editarEventoUber(id, direccion, maximo){

    let record = {};
    record['direccion'] = direccion;
    record['maximo'] = maximo;
    this.crudService.update_Evento(id, record);
    this.presentAlert();

  }

  async formLlamada(comando , id , numero) {
    const alert = await this.alertController.create({
      message: '<strong> Comando: ' + comando + '</strong> <br>' +
      '<strong> Numero: ' + numero + '</strong>',
      header: 'Informacion Llamada',
      inputs: [
        {
          name: 'telefono',
          type: 'text',
          placeholder: 'Numero telefono'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            console.log('Confirm Ok');
            console.log(alertData.numero , id);
            this.editarEventoLlamada(id, alertData.telefono);

          }
        }
      ]
    });

    await alert.present();
  }

  async formUber(comando, id, direccion, maximo) {
    const alert = await this.alertController.create({
      message: '<strong> Comando: ' + comando + '</strong><br>' +
      '<strong> Direccion : ' + direccion + '<br>' +
      '<strong> Maximo a pagar: ' + maximo,
      header: 'Informacion Uber',
      inputs: [
        {
          name: 'direccion',
          type: 'text',
          placeholder: 'Direccion uber'
        },
        {
          name: 'maximo',
          type: 'text',
          placeholder: 'Maximo a pagar'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.editarEventoUber(id, alertData.direccion, alertData.maximo);

          }
        }
      ]
    });

    await alert.present();
  }

  async formWA(comando , id , numero , mensaje) {
    const alert = await this.alertController.create({
      message: '<strong> Comando: ' + comando + '</strong> <br>' +
      '<strong> Mensaje: ' + mensaje + '</strong> <br>' +
      '<strong> Numero: ' + numero + '</strong>',
      header: 'Informacion WhatsApp',
      inputs: [
        {
          label: 'Numero',
          name: 'numero',
          type: 'text',
          placeholder: 'Numero',

        },
        {
          name: 'mensaje',
          type: 'text',
          id: 'name2-id',
          placeholder: 'Mensaje',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            console.log('Confirm Ok');
            console.log(alertData.numero , ' ' , alertData.mensaje , ' ' , id);
            this.editarEventoWA(id, alertData.numero, alertData.mensaje);

          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {


  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
