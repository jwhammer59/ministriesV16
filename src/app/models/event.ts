export interface Event {
  id?: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  eventReqMinistries: [];
  eventSchedVols: [];
  eventIsFull: boolean;
}
