import { Injectable, signal, WritableSignal } from '@angular/core';
import { COLORS } from '../chessboard/COLORS';

export interface EvaluationResult {
  cp: number;      // centipawn evaluation, positive = white better
  mate: number;    // mate in N moves
  bestMove: WritableSignal<string>;
  whiteWinProbability: number
  blackWinProbability: number
  drawProbability: number
}

@Injectable({ providedIn: 'root' })
export class StockfishService {
  private engine!: Worker;
  result: WritableSignal<EvaluationResult> = signal({
    bestMove: signal(''),
    blackWinProbability: 0,
    whiteWinProbability: 0,
    drawProbability: 1000,
    mate: 0,
    cp: 0
  });

  private stockfishMessageHandler = (message: any) => {
    console.log("Stockfish message:", message);
    const line = message.data as string

    if (line.startsWith('info depth')) {
      const currentTurn = this.currentTurn();

      if (line.includes('score cp')) {
        const match = line.match(/score cp (-?\d+)/);
        if (match) {

          function lichessWinProbability(cp: number) {
            return 1 / (1 + Math.exp(-0.004 * cp));
          }
          let cp = parseInt(match[1]);
          this.result().cp = currentTurn == 'w' ? cp / 100 : -cp / 100;
          const winProb = lichessWinProbability(this.result().cp);
          // console.log(`Eval: ${this.result().cp} → Win probability: ${(winProb * 100).toFixed(1)}%`);
        }
      }

      const scoreMatch = line.match(/(nodes|mate|wdl) (-?\d+) /);
      if (scoreMatch) {
        const type = scoreMatch[1];

        switch (type) {
          case 'mate':
            this.result().mate = parseInt(scoreMatch[2]);
            break
          case 'wdl':
            const fromWdl = line.split('wdl')[1]
            const value = fromWdl.split(' ')
            // console.log('wdl values:', value);
            this.result().whiteWinProbability = (currentTurn == 'w' ? parseInt(value[1]) : parseInt(value[3]));
            this.result().drawProbability = parseInt(value[2]);
            this.result().blackWinProbability = (currentTurn == 'w' ? parseInt(value[3]) : parseInt(value[1]));
            // console.log(`WDL → White: ${this.result().whiteWinProbability}, Draw: ${this.result().drawProbability}, Black: ${this.result().blackWinProbability}`);
            break
        }


      }
    }

    // Capture best move
    if (line.startsWith('bestmove')) {
      //console.log(line, "for " + this.currentTurn())
      const bestMove = line.split(' ')[1];
      if (this.result().bestMove() != bestMove)
        this.result().bestMove.set(bestMove);
    }

    this.result.set({ ...this.result() });
  }

  currentTurn = signal<COLORS>('w');

  constructor() {
    // this.engine = new Worker('assets/stockfish/src/stockfish-17.1-8e4d048.js', { type: 'module' });
    this.engine = new Worker('assets/stockfish/src/stockfish-17.1-lite-single-03e3232.js', { type: 'module' });   
    //single thread for now
    this.engine.postMessage('Threads 1');
    this.engine.onmessage = this.stockfishMessageHandler;
    this.engine.postMessage("setoption name UCI_ShowWDL value true")
    this.engine.postMessage('ucinewgame');
  }



  setPosition(fen: string) {
    this.engine.postMessage(`position fen ${fen}`);
  }

  go(depth: number = 12) {
    this.engine.postMessage(`go depth ${depth}`);
  }
}
