import { effect, Injectable, signal } from '@angular/core';

export type PlayerSide = 'w' | 'b';

export class CountdownConfig {
  initial: number = 300000    // ms
  increment?: number = 0     // Fischer increment (ms)
  delay?: number = 0         // Bronstein delay (ms)
}

@Injectable({ providedIn: 'root' })
export class CountdownService {

  private intervalId: number | null = null;

  private config: CountdownConfig = new CountdownConfig();
  // State signals
  readonly timeWhite = signal(this.config?.initial);
  readonly timeBlack = signal(this.config?.initial);

  readonly activePlayer = signal<PlayerSide>('w');
  readonly isRunning = signal(false);
  readonly delayRemaining = signal(0);

  private activePlayerChangedEffect = effect(
    () => {
      const active = this.activePlayer()  
      this.switchTurn()    
    })


  /** Initialize both timers */
  init(config: CountdownConfig): void {
    this.config = config;

    this.timeWhite.set(config.initial);
    this.timeBlack.set(config.initial);
    this.delayRemaining.set(config.delay ?? 0);
    this.activePlayer.set('w');
    this.isRunning.set(false);

    this.stop(); // ensure no old interval runs
  }

  /** Start the clock */
  start(): void {
    if (this.isRunning()) {
      return;
    }

    this.isRunning.set(true);
    const delay = this.config.delay ?? 0;

    // Reset delay on start of new turn
    this.delayRemaining.set(delay);

    this.intervalId = window.setInterval(() => {
      if (this.delayRemaining() > 0) {
        this.delayRemaining.update(d => d - 1000);
        return;
      }

      this.tickActivePlayer();
    }, 1000);
  }

  /** Stop the clock */
  stop(): void {
    this.isRunning.set(false);

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** Switch turn: add increment, change active player */
  switchTurn(): void {
    const inc = this.config.increment ?? 0;
    const delay = this.config.delay ?? 0;

    // Apply increment to player who just moved
    if (this.activePlayer() === 'w') {
      this.timeWhite.update(t => t + inc);
    } else {
      this.timeBlack.update(t => t + inc);
    }

    // Reset Bronstein delay
    this.delayRemaining.set(delay);
  }

  /** Decrement time for the active player */
  private tickActivePlayer(): void {
    if (!this.isRunning()) {
      return;
    }

    if (this.activePlayer() === 'w') {
      this.timeWhite.update(t => Math.max(0, t - 1000));
    } else {
      this.timeBlack.update(t => Math.max(0, t - 1000));
    }
  }

  /** Hard reset */
  reset(): void {
    this.init(this.config);
  }
}
