import { Injectable } from '@angular/core';

import { EventType } from '../models/event-type';

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
export class EventTypeService {
  constructor(private fs: Firestore) {}

  dbPath: string = 'msp_event_types';

  getEventTypes(): Observable<EventType[]> {
    let eventTypeRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(eventTypeRef, { idField: 'id' }) as Observable<
      EventType[]
    >;
  }

  getEventType(id: string): Observable<EventType> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<EventType>;
  }

  addEventType(eventType: EventType) {
    return addDoc(collection(this.fs, `${this.dbPath}`), eventType);
  }

  updateEventType(id: string, eventTypes: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, eventTypes);
  }

  deleteEventType(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
