import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import type { User } from '@easy-bsb/web/api/users';
import { AuthorizationService } from '@easy-bsb/web/core/authorization';
import { MenuEntries, MENU_MAX_WIDTH, MENU_MIN_WIDTH } from './constants';

@Component({
  selector: 'easy-bsb-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('sidebarTrigger', [
      transition(':enter', [
        style({ width: MENU_MIN_WIDTH })
      ]),

      state('open', style({ width: MENU_MAX_WIDTH })),
      state('closed', style({ width: MENU_MIN_WIDTH })),

      transition('open => closed', [animate('100ms ease-in')]),
      transition('closed => open', [animate('200ms ease-out')])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  user?: User;

  menuEntries = MenuEntries;

  state: 'open' | 'closed' = 'closed';

  constructor(
    private readonly authorizationService: AuthorizationService,
  ) {
  }

  ngOnInit(): void {
    this.user = this.authorizationService.authorizedUser();
  }

  toggleMenu(): void {
    this.state = this.state === 'open' ? 'closed' : 'open';
  }

  logout(): void {
    this.authorizationService.logout();
  }
}
