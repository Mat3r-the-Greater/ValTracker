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
  private baseUrl = 'http://localhost:3001/api';
  private henrikUrl = 'https://api.henrikdev.xyz/valorant';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // ============================================
  // OFFICIAL RIOT API METHODS (via proxy)
  // ============================================

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

  // ============================================
  // HENRIK UNOFFICIAL API METHODS
  // (Use these when you don't have proxy access)
  // ============================================

  // Get account details by name and tag (Henrik API)
  getAccountHenrik(name: string, tag: string): Observable<any> {
    return this.http.get(`${this.henrikUrl}/v1/account/${name}/${tag}`);
  }

  // Get MMR (rank) data (Henrik API)
  getMMR(region: string, name: string, tag: string): Observable<any> {
    return this.http.get(`${this.henrikUrl}/v2/mmr/${region}/${name}/${tag}`);
  }

  // Get match history (Henrik API)
  getMatchHistory(region: string, name: string, tag: string, filter?: string): Observable<any> {
    const filterParam = filter ? `?filter=${filter}` : '';
    return this.http.get(`${this.henrikUrl}/v3/matches/${region}/${name}/${tag}${filterParam}`);
  }

  // Get specific match details (Henrik API)
  getMatchDetails(matchId: string): Observable<any> {
    return this.http.get(`${this.henrikUrl}/v2/match/${matchId}`);
  }

  // Get leaderboard (Henrik API)
  getLeaderboard(region: string, season?: string): Observable<any> {
    const seasonParam = season ? `?season=${season}` : '';
    return this.http.get(`${this.henrikUrl}/v2/leaderboard/${region}${seasonParam}`);
  }

  // Get store offers (Henrik API)
  getStoreOffers(): Observable<any> {
    return this.http.get(`${this.henrikUrl}/v1/store-offers`);
  }
}
