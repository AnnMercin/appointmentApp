import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  @Output() menuToggle = new EventEmitter<void>();

  onMenuClick() {
    this.menuToggle.emit();
  }
}
