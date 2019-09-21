import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';


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
  constructor(private crudService: CrudService) {
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

  ngOnInit() {


  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
