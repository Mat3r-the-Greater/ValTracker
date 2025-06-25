import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ValorantAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface ValorantMatch {
  matchInfo: {
    matchId: string;
    mapId: string;
    gameLengthMillis: number;
    gameStartMillis: number;
    provisioningFlowId: string;
    isCompleted: boolean;
    customGameName: string;
    queueId: string;
    gameMode: string;
    isRanked: boolean;
    seasonId: string;
  };
  players: ValorantPlayer[];
  teams: ValorantTeam[];
  roundResults: any[];
}

export interface ValorantPlayer {
  puuid: string;
  gameName: string;
  tagLine: string;
  teamId: string;
  partyId: string;
  characterId: string;
  stats: {
    score: number;
    roundsPlayed: number;
    kills: number;
    deaths: number;
    assists: number;
    playtimeMillis: number;
  };
  competitiveTier: number;
  playerCard: string;
  playerTitle: string;
}

export interface ValorantTeam {
  teamId: string;
  won: boolean;
  roundsPlayed: number;
  roundsWon: number;
  numPoints: number;
}

@Injectable({
  providedIn: 'root'
})
export class ValorantApiService {
  private apiKey = 'RGAPI-72fa47bc-d8fe-42a3-891d-671d99609c96'; // Replace with your actual API key
  private baseUrl = 'https://api.allorigins.win/raw?url=https://americas.api.riotgames.com';
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Riot-Token': this.apiKey
    });
  }

  // Get account info by Riot ID (gameName#tagLine)
  getAccountByRiotId(gameName: string, tagLine: string): Observable<ValorantAccount> {
    const url = `${this.baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    return this.http.get<ValorantAccount>(url, { headers: this.getHeaders() });
  }

  // Get recent match IDs for a player
  getRecentMatches(puuid: string): Observable<{ history: string[] }> {
    const url = `${this.baseUrl}/val/match/v1/recent-matches/by-puuid/${puuid}`;
    return this.http.get<{ history: string[] }>(url, { headers: this.getHeaders() });
  }

  // Get match details by match ID
  getMatchById(matchId: string): Observable<ValorantMatch> {
    const url = `${this.baseUrl}/val/match/v1/matches/${matchId}`;
    return this.http.get<ValorantMatch>(url, { headers: this.getHeaders() });
  }

  // Convenience method to get your recent matches
  getPlayerRecentMatches(gameName: string, tagLine: string): Observable<any> {
    return new Observable(observer => {
      this.getAccountByRiotId(gameName, tagLine).subscribe({
        next: (account) => {
          this.getRecentMatches(account.puuid).subscribe({
            next: (matches) => {
              observer.next({
                account: account,
                matchIds: matches.history
              });
              observer.complete();
            },
            error: (error) => observer.error(error)
          });
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
