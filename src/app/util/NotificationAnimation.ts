import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

export class NotificationAnimation {
  public static showNotification(notificationSubject: Subject<boolean>, duration?: number) {
    notificationSubject.next(true)
    setTimeout(() => notificationSubject.next(false), duration ? duration
      : environment.notificationLiveTime)
  }

  private constructor() {
  }
}
