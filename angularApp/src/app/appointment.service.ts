import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Appointment } from './Appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient) { }
  
  //define the methods
  //method getAppointments will retrieve appointments from the api endpoint via a get request and return an observable appointment array
  getAppointments(): Observable<Appointment[]>{
    return this.http.get<Appointment[]>(`${this.BASE_URL}/appointments`);
  }

  //method createAppointments will send a post request to the api endpoint with an Appointment object
  createAppointment(appointmentDate: string, name: string, email: string): Observable<Appointment>{
    return this.http.post<Appointment>(`${this.BASE_URL}/appointments`, 
    {appointmentDate, name, email});
  }

  //method cancelAppointment will cancel an appointment by sending a delete request to the api with an id
  cancelAppointment(id: string): Observable<any>{
    return this.http.delete(`${this.BASE_URL}/appointments/${id}`);
  }
}
