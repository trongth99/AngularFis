import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdftempComponent } from './pdftemp.component';

describe('PdftempComponent', () => {
  let component: PdftempComponent;
  let fixture: ComponentFixture<PdftempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdftempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdftempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
