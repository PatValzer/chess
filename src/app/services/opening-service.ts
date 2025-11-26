import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import LZString from 'lz-string';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Opening } from '../game-manager/models/Opening';
import { OpeningTreeNode } from '../game-manager/models/OpeningTreeNode';
import { NextMove } from '../game-manager/controls/games-library/games-library';

export class FenPositionWithOpening {
  fenPosition: string = ''
  openings: Opening[] = []
}

@Injectable({
  providedIn: 'root',
})
export class OpeningService {

  openings = signal<Opening[]>([])
  private http = inject(HttpClient)
  private url = 'assets/openings/lichess-openings.tsv';
  private rawOpeningFile = toSignal(this.http.get(this.url, { responseType: 'text' }));

  openingTree = computed<OpeningTreeNode[]>(
    () => {
      const openings: OpeningTreeNode[] = this.getOpeningTree()
      return openings
    }
  )

  selectedOpeningTree = computed<OpeningTreeNode[]>(
    () => {
      const currentOpeningPgn = this.currentOpening()?.pgn
      const openingTree = this.openingTree()
      const flattenedNodes = openingTree.flatMap(s => s.flattenedChildren)
      const result = openingTree.filter(
        s => s.pgn() == currentOpeningPgn
      )

      // .concat(flattenedNodes.filter(s=> s.pgn() == this.currentOpening()?.pgn ))
      // console.log(flattenedNodes.map(s => s.pgn()))
      // console.log(flattenedNodes.filter(s => s.pgn() == currentOpeningPgn))
      // console.log(currentOpeningPgn)
      // console.log(result)
      return [...result, ...flattenedNodes.filter(s => s.pgn() == currentOpeningPgn)]
    }
  )

  private fenPositionsWithOpening = computed(
    () => {
      const fenPositions: FenPositionWithOpening[] = []

      this.openings().forEach(
        (opening) => {
          opening.fenPositions.forEach(
            (fenPosition) => {
              let fenPositionToAddOrUpdate = fenPositions.find(s => s.fenPosition == fenPosition)

              if (!fenPositionToAddOrUpdate) {
                fenPositionToAddOrUpdate = new FenPositionWithOpening()
                fenPositionToAddOrUpdate.fenPosition = fenPosition
                fenPositions.push(fenPositionToAddOrUpdate)
              }

              fenPositionToAddOrUpdate.openings.push(opening)
            }
          )
        }
      )

      return fenPositions
    }
  )

  currentOpening: WritableSignal<Opening | null> = signal(null)

  bookOpening(fen: string): Opening | null {
    const fenPositionWithOpening = this.fenPositionsWithOpening()
    return fenPositionWithOpening.find(s => s.fenPosition == fen)?.openings
      .sort((a, b) => a.moves.length > b.moves.length ? 1 : -1)[0] ?? null
  }

  // currentOpeningFen = signal("")

  private getOpeningTree(): OpeningTreeNode[] {
    const openingTrees: OpeningTreeNode[] = [];
    const index = 0;
    const treeFirstLevel = Array.from(
      new Set(
        this.openings().map(
          s => s.getMove(index)?.lan
        )
      )
    );

    //     ["d2d3"]
    treeFirstLevel.forEach(
      move => {
        const openingTree = new OpeningTreeNode(move, this.openings(), index, this.currentOpening);
        openingTrees.push(openingTree);
      }
    );

    const result = openingTrees.sort((a, b) => a.openingsAtLevel.length > b.openingsAtLevel.length ? -1 : 1);

    return result
  }


  private openingFileLoaded = effect(
    () => {
      if (localStorage.getItem("openings") != null) {
        const openings: Opening[] = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("openings") ?? ""));
        this.openings.set(openings.map(o => new Opening(o.eco, o.name, o.pgn)))
      }
      else {
        const raw = this.rawOpeningFile()
        if (raw) {
          const lines = raw.split('\n');
          // const headers = lines[0].split('\t');
          const data = lines.slice(1).map(
            line => {
              const values = line.split('\t');
              const opening = new Opening(values[0], values[1], values[2])
              return opening;
            }
          )

          const compressed = LZString.compressToUTF16(JSON.stringify(data))
          localStorage.setItem("openings", compressed)
          this.openings.set(data);
          // console.log(this.gameManagerService.openings())
          console.log(`✅ Loaded ${data.length} openings from TSV`);
        }
      }
    }
  )


}
