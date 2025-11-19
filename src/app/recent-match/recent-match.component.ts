import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValorantApiService } from '../services/valorant-api.service';

@Component({
  selector: 'app-recent-match',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recent-match.component.html',
  styleUrl: './recent-match.component.css'
})
export class RecentMatchComponent implements OnInit {
  playerName: string = '';
  playerTag: string = '';
  region: string = 'na';

  playerData: any = null;
  mmrData: any = null;
  matches: any[] = [];

  loading: boolean = false;
  error: string = '';

  constructor(private valorantService: ValorantApiService) { }

  ngOnInit(): void {
    // Initialize component
  }

  searchPlayer(): void {
    if (!this.playerName || !this.playerTag) {
      this.error = 'Please enter both player name and tag';
      return;
    }

    this.loading = true;
    this.error = '';
    this.playerData = null;
    this.mmrData = null;
    this.matches = [];

    // Get account info using Henrik API - check if method exists
    if (typeof this.valorantService.getAccountHenrik === 'function') {
      this.valorantService.getAccountHenrik(this.playerName, this.playerTag).subscribe({
        next: (response: any) => {
          console.log('Account response:', response);
          if (response.status === 200) {
            this.playerData = response.data;
            this.getMMRData();
            this.getMatches();
          } else {
            this.error = 'Player not found';
            this.loading = false;
          }
        },
        error: (err: any) => {
          this.error = 'Error fetching player data. Please check the name and tag.';
          this.loading = false;
          console.error('Account error:', err);
        }
      });
    } else {
      this.error = 'Henrik API method not found. Please check your service.';
      this.loading = false;
      console.error('getAccountHenrik method does not exist on service');
    }
  }

  getMMRData(): void {
    this.valorantService.getMMR(this.region, this.playerName, this.playerTag).subscribe({
      next: (response: any) => {
        console.log('MMR response:', response);
        if (response.status === 200) {
          this.mmrData = response.data;
        }
      },
      error: (err: any) => {
        console.error('Error fetching MMR data:', err);
      }
    });
  }

  getMatches(): void {
    this.valorantService.getMatchHistory(this.region, this.playerName, this.playerTag, 'competitive').subscribe({
      next: (response: any) => {
        console.log('Match history response:', response);
        if (response.status === 200) {
          this.matches = response.data.slice(0, 5);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching match history:', err);
        this.loading = false;
      }
    });
  }

  getMatchResult(match: any): string {
    const redScore = match.teams?.red || 0;
    const blueScore = match.teams?.blue || 0;
    return redScore > blueScore ? 'Victory' : 'Defeat';
  }
}
