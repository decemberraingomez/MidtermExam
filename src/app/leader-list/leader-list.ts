import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { LeaderCard } from '../leader-card/leader-card';

@Component({
  selector: 'app-leader-list',
  standalone: true,
  imports: [LeaderCard],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css',
})
export class LeaderList implements OnInit {
  private leaderService = inject(GymLeaderService);
  private router = inject(Router);

  regions = ['All', 'Kanto', 'Johto', 'Hoenn'];
  selectedRegion = signal('All');

  filteredLeaders = computed(() => {
    const region = this.selectedRegion();
    const all = this.leaderService.leaders();
    return region === 'All' ? all : all.filter(l => l.region === region);
  });

  ngOnInit() {
    this.leaderService.fetchLeaders();
  }

  setRegion(region: string) {
    this.selectedRegion.set(region);
  }

  onEdit(id: string) {
    this.router.navigate(['/leaders', id, 'edit']);
  }

  onRemove(id: string) {
    const leader = this.leaderService.leaders().find(l => l._id === id);
    if (!confirm(`Remove ${leader?.name ?? 'this leader'} from the registry?`)) return;

    this.leaderService.deleteLeader(id).subscribe({
      next: () => this.leaderService.fetchLeaders(),
    });
  }
}
