import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { TeamTrackerComponent } from './team-tracker.component';
import { TeamTrackerService } from '../services/team-tracker.service';

describe('TeamTrackerComponent', () => {
  let component: TeamTrackerComponent;
  let fixture: ComponentFixture<TeamTrackerComponent>;
  let teamTrackerServiceSpy: jasmine.SpyObj<TeamTrackerService>;

  beforeEach(async () => {
    // Create spy object for TeamTrackerService
    const spy = jasmine.createSpyObj('TeamTrackerService', [
      'getLeagues',
      'getTeamsByLeague',
      'getSeasons',
      'getTeamData'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TeamTrackerComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: TeamTrackerService, useValue: spy }
      ]
    }).compileComponents();

    teamTrackerServiceSpy = TestBed.inject(TeamTrackerService) as jasmine.SpyObj<TeamTrackerService>;
    
    // Set up mock responses
    teamTrackerServiceSpy.getLeagues.and.returnValue(of([
      { id: 1, name: 'NACE' },
      { id: 2, name: 'NECC' }
    ]));
    
    teamTrackerServiceSpy.getTeamsByLeague.and.returnValue(of([
      { id: 1, name: 'Team Alpha', leagueId: 1 },
      { id: 2, name: 'Team Beta', leagueId: 1 }
    ]));
    
    teamTrackerServiceSpy.getSeasons.and.returnValue(of([
      { id: 1, name: 'Spring 2024' },
      { id: 2, name: 'Fall 2023' }
    ]));
    
    teamTrackerServiceSpy.getTeamData.and.returnValue(of({
      weeklyMatches: [],
      seasonStats: []
    }));

    fixture = TestBed.createComponent(TeamTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load leagues on init', () => {
    expect(teamTrackerServiceSpy.getLeagues).toHaveBeenCalled();
    expect(component.leagues.length).toBe(2);
  });

  it('should load teams when league changes', () => {
    // Simulate user selecting a league
    component.trackerForm.patchValue({ league: 1 });
    
    expect(teamTrackerServiceSpy.getTeamsByLeague).toHaveBeenCalledWith(1);
    expect(component.teams.length).toBe(2);
  });

  it('should load seasons when team changes', () => {
    // Set a league first
    component.trackerForm.patchValue({ league: 1 });
    
    // Simulate user selecting a team
    component.trackerForm.patchValue({ team: 1 });
    component.onTeamChange();
    
    expect(teamTrackerServiceSpy.getSeasons).toHaveBeenCalled();
    expect(component.seasons.length).toBe(2);
  });

  it('should fetch data when form is submitted', () => {
    // Fill out the form
    component.trackerForm.patchValue({
      organization: 'Kettering University',
      league: 1,
      team: 1,
      season: 1,
      viewType: 'weekly'
    });
    
    // Submit the form
    component.onSubmit();
    
    expect(teamTrackerServiceSpy.getTeamData).toHaveBeenCalledWith(
      'Kettering University', 1, 1, 1
    );
    expect(component.isLoading).toBeFalse();
  });

  it('should not fetch data when form is invalid', () => {
    // Submit without filling the form
    component.onSubmit();
    
    expect(teamTrackerServiceSpy.getTeamData).not.toHaveBeenCalled();
  });

  it('should switch view mode when viewType changes', () => {
    component.trackerForm.patchValue({ viewType: 'season' });
    expect(component.viewMode).toBe('season');
    
    component.trackerForm.patchValue({ viewType: 'weekly' });
    expect(component.viewMode).toBe('weekly');
  });
});