const { Chess } = require('chess.js');

const chess = new Chess("8/P7/8/8/8/8/8/K6k w - - 0 1");
//const chess = new Chess("r1bqkbnr/pppp1ppp/8/4p3/2B5/5N2/PPPPPPPP/RNBQK2R w KQkq - 0 3")
console.log(chess.ascii())
console.log(chess.fen())
// const moves = chess.moves({ square: "a7" });
// console.log(moves)

// chess.move({ from: "a7", to: "a8", promotion: "n"})
// console.log(chess.ascii())

// const moves = chess.moves({ square: "a2" });
// console.log(moves)

// chess.move({ from: "a2", to: "a4", promotion: undefined})
// console.log(chess.ascii())
// const lastmove = chess.history({ verbose: true })[chess.history().length-1]
// console.log(lastmove.promotion)
