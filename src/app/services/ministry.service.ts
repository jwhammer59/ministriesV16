import { Injectable } from '@angular/core';

import { Ministry } from '../models/ministry';

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
export class MinistryService {
  constructor(private fs: Firestore) {}

  dbPath: string = 'msp_ministries';

  getMinistries(): Observable<Ministry[]> {
    let ministryRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(ministryRef, { idField: 'id' }) as Observable<
      Ministry[]
    >;
  }

  getMinistry(id: string): Observable<Ministry> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Ministry>;
  }

  addMinistry(ministry: Ministry) {
    return addDoc(collection(this.fs, `${this.dbPath}`), ministry);
  }

  updateMinistry(id: string, ministries: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, ministries);
  }

  deleteMinistry(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
