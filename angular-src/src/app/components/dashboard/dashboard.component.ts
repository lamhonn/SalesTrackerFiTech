import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'app/services/validate.service';
import { AuthService } from 'app/services/auth.service';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: Object;
  log: Object;

  username: String;
  date: Date;
  hours: number;
  minutes: number;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    var tempUsername;
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      // this.authService.getLog(profile.user.username).subscribe(workhour => {
      //   this.log = workhour.log;
      //   console.log(this.log);
      // });
      tempUsername = profile.user.username;     
    },
    err => {
      console.log(err);
      return false;
    });

    this.authService.getLog(tempUsername).subscribe(workhour => {
      this.log = workhour.log;
      console.log(this.log);
    },
    err => {
      console.log(err);
      return false;
    });
  }

  logHours(usname: String) {
    const log = {
      username: usname, // Username is passed from html component
      date: this.date,
      hours: this.hours*60 + this.minutes // Multiply hours with 60 and sum it with minutes
    }
    
    //Required fields
    if(!this.validateService.validateLog(log)) {
      this.flashMessage.show('Check your log inputs', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    };

    // New log  
    this.authService.newLog(log).subscribe(data => {
      if(data.success) {
        this.flashMessage.show('Logged workhours succesfully', {cssClass: 'alert-success', timeout: 3000});
      } else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }

  // getLogsForRange(usname: String) {
  //   this.authService.getLog(usname).subscribe(workhour => {
  //     this.log = workhour.log;
  //   },
  //   err => {
  //     console.log(err);
  //     return false;
  //   });
  // }
}
