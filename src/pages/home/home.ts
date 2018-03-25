import { Component } from '@angular/core';
import { NavController , Platform, AlertController} from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

   notifyTime: any;
   notifications: any[] = [];
   days: any[];
   chosenHours: number;
   chosenMinutes: number;

  constructor(public navCtrl: NavController, private localNotifications: LocalNotifications, public alertCtrl: AlertController, private platform: Platform) {
    this.notifyTime = moment(new Date()).format();

           this.chosenHours = new Date().getHours();
           this.chosenMinutes = new Date().getMinutes();

           this.days = [
               {title: 'Monday', dayCode: 1, checked: false},
               {title: 'Tuesday', dayCode: 2, checked: false},
               {title: 'Wednesday', dayCode: 3, checked: false},
               {title: 'Thursday', dayCode: 4, checked: false},
               {title: 'Friday', dayCode: 5, checked: false},
               {title: 'Saturday', dayCode: 6, checked: false},
               {title: 'Sunday', dayCode: 0, checked: false}
           ];

       }

       ionViewDidLoad(){

       }

       timeChange(time){
         this.chosenHours = time.hour.value;
         this.chosenMinutes = time.minute.value;
       }

       addNotifications(){
         let currentDate = new Date();
         //isto mete o clock para a altura certa
         var newDateObj = moment(currentDate).add(5, 's').toDate();


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
             at: newDateObj,
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

       cancelAll(){
         this.localNotifications.cancelAll();

         let alert = this.alertCtrl.create({
           title: 'Notifications cancelled',
           buttons: ['Ok']
         });

         alert.present();
        }
        setSound() {
          if (this.platform.is('android')) {
            return 'file://assets/sounds/blinds.mp3'
          } else {
            return 'file://assets/sounds/blinds.mp3'
          }
        }
  }
