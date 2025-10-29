import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../home';

@Component({
  selector: 'app-edit-appointment-dialog',
  standalone: false,
  templateUrl: './edit-appointment-dialog.html',
  styleUrl: './edit-appointment-dialog.css',
})
export class EditAppointmentDialog {
  appointmentForm: FormGroup;
  minDate: Date;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EditAppointmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment; index: number }
  ) {
    // Set minimum date to today in IST
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    
    // Parse the existing date properly
    const existingDate = this.data.appointment.Date ? new Date(this.data.appointment.Date) : null;
    
    this.appointmentForm = this.fb.group({
      time: [data.appointment.time, [Validators.required]],
      client: [data.appointment.client, [Validators.required, Validators.minLength(2)]],
      Date: [existingDate, [Validators.required]],
      topic: [data.appointment.topic, [Validators.required, Validators.minLength(5)]]
    });
  }

  onTimeChange(selectedTime: string) {
    this.appointmentForm.patchValue({ time: selectedTime });
    this.appointmentForm.get('time')?.markAsTouched();
  }

  onSave() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      
      // Format date properly for IST (YYYY-MM-DD format)
      const selectedDate = new Date(formValue.Date);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const updatedAppointment: Appointment = {
        ...formValue,
        Date: formattedDate,
        time: formValue.time.trim() // Ensure no extra spaces
      };
      
      this.dialogRef.close({ appointment: updatedAppointment, index: this.data.index });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}