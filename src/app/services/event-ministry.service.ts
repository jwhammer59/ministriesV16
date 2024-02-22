import { Injectable } from '@angular/core';

import { EventMinistry } from '../models/event-ministry';

import {
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventMinistryService {
  constructor(private fs: Firestore) {}

  dbPath: string = 'msp_event_ministries';

  getEventMinistries(): Observable<EventMinistry[]> {
    let eventMinistryRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(eventMinistryRef, { idField: 'id' }) as Observable<
      EventMinistry[]
    >;
  }

  getEventMinistry(id: string): Observable<EventMinistry> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<EventMinistry>;
  }

  addEventMinistry(eventMinistry: EventMinistry) {
    return addDoc(collection(this.fs, `${this.dbPath}`), eventMinistry);
  }

  updateEventMinistry(id: string, eventMinistries: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, eventMinistries);
  }

  deleteEventMinistry(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
