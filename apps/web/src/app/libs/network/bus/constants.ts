import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from "@angular/animations";

export const deviceAnimationMetadata: AnimationTriggerMetadata = trigger('devicesContainer', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' })
  ]),

  state('open', style({ transform: 'translateX(0)' })),
  state('closed', style({ transform: 'translateX(100%)' })),

  transition('open => closed', [animate('100ms ease-in')]),
  transition('closed => open', [animate('200ms ease-out')])
]);
