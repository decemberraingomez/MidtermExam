import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Leader {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/leader';

  //Reactive state management using signals
  leaderList = signal<any[]>([]);

  fetchLeader(){
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.leaderList.set(data));
  }

  saveLeader(data: any){
    return this.http.post(this.apiUrl, data);
  }

  updateLeader(id: string, data: any){
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteLeader(id: string){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
