import { Injectable, signal } from '@angular/core';

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BreakpointDefinition {
  name: BreakpointName;
  query: string;
}

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  // Define all breakpoints here
  private readonly breakpoints: BreakpointDefinition[] = [
    { name: 'xs', query: '(max-width: 575.99px)' },
    { name: 'sm', query: '(min-width: 576px) and (max-width: 767.99px)' },
    { name: 'md', query: '(min-width: 768px) and (max-width: 991.99px)' },
    { name: 'lg', query: '(min-width: 992px) and (max-width: 1199.99px)' },
    { name: 'xl', query: '(min-width: 1200px)' },
  ];

  readonly current = signal<BreakpointName>(this.detectCurrent());

  constructor() {
    this.initializeListeners();
  }

  private detectCurrent(): BreakpointName {
    for (const bp of this.breakpoints) {
      if (window.matchMedia(bp.query).matches) {
        return bp.name;
      }
    }
    return 'xl'; // fallback
  }

  private initializeListeners(): void {
    for (const bp of this.breakpoints) {
      const media = window.matchMedia(bp.query);

      media.addEventListener('change', () => {
        if (media.matches) {
          this.current.set(bp.name);
        }
      });
    }
  }

  // Helper API
  is(name: BreakpointName): boolean {
    return this.current() === name;
  }

  isMobile(): boolean {
    return this.is('xs') || this.is('sm');
  }
}
