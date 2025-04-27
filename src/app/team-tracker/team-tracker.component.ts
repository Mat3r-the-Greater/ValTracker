import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamTrackerService, League, Team, Season, Match, Player } from '../services/team-tracker.service';

@Component({
  selector: 'app-team-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team-tracker.component.html',
  styleUrl: './team-tracker.component.css'
})
export class TeamTrackerComponent implements OnInit {
  trackerForm: FormGroup;
  submitted = false;
  viewMode: 'weekly' | 'season' = 'weekly';
  isLoading = false;

  leagues: League[] = [];
  teams: Team[] = [];
  seasons: Season[] = [];
  
  recentMatches: Match[] = [];
  seasonStats: Player[] = [];

  constructor(
    private fb: FormBuilder,
    private teamTrackerService: TeamTrackerService
  ) {
    this.trackerForm = this.fb.group({
      organization: ['', Validators.required],
      league: ['', Validators.required],
      team: ['', Validators.required],
      season: ['', Validators.required],
      viewType: ['weekly', Validators.required]
    });

    // Listen for changes on the league to update teams
    this.trackerForm.get('league')?.valueChanges.subscribe(leagueId => {
      if (leagueId) {
        this.loadTeams(Number(leagueId));
      }
    });

    // Listen for changes on view type
    this.trackerForm.get('viewType')?.valueChanges.subscribe(viewType => {
      this.viewMode = viewType;
    });
  }

  ngOnInit(): void {
    // Load leagues when component initializes
    this.loadLeagues();
  }

  loadLeagues(): void {
    this.teamTrackerService.getLeagues().subscribe(leagues => {
      this.leagues = leagues;
    });
  }

  loadTeams(leagueId: number) {
    this.teamTrackerService.getTeamsByLeague(leagueId).subscribe(teams => {
      this.teams = teams;
      
      // Reset team selection
      this.trackerForm.patchValue({ team: '' });
      
      // Also reset seasons when league changes
      this.seasons = [];
      this.trackerForm.patchValue({ season: '' });
    });
  }

  loadSeasons(teamId: number) {
    this.teamTrackerService.getSeasons().subscribe(seasons => {
      this.seasons = seasons;
      
      // Reset season selection
      this.trackerForm.patchValue({ season: '' });
    });
  }

  onTeamChange() {
    const teamId = this.trackerForm.get('team')?.value;
    if (teamId) {
      this.loadSeasons(Number(teamId));
    }
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.trackerForm.valid) {
      this.isLoading = true;
      const formData = this.trackerForm.value;
      
      this.teamTrackerService.getTeamData(
        formData.organization,
        Number(formData.league),
        Number(formData.team),
        Number(formData.season)
      ).subscribe({
        next: (data) => {
          this.recentMatches = data.weeklyMatches;
          this.seasonStats = data.seasonStats;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching team data:', error);
          this.isLoading = false;
          // Here you could add error handling logic
        }
      });
    }
  }
}