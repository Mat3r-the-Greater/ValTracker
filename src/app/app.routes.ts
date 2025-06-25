import { Routes } from '@angular/router';
import { TeamTrackerComponent } from './teamtracker/team-tracker.component';
import { RecentMatchComponent } from './recent-match/recent-match.component';

export const routes: Routes = [
  { path: 'team-tracker', component: TeamTrackerComponent },
  { path: 'recent-match', component: RecentMatchComponent },
  { path: '', redirectTo: '/recent-match', pathMatch: 'full' }
];
