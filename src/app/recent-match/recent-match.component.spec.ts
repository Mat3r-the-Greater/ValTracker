import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecentMatchComponent } from './recent-match.component';
import { ValorantApiService } from '../valorant-api.service';

describe('RecentMatchComponent', () => {
  let component: RecentMatchComponent;
  let fixture: ComponentFixture<RecentMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentMatchComponent, HttpClientTestingModule],
      providers: [ValorantApiService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecentMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading true', () => {
    expect(component.loading).toBe(true);
  });

  it('should calculate KD ratio correctly', () => {
    expect(component.getKDRatio(10, 5)).toBe('2.00');
    expect(component.getKDRatio(5, 0)).toBe('5');
    expect(component.getKDRatio(0, 5)).toBe('0.00');
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(60000)).toBe('1m 0s');
    expect(component.formatDuration(90000)).toBe('1m 30s');
    expect(component.formatDuration(3600000)).toBe('60m 0s');
  });

  it('should get map name correctly', () => {
    expect(component.getMapName('/Game/Maps/Ascent/Ascent')).toBe('Ascent');
    expect(component.getMapName('/Game/Maps/Bind/Bind')).toBe('Bind');
    expect(component.getMapName('Unknown')).toBe('Unknown Map');
  });

  it('should get agent name correctly', () => {
    expect(component.getAgentName('5f8d3a7f-467b-97f3-062c-13acf203c006')).toBe('Breach');
    expect(component.getAgentName('add6443a-41bd-e414-f6ad-e58d267f4e95')).toBe('Jett');
    expect(component.getAgentName('unknown-id')).toBe('Unknown Agent');
  });
});
