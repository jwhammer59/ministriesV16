import { Ministry } from './ministry';

export interface EventType {
  id?: string;
  eventTypeName: string;
  requiredMinistries: Ministry[];
}
