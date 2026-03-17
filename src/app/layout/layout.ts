import { PlayerService } from './../player-service';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  constructor(private playerService: PlayerService){}

  searchText = new FormControl('');

  onSearch() {
    console.log(this.searchText.value);
    this.playerService.navbarData.set(this.searchText.value || '');
    console.log('Navbar data set to:', this.playerService.navbarData());
  }

  roster(){
    this.playerService.navbarData.set('');
  }

}
