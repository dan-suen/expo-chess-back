const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 5000;
const cors = require("cors");
const { Chess } = require("chess.js");

const corsOptions = {
  origin: "*",
  methods: "POST",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

app.use(express.json());
const chess = new Chess();

// const chessData = {
//   boardState: chess.board(),
//   gameOver: chess.isGameOver(),
//   history: chess.history({ verbose: true }),
//   check: chess.isCheck(),
//   checkmate: chess.isCheckmate(),
//   draw: chess.isDraw(),
//   stalemate: chess.isStalemate(),
//   threepeat: chess.isThreefoldRepetition(),
//   material: chess.isInsufficientMaterial(),
// };
let stockfish;
function startStockfish() {
  stockfish = spawn("./assets/stockfish-ubuntu-x86-64-avx2");
}
if (!stockfish) {
  startStockfish();
}

let counter = 0;
app.post("/uci", async (req, res) => {
  const { command } = req.body;
  stockfish.stdin.write("uci\n");
  stockfish.stdin.write("isready\n");
  function waitForStockfishResponse() {
    return new Promise((resolve, reject) => {
      let result = "";
      let bestMoveFound = false;
      stockfish.stdout.on("data", (data) => {
        //console.log("no ")
        //console.log("hit this")
        // console.log(stockfish.stdout)
        // counter++
        // console.log(counter);
        result = data.toString();
        //console.log(result);
        //counter ++;
        //console.log(`${counter} ${!bestMoveFound} ${result.includes("bestmove")}`);

        if (!bestMoveFound && result.includes("bestmove")) {
          let index = result.indexOf("bestmove");
          let end = result.slice(index + 9, index + 13);
          bestMoveFound = true;
          // if (end === "e7e5"){
          //   console.log(result)
          // }
          // console.log(chess.ascii())
          // console.log(chess.turn())
          // console.log("possible:", end.substring(0, 2))
          // console.log("possible:", chess.moves({ square: end.substring(0, 2)}))
          // console.log("secondhalf", end.substring(2))
          const startSquare = end.substring(0, 2); 
          const targetSquare = end.substring(2);  
          
       
          const moves = chess.moves({ square: startSquare });
          
          
          const validMove = moves.some(move => move.slice(-2) === targetSquare);
          if (
            validMove
          ) {
            try {
              chess.move(end, { sloppy: true });
              console.log(end)
              resolve();
            } catch (error) {
              reject("Move not accepted 1 ");
            }
          } else {
            reject("Move not accepted 2");
          }
        }
      });
    });
  }
  try {
    //console.log("byer")
    if (command === "End") {
      //console.log("here")
      stockfish.stdin.write("stop\n");
      chess.reset();
      stockfish.stdout.removeAllListeners("data");
      return res.send({ response: "Connection terminated" });
    } 
    if (command === "New") {
      stockfish.stdin.write("ucinewgame\n");
      stockfish.stdin.write("isready\n");
      chess.reset();
      return res.send({ response: "Stockfish reset." });
    } 
    if (command === "First") {
      stockfish.stdin.write("position startpos\n");
      stockfish.stdin.write("go depth 5\n");
    }
    // console.log(command[0].substring(0, 2))
    // console.log(moves)
    // console.log(command)
    // console.log(chess.moves({square: command.substring(0, 2)}))
    // console.log(command.substring(2))
    // console.log(chess.ascii())
    // console.log(chess.history({verbose:true}))
    // console.log(chess.turn())
    // console.log(chess.get(command[0].substring(0, 2)))
    if (
      chess
      .moves({ square: command.substring(0, 2) })
      .includes(command.substring(2))
    ) {
      try {
        chess.move(command, { sloppy: true });
        //console.log("outer")
        stockfish.stdin.write(`position fen ${chess.fen()}\n`);
        stockfish.stdin.write("go depth 5\n");
      } catch {
        return res.status(400).send({ response: "Invalid move" });
      }
    } else {
      return res.status(400).send({ response: "Unavaliable Move" });
    }
    await waitForStockfishResponse();
    //console.log("closer")
    const lastmove = chess.history({ verbose: true })[chess.history().length-1]
    return res.send({ response: `${lastmove.from}${lastmove.to}`});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ response: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running on https://expo-chess-back.onrender.com`);
});
