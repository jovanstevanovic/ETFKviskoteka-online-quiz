import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnagramGameComponent } from './anagram-game.component';

describe('AnagramGameComponent', () => {
  let component: AnagramGameComponent;
  let fixture: ComponentFixture<AnagramGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnagramGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnagramGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
