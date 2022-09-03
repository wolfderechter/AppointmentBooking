import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../Appointment';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  public successMsg: string;
  public errorMsg: string;
  appointmentDate: string;
  name: string;
  email: string;
  currentDate = new Date();
  appointments: Appointment[];
  // initial filter function always returns true
  dateFilter = (date: Date): boolean => {return true;}



  //service injection allows us to use the service within appointment component
  constructor(private appointmentService: AppointmentService) { 
    this.appointmentService.RefreshRequired.subscribe(response => {
      this.loadAppointments();
    })
    
    this.appointmentService.getAppointments()
    .subscribe((appointments: Appointment[]) =>{
      this.appointments = appointments;
      this.dateFilter = (date: Date): boolean => {
        return this.checkAvailability(date);
      };
    },
    (error: ErrorEvent) => {
      this.errorMsg = error.error.message;
    })
  }

  ngOnInit(): void {

  }

  createAppointment(){
    this.successMsg = '';
    this.errorMsg = '';
    this.appointmentService.createAppointment(this.appointmentDate, this.name, this.email)
      .subscribe((createdAppointment: Appointment) => {
        this.appointmentService.RefreshRequired.next();
        //When succesfully created an appointment we want to reset the date,name and email fields to empty
        // this.appointmentDate = '';
        this.name = '';
        this.email = '';
        console.log(this.appointmentService.getAppointments())

        //createdAppointment.appointmentDate will no longer work since mongodb 4.x does not return the object anymore only 'acknowledged' and 'insertedId'
        // const appointmentDate = new Date(createdAppointment.appointmentDate).toDateString();
        const appointmentDate = new Date(this.appointmentDate).toDateString();
        this.appointmentDate = '';
        this.successMsg = `Appointment Booked successfully for ${appointmentDate}`
        this.loadAppointments()
        },
        (error: ErrorEvent) => {
          this.errorMsg = error.error.message;
        });
  }

  loadAppointments(){
    this.appointmentService.getAppointments()
    .subscribe((appointments: Appointment[]) =>{
      this.appointments = appointments;
    },
    (error: ErrorEvent) => {
    this.errorMsg = error.error.message;
    })
  }

  checkAvailability(d: Date | null):boolean{  
      // //day is a variable that will be used for every calendar date possible
      const day = (d || new Date()).getTime();
      return !this.appointments.map(app => new Date(app.appointmentDate).getTime()).includes(day)
  }

}
