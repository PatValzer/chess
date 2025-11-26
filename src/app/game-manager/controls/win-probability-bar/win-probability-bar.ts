import { Component, computed, inject, Input, input, InputSignal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChessboardService } from '../../../services/chessboard.service';

export class PositionAnalysis {
  whiteWinProbability: number = 0
  drawProbability: number = 0
  blackWinProbability: number = 0
}

@Component({
  selector: 'app-win-probability-bar',
  imports: [MatTooltipModule],
  templateUrl: './win-probability-bar.html',
  styleUrl: './win-probability-bar.scss'
})
export class WinProbabilityBar {
  /** Engine evaluation in centipawns (positive = advantage for White) */


  readonly eval?: InputSignal<number>

  /** Explicit probabilities (0..1). If provided these are used preferentially. */
  // readonly gameExplorer: InputSignal<Games | null> = input.required()

  readonly positionAnalysis: InputSignal<PositionAnalysis> = input.required()
  chessboardService = inject(ChessboardService);

  /** UI toggles */
  readonly verticalBar = input(false);
  readonly height = input(28);
  readonly showLabels = input(false);
  readonly showLegend = input(false);
  readonly showInnerLabels = input(true);


  // Small helper to format numbers for display
  formatPercent(v: number) { return Math.round(v * 100) + '%'; }
  shortPercent(v: number) { return (v * 100).toFixed(0) + '%'; }


  get showEval() { return this.eval !== undefined && this.eval !== null; }
  get evalDisplay() { return this.eval === undefined || this.eval === null ? '—' : (this.eval() >= 0 ? '+' + this.eval : String(this.eval)); }


  get tooltip() {
    const d = this.positionAnalysis();
    return `White: ${this.formatPercent(d.whiteWinProbability)} • Draw: ${this.formatPercent(d.drawProbability)} • Black: ${this.formatPercent(d.blackWinProbability)}`;
  }


  /** Return normalized display probabilities */
  // display = computed(
  //   () => {
  //     // If user passed explicit probabilities (any one), use them after normalization
  //     // if ((this.whiteProb() ?? null) !== null || (this.drawProb() ?? null) !== null || (this.blackProb() ?? null) !== null) {
  //     const w = Math.max(0, this.p()?.white ?? 0);
  //     const d = Math.max(0, this.gameExplorer()?.draws ?? 0);
  //     const b = Math.max(0, this.gameExplorer()?.black ?? 0);
  //     const s = w + d + b || 1;
  //     return { white: w / s, draw: d / s, black: b / s };
  //     // }


  //     // Otherwise derive from eval
  //     const cp = Number(this.eval ?? 0);
  //     return this.deriveFromEval(cp);
  //   }
  // )



  /**
  * Heuristic to convert evaluation (centipawns) to three-way probabilities.
  * - Uses Elo/expected score model for white's expected score.
  * - Derives a draw probability that decays with magnitude of eval.
  * - Splits the remaining mass between white and black based on expected score.
  */
  private deriveFromEval(cp: number) {
    // 1) expected score for White from Elo formula (Elo scale ~400 cp)
    const expected = 1 / (1 + Math.pow(10, -(cp / 100) / 4));
    // Note: we used cp/100 to convert to comparable "Elo" difference roughly.


    // 2) draw base and decay with eval magnitude
    const baseDraw = 0.36; // empirical baseline draw rate for many human games
    // larger eval magnitude -> lower draw probability; scale factor chosen to drop off gradually
    const draw = baseDraw * Math.exp(-Math.abs(cp) / 600);


    // 3) split remaining probability mass for decisive results
    const decisiveMass = Math.max(0, 1 - draw);
    const whiteWin = decisiveMass * expected;
    const blackWin = decisiveMass * (1 - expected);


    // 4) normalize tiny rounding errors
    const sum = whiteWin + draw + blackWin;
    return {
      white: whiteWin / sum,
      draw: draw / sum,
      black: blackWin / sum
    };
  }
}
