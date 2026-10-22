import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Leader } from '../leader';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css',
})
export class LeaderForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  leaderService = inject(Leader);

  // null = we are adding a new leader, a string = the _id of the leader being edited
  editingId = signal<string | null>(null);

  leaderForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required, Validators.minLength(2)],
    region: ['', Validators.required, Validators.pattern(/^(Kanto|Johto|Hoenn)$/)],
    town: ['', Validators.required],
    badge: ['', Validators.required],
    specialty: ['', Validators.required],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(/^[0-9]+$/)]],
    motto: ['', Validators.required, [Validators.maxLength(150)]],
  });

  ngOnInit() {
    // Load the saved leader when the component appears
    this.leaderService.fetchLeader();
  }

  startEdit(leader: any) {
    this.editingId.set(leader._id);
    this.leaderForm.patchValue(leader); // fills the form with the chosen leader
  }

  cancelEdit() {
    this.editingId.set(null);
    this.leaderForm.reset();
  }

  deleteLeader(id: string) {
    if (confirm('Are you sure you want to remove this leader from the registry?')) {
      this.leaderService.deleteLeader(id).subscribe({
        next: () => {
          if (this.editingId() === id) this.cancelEdit();
          this.leaderService.fetchLeader();
        },
        error: (err) => console.error('Delete failed', err),
      });
    }
  }

  onSubmit() {
    if (this.leaderForm.invalid) return;

    const data = this.leaderForm.getRawValue();
    const id = this.editingId();

    if (id) {
      this.leaderService.updateLeader(id, data).subscribe({
        next: () => {
          this.leaderService.fetchLeader();
          this.cancelEdit();
        },
        error: (err) => console.error('Update failed', err),
      });
    } else {
      this.leaderService.saveLeader(data).subscribe({
        next: () => {
          this.leaderService.fetchLeader();
          this.leaderForm.reset();
        },
        error: (err) => console.error('Save failed', err),
      });
    }
  }
}
