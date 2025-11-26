declare module 'stockfish.wasm' {
    export interface StockfishOptions {
        locateFile?: (file: string) => string;
    }
    export default function initStockfish(options?: StockfishOptions): any;
}