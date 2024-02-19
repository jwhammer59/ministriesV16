import { Injectable } from '@angular/core';

import { Organization } from '../models/organization';

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
export class OrganizationsService {
  constructor(private fs: Firestore) {}

  dbPath: string = 'msp_organizations';

  getOrganizations(): Observable<Organization[]> {
    let organizationRef = collection(this.fs, `${this.dbPath}`);
    return collectionData(organizationRef, { idField: 'id' }) as Observable<
      Organization[]
    >;
  }

  getOrganization(id: string): Observable<Organization> {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Organization>;
  }

  addOrganization(organization: Organization) {
    return addDoc(collection(this.fs, `${this.dbPath}`), organization);
  }

  updateOrganization(id: string, organizations: any) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return updateDoc(docRef, organizations);
  }

  deleteOrganization(id: string) {
    let docRef = doc(this.fs, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
