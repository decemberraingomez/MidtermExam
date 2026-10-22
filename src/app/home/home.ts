import { Component, OnInit, inject } from '@angular/core';
import { GymLeaderService } from '../gym-leader';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  leaderService = inject(GymLeaderService);

  ngOnInit() {
    this.leaderService.fetchLeaders();
  }
}
