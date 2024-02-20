export interface Volunteer {
  id?: string;
  firstName: string;
  middleInit: string;
  lastName: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  ministries: [];
  familyID: string;
  isActive: boolean;
  isFamilyIDHead: boolean;
}
