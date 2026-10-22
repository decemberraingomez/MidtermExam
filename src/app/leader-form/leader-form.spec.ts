import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderForm } from './leader-form';

describe('LeaderForm', () => {
  let component: LeaderForm;
  let fixture: ComponentFixture<LeaderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
