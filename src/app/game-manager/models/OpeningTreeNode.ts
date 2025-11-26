import { Signal, WritableSignal, computed, untracked } from "@angular/core";
import { Opening } from "./Opening";
import { NextMove } from "../controls/games-library/games-library";
import { Chess } from "chess.js";

export class OpeningTreeNode {
  private _children?: OpeningTreeNode[];
  openingsAtLevel: Opening[];

  constructor(
    readonly move: string | undefined,
    readonly openings: Opening[],
    readonly moveIndex: number,
    private currentOpening: WritableSignal<Opening | null>
  ) {
    // pre-filter to avoid recomputation
    this.openingsAtLevel = openings
      .filter(o => o.getMove(moveIndex)?.lan === move)
      .sort((a, b) => a.moves.length - b.moves.length);
  }

  /** Purely compute children once (lazy) */
  get children(): OpeningTreeNode[] {
    if (!this._children) {
      const nextMoveIndex = this.moveIndex + 1
      const nextMoves = Array.from(
        new Set(
          this.openingsAtLevel
            .map(o => o.getMove(nextMoveIndex)?.lan)
            .filter(Boolean)
        )
      );

      const nodes =
        nextMoves
          .map(
            move =>
              new OpeningTreeNode(move, this.openingsAtLevel, nextMoveIndex, this.currentOpening)
          )
          .sort((a, b) => a.openingsAtLevel.length > b.openingsAtLevel.length ? -1 : 1);

      this._children = nodes;
    }
    return this._children;
  }


  bookOpening(nextMove: NextMove): Opening {
    const chess = new Chess()
    chess.load(this.currentOpening()!.fen)
    chess.move(nextMove.san!)
    const result =
      this.openingsAtLevel
        .filter(
          s => s.fenPositions.filter(s => s == chess.fen()).length > 0
        )
        .sort((a, b) => a.moves.length < b.moves.length ? -1 : 1)[0]
    //console.log(moveNumber, result, chess.fen())
    return result
  }

  get flattenedChildren() {
    const result: OpeningTreeNode[] = [];
    const stack = [...this.children];

    while (stack.length) {
      const node = stack.pop()!;
      result.push(node);

      if (node.children.length > 0) {
        stack.push(...node.children);
      }
    }

    return result;
  }

  pgn = computed(() => {
    return this.mainLine?.pgn
  });

  isInTree: Signal<boolean> = computed(() => {
    const main = this.mainLine;
    const lastFen = main?.fenPositions.at(-1);
    if (lastFen === this.currentOpening()?.fen) return true;
    return untracked(() => this.children.some(c => c.isInTree()));
  });

  get mainLine(): Opening {
    return this.openingsAtLevel[0];
  }

  get pgnToDisplay(): string {
    return this.isLeaf ?
      this.getLeafPgn()
      : this.generatePgnString(this.moveIndex)
  };

  private generatePgnString = (moveIndex: number) => this.generateIndexForPgn(moveIndex) + this.generateSanForPgn(moveIndex)

  private getLeafPgn() {
    const isWhiteMove = this.moveIndex % 2 === 0;
    let result = isWhiteMove ? '' : '...'
    for (let i = this.moveIndex; i < this.openingsAtLevel[0].moves.length; i++) {
      result += this.generatePgnString(i) + " "
    }
    return result;
  }

  get isLeaf(): boolean {
    return this.openingsAtLevel.length == 1
  }

  displayDescription = computed(() =>
    this.mainLine.moves.length === this.moveIndex + 1 ||
    this.openingsAtLevel.length === 1
  );

  private generateSanForPgn(moveIndex: number) {
    const move = this.openingsAtLevel[0]?.getMove(moveIndex)!
    return move?.san ?? "";
  }

  private generateIndexForPgn(moveIndex: number) {
    const isWhiteMove = moveIndex % 2 === 0;
    const moveToWrite = (moveIndex / 2) + 1
    return isWhiteMove ?
      `${moveToWrite}. `
      : (this.isLeaf ? '' : '... ');
  }
}
