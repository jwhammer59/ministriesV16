import { Injectable } from '@angular/core';

import { FamilyId } from '../models/family-id';

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
export class FamilyIdsService {
  constructor(private fs: Firestore) {}

  dbPath: string = 'msp_family-ids';

  getFamilyIds(): Observable<FamilyId[]> {
    let familyIdRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(familyIdRef, { idField: 'id' }) as Observable<
      FamilyId[]
    >;
  }

  getFamilyId(id: string): Observable<FamilyId> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<FamilyId>;
  }

  addFamilyId(familyId: FamilyId) {
    return addDoc(collection(this.fs, `${this.dbPath}`), familyId);
  }

  updateFamilyId(id: string, familyIds: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, familyIds);
  }

  deleteFamilyId(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
