import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Event } from './event.class';
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<Event>();
  constructor() { }
  emit(event: Event) {
    this.subject$.next(event);
  }
  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: Event) => e.name === eventName),
      map((e: Event) => e["value"])).subscribe(action);
  }
}
