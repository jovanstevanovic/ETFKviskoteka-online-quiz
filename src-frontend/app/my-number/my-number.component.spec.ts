import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNumberComponent } from './my-number.component';

describe('MyNumberComponent', () => {
  let component: MyNumberComponent;
  let fixture: ComponentFixture<MyNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
