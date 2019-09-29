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
        };
      })
      console.log(this.evento);
 
    });

  }

  editarEvento(evento , comando) {

    if (evento === 'wa') {

      this.formWA(comando);

    }

    if (evento === 'uber') {

      this.formUber(comando);
    }

    if (evento === 'llamada') {

      this.formLlamada(comando);

    }

  }


  async formLlamada(comando) {
    const alert = await this.alertController.create({
      message: '<strong> Comando: ' + comando + '</strong>',
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
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async formUber(comando) {
    const alert = await this.alertController.create({
      message: '<strong> Comando: ' + comando + '</strong>',
      header: 'Informacion Uber',
      inputs: [
        {
          name: 'direccion',
          type: 'text',
          placeholder: 'Direccion uber'
        },
        {
          name: 'Maximo',
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
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async formWA(comando) {
    const alert = await this.alertController.create({
      message: '<strong> Comando: ' + comando + '</strong>',
      header: 'Informacion WhatsApp',
      inputs: [
        {
          name: 'numero',
          type: 'text',
          placeholder: 'Numero Whatsapp'
        },
        {
          name: 'Mensaje',
          type: 'text',
          id: 'name2-id',
          placeholder: 'Mensaje Whatsapp'
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
          handler: () => {
            console.log('Confirm Ok');
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
