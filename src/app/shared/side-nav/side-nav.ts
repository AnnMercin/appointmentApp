import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  toggleSidenav() {
    this.sidenav.toggle();
  }
}
