import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface League {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  leagueId: number;
}

export interface Season {
  id: number;
  name: string;
}

export interface Player {
  id: number;
  name: string;
  role: string;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    averageCombatScore: number;
  };
}

export interface Match {
  id: number;
  date: string;
  opponent: string;
  result: string;
  score: string;
  playerStats: Player[];
}

export interface TeamStats {
  weeklyMatches: Match[];
  seasonStats: Player[];
}

@Injectable({
  providedIn: 'root'
})
export class TeamTrackerService {
  // Mock data - in a real application, this would be fetched from an API
  private readonly leagues: League[] = [
    { id: 1, name: 'NACE' },
    { id: 2, name: 'NECC' }
  ];

  private readonly teams: Team[] = [
    { id: 1, name: 'Team Alpha', leagueId: 1 },
    { id: 2, name: 'Team Beta', leagueId: 1 },
    { id: 3, name: 'Team Gamma', leagueId: 2 },
    { id: 4, name: 'Team Delta', leagueId: 2 }
  ];

  private readonly seasons: Season[] = [
    { id: 1, name: 'Spring 2024' },
    { id: 2, name: 'Fall 2023' }
  ];

  constructor() { }

  getLeagues(): Observable<League[]> {
    // In a real app, this would be an HTTP call
    return of(this.leagues);
  }

  getTeamsByLeague(leagueId: number): Observable<Team[]> {
    // In a real app, this would be an HTTP call
    const filteredTeams = this.teams.filter(team => team.leagueId === leagueId);
    return of(filteredTeams);
  }

  getSeasons(): Observable<Season[]> {
    // In a real app, this would be an HTTP call
    return of(this.seasons);
  }

  getTeamData(organization: string, leagueId: number, teamId: number, seasonId: number): Observable<TeamStats> {
    // In a real app, this would be an HTTP call with parameters
    
    // For demo purposes, we're returning mock data
    const mockWeeklyMatches: Match[] = [
      {
        id: 1,
        date: '2024-04-20',
        opponent: 'University X',
        result: 'Win',
        score: '13-7',
        playerStats: [
          { id: 1, name: 'Player1', role: 'Duelist', stats: { kills: 24, deaths: 12, assists: 3, averageCombatScore: 285 } },
          { id: 2, name: 'Player2', role: 'Controller', stats: { kills: 16, deaths: 14, assists: 10, averageCombatScore: 210 } },
          { id: 3, name: 'Player3', role: 'Sentinel', stats: { kills: 14, deaths: 13, assists: 2, averageCombatScore: 175 } },
          { id: 4, name: 'Player4', role: 'Initiator', stats: { kills: 18, deaths: 12, assists: 8, averageCombatScore: 245 } },
          { id: 5, name: 'Player5', role: 'Sentinel', stats: { kills: 10, deaths: 15, assists: 12, averageCombatScore: 155 } }
        ]
      },
      {
        id: 2,
        date: '2024-04-13',
        opponent: 'University Y',
        result: 'Loss',
        score: '9-13',
        playerStats: [
          { id: 1, name: 'Player1', role: 'Duelist', stats: { kills: 20, deaths: 16, assists: 1, averageCombatScore: 245 } },
          { id: 2, name: 'Player2', role: 'Controller', stats: { kills: 12, deaths: 16, assists: 8, averageCombatScore: 175 } },
          { id: 3, name: 'Player3', role: 'Sentinel', stats: { kills: 10, deaths: 15, assists: 4, averageCombatScore: 150 } },
          { id: 4, name: 'Player4', role: 'Initiator', stats: { kills: 15, deaths: 14, assists: 6, averageCombatScore: 200 } },
          { id: 5, name: 'Player5', role: 'Sentinel', stats: { kills: 8, deaths: 16, assists: 10, averageCombatScore: 135 } }
        ]
      }
    ];
    
    const mockSeasonStats: Player[] = [
      { id: 1, name: 'Player1', role: 'Duelist', stats: { kills: 22.5, deaths: 13.8, assists: 2.1, averageCombatScore: 268 } },
      { id: 2, name: 'Player2', role: 'Controller', stats: { kills: 14.2, deaths: 14.5, assists: 9.3, averageCombatScore: 198 } },
      { id: 3, name: 'Player3', role: 'Sentinel', stats: { kills: 12.6, deaths: 13.9, assists: 3.4, averageCombatScore: 165 } },
      { id: 4, name: 'Player4', role: 'Initiator', stats: { kills: 16.8, deaths: 12.7, assists: 7.5, averageCombatScore: 230 } },
      { id: 5, name: 'Player5', role: 'Sentinel', stats: { kills: 9.4, deaths: 15.3, assists: 11.2, averageCombatScore: 142 } }
    ];
    
    return of({
      weeklyMatches: mockWeeklyMatches,
      seasonStats: mockSeasonStats
    });
  }
}