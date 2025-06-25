import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValorantApiService, ValorantMatch } from '../valorant-api.service';

@Component({
  selector: 'app-match-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="match-test-container">
      <h2>Valorant Match Data Test</h2>
      
      <div class="test-section">
        <button (click)="testGetPlayerData()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Get My Recent Matches' }}
        </button>
      </div>

      <div *ngIf="error" class="error">
        <h3>Error:</h3>
        <p>{{ error }}</p>
      </div>

      <div *ngIf="playerData" class="player-info">
        <h3>Player Info:</h3>
        <p><strong>Name:</strong> {{ playerData.account.gameName }}#{{ playerData.account.tagLine }}</p>
        <p><strong>PUUID:</strong> {{ playerData.account.puuid }}</p>
        <p><strong>Recent Matches Found:</strong> {{ playerData.matchIds.length }}</p>
      </div>

      <div *ngIf="playerData?.matchIds.length > 0" class="match-ids">
        <h3>Recent Match IDs:</h3>
        <div class="match-id-list">
          <div *ngFor="let matchId of playerData.matchIds.slice(0, 5); let i = index" class="match-id-item">
            <span>{{ i + 1 }}. {{ matchId }}</span>
            <button (click)="loadMatchDetails(matchId)" [disabled]="loadingMatch === matchId">
              {{ loadingMatch === matchId ? 'Loading...' : 'Load Details' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="selectedMatch" class="match-details">
        <h3>Match Details:</h3>
        <div class="match-info">
          <p><strong>Match ID:</strong> {{ selectedMatch.matchInfo.matchId }}</p>
          <p><strong>Map:</strong> {{ getMapName(selectedMatch.matchInfo.mapId) }}</p>
          <p><strong>Game Mode:</strong> {{ selectedMatch.matchInfo.gameMode }}</p>
          <p><strong>Duration:</strong> {{ formatDuration(selectedMatch.matchInfo.gameLengthMillis) }}</p>
          <p><strong>Ranked:</strong> {{ selectedMatch.matchInfo.isRanked ? 'Yes' : 'No' }}</p>
        </div>

        <div class="teams">
          <h4>Teams:</h4>
          <div *ngFor="let team of selectedMatch.teams" class="team">
            <p><strong>Team {{ team.teamId }}:</strong> 
              {{ team.won ? 'Won' : 'Lost' }} 
              ({{ team.roundsWon }}/{{ team.roundsPlayed }} rounds)
            </p>
          </div>
        </div>

        <div class="players">
          <h4>Players:</h4>
          <div class="player-grid">
            <div *ngFor="let player of selectedMatch.players" class="player-card">
              <h5>{{ player.gameName }}#{{ player.tagLine }}</h5>
              <p>Team: {{ player.teamId }}</p>
              <p>Agent: {{ getAgentName(player.characterId) }}</p>
              <div class="stats">
                <span>K: {{ player.stats.kills }}</span>
                <span>D: {{ player.stats.deaths }}</span>
                <span>A: {{ player.stats.assists }}</span>
                <span>Score: {{ player.stats.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .match-test-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .test-section {
      margin-bottom: 20px;
    }

    button {
      background-color: #ff4656;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 10px;
    }

    button:hover:not(:disabled) {
      background-color: #e63946;
    }

    button:disabled {
      background-color: #666;
      cursor: not-allowed;
    }

    .error {
      background-color: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      margin: 10px 0;
    }

    .player-info, .match-details {
      background-color: #444;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }

    .match-id-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .match-id-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #333;
      padding: 10px;
      border-radius: 3px;
    }

    .match-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .teams {
      margin: 20px 0;
    }

    .team {
      background-color: #333;
      padding: 10px;
      margin: 5px 0;
      border-radius: 3px;
    }

    .player-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }

    .player-card {
      background-color: #333;
      padding: 15px;
      border-radius: 5px;
    }

    .player-card h5 {
      margin: 0 0 10px 0;
      color: #ff4656;
    }

    .stats {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }

    .stats span {
      background-color: #222;
      padding: 5px 8px;
      border-radius: 3px;
      font-size: 0.9em;
    }
  `]
})
export class MatchTestComponent {
  loading = false;
  loadingMatch = '';
  error = '';
  playerData: any = null;
  selectedMatch: ValorantMatch | null = null;

  constructor(private valorantApi: ValorantApiService) { }

  testGetPlayerData() {
    this.loading = true;
    this.error = '';
    this.playerData = null;

    // Using your username: Mat3r#t0w
    this.valorantApi.getPlayerRecentMatches('Mat3r', 't0w').subscribe({
      next: (data) => {
        this.playerData = data;
        this.loading = false;
        console.log('Player data:', data);
      },
      error: (error) => {
        this.error = `Failed to load player data: ${error.message || error.status}`;
        this.loading = false;
        console.error('API Error:', error);
      }
    });
  }

  loadMatchDetails(matchId: string) {
    this.loadingMatch = matchId;
    this.valorantApi.getMatchById(matchId).subscribe({
      next: (match) => {
        this.selectedMatch = match;
        this.loadingMatch = '';
        console.log('Match details:', match);
      },
      error: (error) => {
        this.error = `Failed to load match details: ${error.message || error.status}`;
        this.loadingMatch = '';
        console.error('Match API Error:', error);
      }
    });
  }

  formatDuration(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getMapName(mapId: string): string {
    const mapNames: { [key: string]: string } = {
      '/Game/Maps/Ascent/Ascent': 'Ascent',
      '/Game/Maps/Bind/Bind': 'Bind',
      '/Game/Maps/Haven/Haven': 'Haven',
      '/Game/Maps/Split/Split': 'Split',
      '/Game/Maps/Icebox/Icebox': 'Icebox',
      '/Game/Maps/Breeze/Breeze': 'Breeze',
      '/Game/Maps/Fracture/Fracture': 'Fracture',
      '/Game/Maps/Pearl/Pearl': 'Pearl',
      '/Game/Maps/Lotus/Lotus': 'Lotus',
      '/Game/Maps/Sunset/Sunset': 'Sunset',
      '/Game/Maps/Abyss/Abyss': 'Abyss'
    };
    return mapNames[mapId] || mapId;
  }

  getAgentName(characterId: string): string {
    // This is a simplified mapping - you'd want to fetch this from the API
    const agentNames: { [key: string]: string } = {
      '5f8d3a7f-467b-97f3-062c-13acf203c006': 'Breach',
      'f94c3b30-42be-e959-889c-5aa313dba261': 'Raze',
      '6f2a04ca-43e0-be17-7f36-b3908627744d': 'Skye',
      '117ed9e3-49f3-6512-3ccf-0cada7e3823b': 'Cypher',
      '320b2a48-4d9b-a075-30f1-1f93a9b638fa': 'Sova',
      '1e58de9c-4950-5125-93e9-a0aee9f98746': 'Killjoy',
      '95b78ed7-4637-86d9-7e41-71ba8c293152': 'Harbor',
      '8e253930-4c05-31dd-1b6c-968525494517': 'Omen',
      '41fb69c1-4189-7b37-f117-bcaf1e96f1bf': 'Astra',
      '9f0d8ba9-4140-b941-57d3-a7ad57c6b417': 'Brimstone',
      '707eab51-4836-f488-046a-cda6bf494859': 'Viper',
      '569fdd95-4d10-43ab-ca70-79becc718b46': 'Sage',
      'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc': 'Reyna',
      'eb93336a-449b-9c1b-0a54-a891f7921d69': 'Phoenix',
      'bb2a4828-46eb-8cd1-e765-15848195d751': 'Neon',
      '22697a3d-45bf-8dd7-4fec-84a9e28c69d7': 'Chamber',
      '601dbbe7-43ce-be57-2a40-4abd24953621': 'KAY/O',
      '6ad6448a-4d25-bfea-2703-6e847eb8cf2c': 'Yoru',
      'add6443a-41bd-e414-f6ad-e58d267f4e95': 'Jett',
      'dade69b4-4f5a-8528-247b-219e5a1facd6': 'Fade',
      'e370fa57-4757-3604-3648-499e1f642d3f': 'Gekko',
      '1dbf2edd-7ea8-35c7-672d-3a2e3d8b3e62': 'Deadlock',
      'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235': 'Iso',
      '0e38b510-41a8-5780-5e8f-568b2a4f2d6c': 'Clove',
      'efba5359-c8ae-5d5c-5f61-05ca9c37e01e': 'Vyse'
    };
    return agentNames[characterId] || 'Unknown Agent';
  }
}
