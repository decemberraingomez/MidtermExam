import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { GymLeader } from '../gym-leader.model';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css',
})
export class LeaderForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private leaderService = inject(GymLeaderService);

  regions = ['Kanto', 'Johto', 'Hoenn'];

  // null = Add mode, a string = Edit mode (the _id of the leader being edited)
  editingId = signal<string | null>(null);
  serverError = signal('');

  leaderForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['', Validators.required],
    town: ['', Validators.required],
    badge: ['', Validators.required],
    specialty: ['', Validators.required],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(/^\d+$/)]],
    motto: ['', Validators.maxLength(150)],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(id);
      this.leaderService.getLeader(id).subscribe({
        next: leader => this.leaderForm.patchValue(leader),
        error: () => this.router.navigate(['/leaders']),
      });
    }
  }

  // true once a field has been touched and is invalid
  showError(field: string): boolean {
    const control = this.leaderForm.get(field);
    return !!control && control.touched && control.invalid;
  }

  onSubmit() {
    if (this.leaderForm.invalid) return;

    const data: GymLeader = this.leaderForm.getRawValue();
    const id = this.editingId();
    const request = id
      ? this.leaderService.updateLeader(id, data)
      : this.leaderService.addLeader(data);

    request.subscribe({
      next: () => {
        this.leaderForm.reset();
        this.router.navigate(['/leaders']);
      },
      error: err => this.serverError.set(err.error?.message ?? 'Something went wrong. Please try again.'),
    });
  }

  onCancel() {
    this.router.navigate(['/leaders']);
  }
}
