import { Injectable } from '@angular/core';

import { Volunteer } from '../models/volunteer';

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
export class VolunteersService {
  constructor(private fs: Firestore) {}

  dbPath: string = 'msp_volunteers';

  getVolunteers(): Observable<Volunteer[]> {
    let volunteerRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(volunteerRef, { idField: 'id' }) as Observable<
      Volunteer[]
    >;
  }

  getVolunteer(id: string): Observable<Volunteer> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Volunteer>;
  }

  addVolunteer(volunteer: Volunteer) {
    return addDoc(collection(this.fs, `${this.dbPath}`), volunteer);
  }

  updateVolunteer(id: string, volunteers: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, volunteers);
  }

  deleteVolunteer(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
