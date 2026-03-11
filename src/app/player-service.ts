import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from './Player';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private http = inject(HttpClient);
  private w: string = '200';
  private apiBasePath = 'https://statsapi.mlb.com/api/v1/people?personIds=';
  private urlImageBasePath =
    'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_200,q_auto:best/v1/people/';
  private currentPhotoPath = '/headshot/67/current';
  private urlLogoTeamBasePath = 'https://www.mlb.com/assets/images/teams/';


  teams: string[] = [];

  //Mejorar esto para que de manera automatica podamos obtener los jugadores de Republica Dominicana
  // sin tener que estar actualizando los IDs manualmente
  //esto lo haremos con la api oficial de wbc
  // https://statsapi.mlb.com/api/v1/teams?sportId=51

  // Lista de equipos que van para el clasico mundial de beisbol 2026
  // recoger todos los ids de estos equipos para luego obtener el roster de cada equipo y asi obtener los jugadores de Republica Dominicana
  // https://statsapi.mlb.com/api/v1/teams?sportId=51&leagueIds=160&season=2026

  // Roster de todos los equipos, debemos agregarle el id del equipo para obtener el roster de cada equipo
  // https://statsapi.mlb.com/api/v1/teams/{teamID}/roster?season=2026

  getTeams(){
    this.http.get<any>('https://statsapi.mlb.com/api/v1/teams?sportId=51&leagueIds=160&season=2026')
    .subscribe((response) => {
      response.teams.forEach((team: any) => {
        this.teams.push(team.id);
      });
    });
  }

  getPlayersById(teamId: number): Observable<string[]> {
    let players: string[] = [];
    return this.http.get<any>('https://statsapi.mlb.com/api/v1/teams/' + teamId + '/roster?season=2026')
    .pipe(
      map((response) => {
        response.roster.forEach((player: any) => {
          players.push(player.person.id);
        });
        return players;
      })
    );
  }

  getPlayers(playersId: string[]): Observable<Player[]> {
    console.log('Player IDs for team:', playersId);
    return this.http
      .get<any>(this.apiBasePath + playersId + '&hydrate=currentTeam')
      .pipe(
        map((response) => {
          return response.people.map((person: any) => {

            return {
              id: person.id,
              name: person.firstName,
              lastName: person.lastName,
              number: person.primaryNumber || 'N/A',
              position: person.primaryPosition?.abbreviation || 'N/A',
              admissionDate: person.mlbDebutDate ? new Date(person.mlbDebutDate) : new Date('N/A'),
              imageUrl: this.urlImageBasePath + person.id + this.currentPhotoPath,
              bio:
                person.fullName +
                  ', conocido en el mundo del béisbol por su apodo "' +
                  person.nickName +
                  '", es un ' +
                  person.primaryPosition?.name +
                  ' profesional nacido el ' +
                  person.birthDate +
                  ' en ' +
                  person.birthCity +
                  ', ' +
                  person.birthCountry +
                  '.\n\nCon una estatura de ' +
                  person.height +
                  ' y un peso de ' +
                  person.weight +
                  ' libras, este atleta de ' +
                  person.currentAge +
                  ' años utiliza el dorsal #' +
                  person.primaryNumber +
                  '. En cuanto a sus habilidades técnicas, batea a la ' +
                  person.batSide?.description +
                  ' y lanza a la ' +
                  person.pitchHand?.description +
                  '.\n\nHizo su debut oficial en las Grandes Ligas el ' +
                  person.mlbDebutDate +
                  '. Actualmente, su estatus en la liga es: {active}.' || 'N/A',
              birthCity: person.birthCity || 'N/A',
              birthCountry: person.birthCountry || 'N/A',
              currentTeam: {
                id: person.currentTeam?.id || 0,
                name: person.currentTeam?.name,
              },
              height: person.height || 'N/A',
              weight: person.weight || 0,
              batSide: {
                code: person.batSide?.code || 'N/A',
              },
              currentAge: person.currentAge || 0,
              pitchHand: {
                code: person.pitchHand?.code || 'N/A',
              },
              mlbDebutDate: person.mlbDebutDate || 'N/A',
            } as Player;
          });
        }),
      );
  }

  getPlayerById(playerID: string): Observable<Player> {
    return this.http.get<Player>(this.apiBasePath + playerID + '&hydrate=currentTeam').pipe(
      // Map the response to a Player object
      map((response: any) => {
        response = response.people[0];
        const playerData: Player = {
          id: response.id,
          name: response.firstName,
          lastName: response.lastName,
          number: response.primaryNumber || 'N/A',
          position: response.primaryPosition?.abbreviation || 'N/A',
          admissionDate: response.mlbDebutDate ? new Date(response.mlbDebutDate) : new Date('N/A'),
          imageUrl:
            'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_460,q_auto:best/v1/people/' +
            response.id +
            this.currentPhotoPath,
          bio:
            response.fullName +
              ', conocido en el mundo del béisbol por su apodo "' +
              response.nickName +
              '", es un ' +
              response.primaryPosition?.name +
              ' profesional nacido el ' +
              response.birthDate +
              ' en ' +
              response.birthCity +
              ', ' +
              response.birthCountry +
              '.\n\nCon una estatura de ' +
              response.height +
              ' y un peso de ' +
              response.weight +
              ' libras, este atleta de ' +
              response.currentAge +
              ' años utiliza el dorsal #' +
              response.primaryNumber +
              '. En cuanto a sus habilidades técnicas, batea a la ' +
              response.batSide?.description +
              ' y lanza a la ' +
              response.pitchHand?.description +
              '.\n\nHizo su debut oficial en las Grandes Ligas el ' +
              response.mlbDebutDate +
              '. Actualmente, su estatus en la liga es: {active}.' || 'N/A',
          birthCity: response.birthCity || 'N/A',
          birthCountry: response.birthCountry || 'N/A',
          currentTeam: {
            id: response.currentTeam?.id || 0,
            name: response.currentTeam?.name,
          },
          height: response.height || 'N/A',
          weight: response.weight || 0,
          batSide: {
            code: response.batSide?.code || 'N/A',
          },
          currentAge: response.currentAge || 0,
          pitchHand: {
            code: response.pitchHand?.code || 'N/A',
          },
          mlbDebutDate: response.mlbDebutDate || 'N/A',
        };
        return playerData;
      }),
    );
  }

  getPlayersByPosition(position: string, playersId: string[]): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiBasePath + playersId + '&hydrate=currentTeam').pipe(
      map((response: any) => {
        return response.people.filter((person: any) => person.primaryPosition?.type === position)
        .map((person: any) => {
          return {
              id: person.id,
              name: person.firstName,
              lastName: person.lastName,
              number: person.primaryNumber || 'N/A',
              position: person.primaryPosition?.abbreviation || 'N/A',
              admissionDate: person.mlbDebutDate ? new Date(person.mlbDebutDate) : new Date('N/A'),
              imageUrl: this.urlImageBasePath + person.id + this.currentPhotoPath,
              bio:
                person.fullName +
                  ', conocido en el mundo del béisbol por su apodo "' +
                  person.nickName +
                  '", es un ' +
                  person.primaryPosition?.name +
                  ' profesional nacido el ' +
                  person.birthDate +
                  ' en ' +
                  person.birthCity +
                  ', ' +
                  person.birthCountry +
                  '.\n\nCon una estatura de ' +
                  person.height +
                  ' y un peso de ' +
                  person.weight +
                  ' libras, este atleta de ' +
                  person.currentAge +
                  ' años utiliza el dorsal #' +
                  person.primaryNumber +
                  '. En cuanto a sus habilidades técnicas, batea a la ' +
                  person.batSide?.description +
                  ' y lanza a la ' +
                  person.pitchHand?.description +
                  '.\n\nHizo su debut oficial en las Grandes Ligas el ' +
                  person.mlbDebutDate +
                  '. Actualmente, su estatus en la liga es: {active}.' || 'N/A',
              birthCity: person.birthCity || 'N/A',
              birthCountry: person.birthCountry || 'N/A',
              currentTeam: {
                id: person.currentTeam?.id || 0,
                name: person.currentTeam?.name,
              },
              height: person.height || 'N/A',
              weight: person.weight || 0,
              batSide: {
                code: person.batSide?.code || 'N/A',
              },
              currentAge: person.currentAge || 0,
              pitchHand: {
                code: person.pitchHand?.code || 'N/A',
              },
              mlbDebutDate: person.mlbDebutDate || 'N/A',
            } as Player;
        });
      }
      )
    );
  }

  getTeamLogoUrl(teamId: number, w: string): string {
    return this.urlLogoTeamBasePath + teamId + '/logo-w' + w + '.png';
  }

  getPlayerImageUrl(playerId: number): string {
    return (
      'https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_640,q_auto:best/v1/people/' +
      playerId +
      this.currentPhotoPath
    );
  }

  navbarData = signal<string>('');
}
