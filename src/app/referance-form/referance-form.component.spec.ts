import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferanceFormComponent } from './referance-form.component';

describe('ReferanceFormComponent', () => {
  let component: ReferanceFormComponent;
  let fixture: ComponentFixture<ReferanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferanceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
