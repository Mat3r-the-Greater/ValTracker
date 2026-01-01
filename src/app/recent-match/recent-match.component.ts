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

    // Get account info using Henrik API
    this.valorantService.getAccountHenrik(this.playerName, this.playerTag).subscribe({
      next: (response: any) => {
        console.log('Full Account Response:', response);
        console.log('Response status:', response?.status);
        console.log('Response data:', response?.data);

        // Henrik API returns data directly in the response
        if (response && response.status === 200 && response.data) {
          this.playerData = response.data;
          this.getMMRData();
          this.getMatches();
        } else if (response && response.data) {
          // Sometimes the API might return data even without status 200
          console.log('Response received but status is not 200:', response.status);
          this.playerData = response.data;
          this.getMMRData();
          this.getMatches();
        } else {
          this.error = `Player not found. Status: ${response?.status || 'unknown'}`;
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Full error object:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error body:', err.error);

        if (err.status === 404) {
          this.error = 'Player not found. Please check the name and tag.';
        } else if (err.status === 429) {
          this.error = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to API. Check your internet connection or CORS settings.';
        } else {
          this.error = `Error: ${err.status || 'Unknown'} - ${err.message || 'Failed to fetch player data'}`;
        }
        this.loading = false;
      }
    });
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
