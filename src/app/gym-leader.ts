import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymLeader } from './gym-leader.model';

@Injectable({
  providedIn: 'root',
})
export class GymLeaderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/leaders';

  leaders = signal<GymLeader[]>([]);

  kantoCount = computed(() => this.leaders().filter(l => l.region === 'Kanto').length);
  johtoCount = computed(() => this.leaders().filter(l => l.region === 'Johto').length);
  hoennCount = computed(() => this.leaders().filter(l => l.region === 'Hoenn').length);

  fetchLeaders(): void {
    this.http.get<GymLeader[]>(this.apiUrl).subscribe(data => this.leaders.set(data));
  }

  getLeader(id: string): Observable<GymLeader> {
    return this.http.get<GymLeader>(`${this.apiUrl}/${id}`);
  }

  addLeader(leader: GymLeader): Observable<GymLeader> {
    return this.http.post<GymLeader>(this.apiUrl, leader);
  }

  updateLeader(id: string, leader: GymLeader): Observable<GymLeader> {
    return this.http.put<GymLeader>(`${this.apiUrl}/${id}`, leader);
  }

  deleteLeader(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
