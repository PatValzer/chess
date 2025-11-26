import { Chess, Move } from "chess.js";




export class Opening {

    // e.g. "1. e4 e5 2. Nf3 Nc6 3. Bb5"
    // uci: string;  // e.g. "e2e4 e7e5 g1f3 b8c6 f1b5"
    fen: string;  // FEN position after the sequence

    fenPositions: string[] = []
    moves: Move[] = []


    constructor(
        public eco: string,
        public name: string,
        public pgn: string) {
        const chess = new Chess()
        chess.loadPgn(pgn)
        this.fen = chess.fen()
        chess.history({ verbose: true }).forEach(
            move => {
                this.moves.push(move)
                this.fenPositions.push(move.after)

            }
        )

    }

    getMove(index: number) {
        return this.moves.at(index)
    }

}
