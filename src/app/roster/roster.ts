import { PlayerService } from './../player-service';
import { Component, computed, inject, signal } from '@angular/core';
import { CardComponent } from '../card-component/card-component';
import { Player } from '../Player';
import { FormsModule } from '@angular/forms';
import { Team } from '../model/team';

@Component({
  selector: 'app-roster',
  imports: [CardComponent, FormsModule],
  templateUrl: './roster.html',
  styleUrl: './roster.css',
})
export class Roster {
  playerService = inject(PlayerService);

  players = signal<Player[]>([]);
  playerIDs: string[] = [];
  teams: Team[] = [];
  selectedTeamVar: string = '';

  playersFiltered = computed(() => {
    const term = this.playerService.navbarData().toLowerCase();

    if (!term) {
      return this.players();
    }

    return this.players().filter((player) =>
      (player.name + ' ' + player.lastName).toLowerCase().includes(term),
    );
  });

  positionFilter: string = '';

  ngOnInit(): void {
    this.playerService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  selectedTeam() {
    this.playerService.getPlayersById(this.selectedTeamVar).subscribe((playersId) => {
      this.playerIDs = playersId;

      this.playerService.getPlayers(this.playerIDs).subscribe((players) => {
        this.players.set(players);
      });
    });
  }

  filterByPosition(arg0: string) {
    this.positionFilter = arg0;
    if (this.positionFilter === 'All') {
       this.selectedTeam();
    } else {
      this.playerService.getPlayersByPosition(arg0, this.playerIDs).subscribe((players) => {
        this.players.set(players);
      });
    }
  }
}
