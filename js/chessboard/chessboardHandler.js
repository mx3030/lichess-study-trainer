import { Chessground } from 'https://cdn.jsdelivr.net/npm/chessground@9.1.1/+esm'

export class ChessboardHandler {
    constructor(boardEl) {
        this.chessboardElement = boardEl;
        this.chessboard = Chessground(boardEl, {
            movable : {
                color: 'white', // white starts
                free: false, // don't allow movement anywhere
            },
            viewOnly : false, 
        });
        window.addEventListener('resize',()=>this.redraw())
    }

    setStateFromChess(chess) {
        const color = chess.turn() == 'w' ? 'white' : 'black';
        const legalMoves = new Map();
        const moves = chess.moves({verbose: true});
        moves.forEach(m => {
            if (!legalMoves.has(m.from)) {
                legalMoves.set(m.from, []);
            }
            legalMoves.get(m.from).push(m.to);
        });
        const history = chess.history({verbose: true});
        const lastChessMove = history[history.length - 1];
        const lastMove = lastChessMove
        ? [lastChessMove.from, lastChessMove.to]
        : undefined;

        this.chessboard.set({
            check: chess.inCheck(),
            fen: chess.fen(),
            lastMove: lastMove,
            turnColor: color,
            movable: {
                color: color,
                dests: legalMoves
            }
        });
    }

    setState(state) {
        this.chessboard.set(state);
    }

    redraw() {
        this.removeDrawings();
        this.chessboard.redrawAll()
    }

    removeDrawings() {
        this.chessboard.setAutoShapes([])
    }

    setInitialPositionImmediately() {

    }

    setOrientationForColor(color) {

    }

    flashRightMove() {

    }

    flashWrongMove() {

    }

    flashFinishLine() {

    }

    removeClassName(className) {
        this.chessboardElement.classList.remove(className)
    }
}


