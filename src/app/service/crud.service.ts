
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(
    private firestore: AngularFirestore
  ) { }
 
 
create_Evento(record) {
    return this.firestore.collection('evento').add(record);
  }
read_Evento() {
    return this.firestore.collection('evento').snapshotChanges();
  }
update_Evento(recordID,record){
    this.firestore.doc('evento/' + recordID).update(record);
}

delete_Evento(record_id) {
    this.firestore.doc('evento/' + record_id).delete();
  }
}