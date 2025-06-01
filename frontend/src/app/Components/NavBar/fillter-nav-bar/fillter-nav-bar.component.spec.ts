import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillterNavBarComponent } from './fillter-nav-bar.component';

describe('FillterNavBarComponent', () => {
  let component: FillterNavBarComponent;
  let fixture: ComponentFixture<FillterNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillterNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FillterNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
