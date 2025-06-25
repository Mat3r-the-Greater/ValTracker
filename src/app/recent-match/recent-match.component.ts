import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValorantApiService, ValorantMatch, ValorantPlayer } from '../valorant-api.service';

@Component({
  selector: 'app-recent-match',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-match.component.html',
  styleUrl: './recent-match.component.css'
})
export class RecentMatchComponent implements OnInit {
  loading = true;
  error = '';
  recentMatch: ValorantMatch | null = null;
  myStats: ValorantPlayer | null = null;
  playerWon = false;

  constructor(private valorantApi: ValorantApiService) { }

  ngOnInit() {
    this.loadRecentMatch();
  }

  loadRecentMatch() {
    this.loading = true;
    this.error = '';

    this.valorantApi.getPlayerRecentMatches('Mat3r', 't0w').subscribe({
      next: (data) => {
        if (data.matchIds && data.matchIds.length > 0) {
          // Get the most recent match (first in the array)
          this.loadMatchDetails(data.matchIds[0]);
        } else {
          this.error = 'No recent matches found';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = `Failed to load recent matches: ${error.message || 'Unknown error'}`;
        this.loading = false;
        console.error('API Error:', error);
      }
    });
  }

  loadMatchDetails(matchId: string) {
    this.valorantApi.getMatchById(matchId).subscribe({
      next: (match) => {
        this.recentMatch = match;
        this.findMyStats();
        this.loading = false;
      },
      error: (error) => {
        this.error = `Failed to load match details: ${error.message || 'Unknown error'}`;
        this.loading = false;
        console.error('Match API Error:', error);
      }
    });
  }

  findMyStats() {
    if (!this.recentMatch) return;

    // Find your player data in the match
    this.myStats = this.recentMatch.players.find(
      player => player.gameName === 'Mat3r' && player.tagLine === 't0w'
    ) || null;

    if (this.myStats) {
      // Determine if you won
      const myTeam = this.recentMatch.teams.find(team => team.teamId === this.myStats!.teamId);
      this.playerWon = myTeam?.won || false;
    }
  }

  getPlayersForTeam(teamId: string): ValorantPlayer[] {
    if (!this.recentMatch) return [];
    return this.recentMatch.players.filter(player => player.teamId === teamId);
  }

  formatDuration(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  formatDate(millis: number): string {
    const date = new Date(millis);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getKDRatio(kills: number, deaths: number): string {
    if (deaths === 0) return kills.toString();
    return (kills / deaths).toFixed(2);
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
    return mapNames[mapId] || 'Unknown Map';
  }

  getAgentName(characterId: string): string {
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
