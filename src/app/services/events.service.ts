import { Injectable } from '@angular/core';

import { Event } from '../models/event';

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
export class EventsService {
  constructor(private fs: Firestore) {}

  dbPath: string = 'msp_events';

  getEvents(): Observable<Event[]> {
    let eventRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(eventRef, { idField: 'id' }) as Observable<Event[]>;
  }

  getEvent(id: string): Observable<Event> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Event>;
  }

  addEvent(event: Event) {
    return addDoc(collection(this.fs, `${this.dbPath}`), event);
  }

  updateEvent(id: string, events: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, events);
  }

  deleteEvent(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
