import { EventMinistry } from './event-ministry';

export interface EventType {
  id?: string;
  eventTypeName: string;
  requiredMinistries: EventMinistry[];
}
