import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskbarComponent } from '../Nannies-taskbar/Nannies-taskbar.component';

describe('TaskbarComponent', () => {
  let component: TaskbarComponent;
  let fixture: ComponentFixture<TaskbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
