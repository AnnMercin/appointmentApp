import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  standalone: false,
  template: `
    <div class="time-picker">
      <div class="time-display" (click)="toggleDropdown()">
        <span>{{selectedTime || placeholder}}</span>
        <mat-icon>access_time</mat-icon>
      </div>
      
      <div class="time-dropdown" *ngIf="isDropdownOpen" (clickOutside)="closeDropdown()">
        <div class="time-scrollers">
          <!-- Hour Scroller -->
          <div class="time-scroller">
            <div class="scroller-header">Hour</div>
            <div class="scroller-list">
              <div *ngFor="let hour of hours" 
                   class="time-option"
                   [class.selected]="selectedHour === hour"
                   [class.disabled]="isHourDisabled(hour)"
                   (click)="selectHour(hour)">
                {{hour}}
              </div>
            </div>
          </div>
          
          <!-- Minute Scroller -->
          <div class="time-scroller">
            <div class="scroller-header">Minute</div>
            <div class="scroller-list">
              <div *ngFor="let minute of minutes" 
                   class="time-option"
                   [class.selected]="selectedMinute === minute"
                   [class.disabled]="isMinuteDisabled(minute)"
                   (click)="selectMinute(minute)">
                {{minute}}
              </div>
            </div>
          </div>
          
          <!-- AM/PM Scroller -->
          <div class="time-scroller">
            <div class="scroller-header">Period</div>
            <div class="scroller-list">
              <div *ngFor="let period of periods" 
                   class="time-option"
                   [class.selected]="selectedPeriod === period"
                   [class.disabled]="isPeriodDisabled(period)"
                   (click)="selectPeriod(period)">
                {{period}}
              </div>
            </div>
          </div>
        </div>
        
        <div class="time-actions">
          <button mat-button (click)="closeDropdown()">Cancel</button>
          <button mat-raised-button color="primary" (click)="confirmTime()" [disabled]="!isValidSelection()">OK</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./time-picker.css']
})
export class TimePicker implements OnInit {
  @Input() selectedTime: string = '';
  @Input() selectedDate: Date | null = null;
  @Input() placeholder: string = 'Select time';
  @Output() timeChange = new EventEmitter<string>();

  isDropdownOpen = false;
  selectedHour: string = '';
  selectedMinute: string = '';
  selectedPeriod: string = '';

  hours: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minutes: string[] = ['00', '15', '30', '45'];
  periods: string[] = ['AM', 'PM'];

  ngOnInit() {
    if (this.selectedTime) {
      this.parseSelectedTime();
    }
  }

  parseSelectedTime() {
    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = timeRegex.exec(this.selectedTime);
    
    if (match) {
      this.selectedHour = match[1];
      this.selectedMinute = match[2];
      this.selectedPeriod = match[3].toUpperCase();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  selectHour(hour: string) {
    if (!this.isHourDisabled(hour)) {
      this.selectedHour = hour;
    }
  }

  selectMinute(minute: string) {
    if (!this.isMinuteDisabled(minute)) {
      this.selectedMinute = minute;
    }
  }

  selectPeriod(period: string) {
    if (!this.isPeriodDisabled(period)) {
      this.selectedPeriod = period;
    }
  }

  isHourDisabled(hour: string): boolean {
    if (!this.selectedDate) return false;
    
    const today = new Date();
    const selectedDate = new Date(this.selectedDate);
    
    // Only disable if it's today and we have selected period
    if (selectedDate.toDateString() === today.toDateString() && this.selectedPeriod) {
      const currentHour = today.getHours();
      const hourNum = Number.parseInt(hour, 10);
      
      if (this.selectedPeriod === 'AM') {
        const hour24 = hourNum === 12 ? 0 : hourNum;
        return hour24 < currentHour || (hour24 === currentHour && this.isCurrentMinutePassed());
      } else {
        const hour24 = hourNum === 12 ? 12 : hourNum + 12;
        return hour24 < currentHour || (hour24 === currentHour && this.isCurrentMinutePassed());
      }
    }
    
    return false;
  }

  isMinuteDisabled(minute: string): boolean {
    if (!this.selectedDate || !this.selectedHour) return false;
    
    const today = new Date();
    const selectedDate = new Date(this.selectedDate);
    
    if (selectedDate.toDateString() === today.toDateString()) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const hourNum = Number.parseInt(this.selectedHour, 10);
      const minuteNum = Number.parseInt(minute, 10);
      
      let selectedHour24: number;
      if (this.selectedPeriod === 'AM') {
        selectedHour24 = hourNum === 12 ? 0 : hourNum;
      } else {
        selectedHour24 = hourNum === 12 ? 12 : hourNum + 12;
      }
      
      if (selectedHour24 === currentHour) {
        return minuteNum <= currentMinute;
      }
    }
    
    return false;
  }

  isPeriodDisabled(period: string): boolean {
    if (!this.selectedDate) return false;
    
    const today = new Date();
    const selectedDate = new Date(this.selectedDate);
    
    if (selectedDate.toDateString() === today.toDateString()) {
      const currentHour = today.getHours();
      
      if (period === 'AM' && currentHour >= 12) {
        return true;
      }
    }
    
    return false;
  }

  isCurrentMinutePassed(): boolean {
    const now = new Date();
    return now.getMinutes() > 0;
  }

  isValidSelection(): boolean {
    return this.selectedHour !== '' && this.selectedMinute !== '' && this.selectedPeriod !== '';
  }

  confirmTime() {
    if (this.isValidSelection()) {
      const timeString = `${this.selectedHour}:${this.selectedMinute} ${this.selectedPeriod}`;
      this.selectedTime = timeString;
      this.timeChange.emit(timeString);
      this.closeDropdown();
    }
  }
}