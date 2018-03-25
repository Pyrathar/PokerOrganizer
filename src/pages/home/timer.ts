import {Component, Input} from '@angular/core';
import {ITimer} from './itimer';
import {blinds} from './blinds';
import { NavController , Platform, AlertController} from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ViewChild } from '@angular/core';
import moment from 'moment';


@Component({
    selector: 'timer',
    templateUrl: './timer.html'
})
export class TimerComponent {

    @Input() timeInSeconds: number;
    public timer: ITimer;
    public blinds: blinds;
    count = 0;
    notificationTime = 0;
    notifications: any[] = [];
    alphas = ["Starting","10/20","20/40","40/50","50/100","100/200","200/400","400/800","500/1000"]

    constructor(public navCtrl: NavController, private localNotifications: LocalNotifications, public alertCtrl: AlertController, private platform: Platform) {

    }

    ngOnInit() {
        this.initTimer();
        this.displayBlinds();
    }

    hasFinished() {
        return this.timer.hasFinished;
    }

    initTimer() {
        if(!this.timeInSeconds) { this.timeInSeconds = 0; }

        this.timer = <ITimer>{
            seconds: this.timeInSeconds,
            runTimer: false,
            hasStarted: false,
            hasFinished: false,
            secondsRemaining: this.timeInSeconds
        };

        this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    }

    startTimer() {
        this.timer.hasStarted = true;
        this.timer.runTimer = true;
        this.timerTick();
        this.addNotifications();
    }

    pauseTimer() {
        this.timer.runTimer = false;
    }

    resumeTimer() {
        this.startTimer();
    }

    displayBlinds() {
    this.count= this.count+1;
    this.blinds= <blinds>{
      value : this.alphas[this.count]
      }
    }

    timerTick() {
        setTimeout(() => {
            if (!this.timer.runTimer) { return; }
            this.timer.secondsRemaining--;
            this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
            if (this.timer.secondsRemaining > 0) {
                this.timerTick();
            }
            else {
                this.displayBlinds();
                this.initTimer();
            }
        }, 1000);
    }
    //Adds the notifications
    addNotifications(){

      //Replace the time
      this.notificationTime = this.timeInSeconds+600
      this.localNotifications.hasPermission().then(function(granted) {
        if (!granted) {
          this.localNotifications.registerPermission();
        }
       });

      this.platform.ready().then(() => {
        let notification = {
          id: 1,
          text: 'Single LocalNotification',
          sound: this.setSound(),
          at: this.notificationTime,
          data: { secret: 'hellloo' }
        };

        this.notifications.push(notification);

         if(this.platform.is('android')){


         this.localNotifications.schedule(this.notifications);
         this.notifications = [];

         let alert = this.alertCtrl.create({
             title: 'Notifications set',
             buttons: ['Ok']
         });

         alert.present();


         }
      })

    }

    getSecondsAsDigitalClock(inputSeconds: number) {
        var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
        var hoursString = '';
        var minutesString = '';
        var secondsString = '';
        hoursString = (hours < 10) ? "0" + hours : hours.toString();
        minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
        secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
        return hoursString + ':' + minutesString + ':' + secondsString;
    }

    //Set the sound file
    setSound() {
      if (this.platform.is('android')) {
        return 'file://assets/sounds/blinds.mp3'
      } else {
        return 'file://assets/sounds/blinds.mp3'
      }
    }

}
