import { Player } from './../Player';
import { Component, inject, Input } from '@angular/core';
import { AveragePipe } from "../average-pipe";
import { DatePipe, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { PlayerService } from '../player-service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-detail-component',
  imports: [UpperCasePipe, DatePipe, RouterLink, NgOptimizedImage],
  templateUrl: './detail-component.html',
  styleUrl: './detail-component.css',
})
export class DetailComponent {

    constructor(private route: ActivatedRoute) {

    }


    playerService = inject(PlayerService);
    playerDetail: Player | undefined;


    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
      this.playerService.getPlayerById(id).subscribe({
        next: (player) => {this.playerDetail = player;
        },
        error: (err) => {
          console.error('Error fetching player details:', err);
        }
      });
      }

      });
    }


}
