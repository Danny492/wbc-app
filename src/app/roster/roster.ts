import { PlayerService } from './../player-service';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { CardComponent } from '../card-component/card-component';
import { Player } from '../Player';
import { Layout } from '../layout/layout';

@Component({
  selector: 'app-roster',
  imports: [CardComponent],
  templateUrl: './roster.html',
  styleUrl: './roster.css',
})
export class Roster {
  playerService = inject(PlayerService);

  players = signal<Player[]>([]);
  // playerFiltered: Player[] = [];
  // @Input() searchTerm: string = '';

  playerIDs: string[] = [];
  teams: string[] = [];
  selectedTeamVar:number = 0;

  playersFiltered = computed(() => {
    const term = this.playerService.navbarData().toLowerCase();

    if (!term) {
      return this.players();
    }

    return this.players().filter((player) =>
      (player.name + ' ' + player.lastName).toLowerCase().includes(term)
    );
  });

  positionFilter: string = '';

  ngOnInit(): void {

    // this.playerService.getTeams();
    // this.teams = this.playerService.teams;
  }

  selectedTeam(teamId: number){
    this.selectedTeamVar = teamId;
    this.playerService.getPlayersById(teamId).subscribe((playersId) => {
      this.playerIDs = playersId;

        this.playerService.getPlayers(this.playerIDs).subscribe((players) => {
      this.players.set(players);
    });
    });
  }

  // Revisar el metodo de filtros
  filterByPosition(arg0: string) {
    this.positionFilter = arg0;
    if (this.positionFilter === 'All') {
      // this.ngOnInit();
      this.selectedTeam(this.selectedTeamVar);
    } else {
      this.playerService.getPlayersByPosition(arg0, this.playerIDs).subscribe((players) => {
        this.players.set(players);
      });
    }
  }
}


