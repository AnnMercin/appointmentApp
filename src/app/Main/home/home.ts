import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { EditAppointmentDialog } from './edit-appointment-dialog/edit-appointment-dialog';
import { ConfirmDeleteDialog } from './confirm-delete-dialog/confirm-delete-dialog';

export interface Appointment {
  id?: number;
  time: string;
  client: string;
  Date: string;
  topic: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['time', 'client', 'Date', 'topic', 'actions'];
  appointment: Appointment[] = [];
  dataSource = new MatTableDataSource<Appointment>(this.appointment);
  private searchSubscription: Subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly searchService: SearchService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.appointment = this.getAppointments();
    this.dataSource.data = this.appointment;
    
    this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
      const searchText = filter.toLowerCase();
      return data.client.toLowerCase().includes(searchText) ||
             data.topic.toLowerCase().includes(searchText) ||
             data.time.toLowerCase().includes(searchText) ||
             data.Date.toLowerCase().includes(searchText);
    };
  }   

  ngOnInit() {
    // Subscribe to search term changes
    this.searchSubscription = this.searchService.searchTerm$.subscribe(searchTerm => {
      this.applyFilter(searchTerm);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAppointments(): Appointment[] {
    // Using current dates for better testing (IST format)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dayAfterStr = dayAfter.toISOString().split('T')[0];
    
    return [
      { id: 1, time: '9:00 AM', client: 'John Doe' , Date: todayStr , topic: 'General Consultation'},
      { id: 2, time: '10:30 AM', client: 'Jane Smith' , Date: todayStr , topic: 'Follow-up'},
      { id: 3, time: '1:00 PM', client: 'Mike Johnson' , Date: todayStr , topic: 'New Patient'},
      { id: 4, time: '2:30 PM', client: 'Emily Davis' , Date: tomorrowStr , topic: 'Routine Check-up'},
      { id: 5, time: '3:45 PM', client: 'David Wilson' , Date: tomorrowStr , topic: 'Specialist Referral'},
      { id: 6, time: '4:30 PM', client: 'Sarah Connor' , Date: tomorrowStr , topic: 'Post-Operative Follow-up'},
      { id: 7, time: '11:00 AM', client: 'Chris Evans' , Date: dayAfterStr , topic: 'Vaccination'},
      { id: 8, time: '12:15 PM', client: 'Natalie Portman' , Date: dayAfterStr , topic: 'Lab Results Discussion'},
      { id: 9, time: '1:30 PM', client: 'Robert Downey' , Date: dayAfterStr , topic: 'Physical Therapy Consultation'},
      { id: 10, time: '3:00 PM', client: 'Scarlett Johansson' , Date: dayAfterStr , topic: 'Mental Health Check-in'},
    ];
  }

  editAppointment(appointment: Appointment, index: number) {
    const dialogRef = this.dialog.open(EditAppointmentDialog, {
      width: '500px',
      data: { appointment: { ...appointment }, index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the appointment in the array with proper formatting
        const updatedAppointment = result.appointment;
        
        // Ensure date is in proper format
        if (updatedAppointment.Date instanceof Date) {
          updatedAppointment.Date = updatedAppointment.Date.toISOString().split('T')[0];
        }
        
        this.appointment[index] = updatedAppointment;
        this.dataSource.data = [...this.appointment];
        
        this.snackBar.open('Appointment updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteAppointment(appointment: Appointment, index: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px',
      data: { appointmentClient: appointment.client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Remove the appointment from the array
        this.appointment.splice(index, 1);
        this.dataSource.data = [...this.appointment];
        
        this.snackBar.open('Appointment deleted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }
}