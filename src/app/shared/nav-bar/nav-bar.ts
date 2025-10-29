import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  @Output() menuToggle = new EventEmitter<void>();
  searchTerm: string = '';

  constructor(private readonly searchService: SearchService) {}

  onMenuClick() {
    this.menuToggle.emit();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  onSearchClear() {
    this.searchTerm = '';
    this.searchService.updateSearchTerm('');
  }
}
