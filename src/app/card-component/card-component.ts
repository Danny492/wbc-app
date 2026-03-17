import { Player } from './../Player';
import { Component, Input } from '@angular/core';
import { NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-component',
  imports: [UpperCasePipe, NgOptimizedImage],
  templateUrl: './card-component.html',
  styleUrl: './card-component.css',
})
export class CardComponent {
  @Input() playerDetail: Player | undefined;
  @Input() isPriority: boolean = false;

  constructor(private router: Router) {}

  seeBio(player: Player | undefined): void {
    this.router.navigate(['roster/player', player?.id || '']);
  }
}
