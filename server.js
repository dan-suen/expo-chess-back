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
  if (chess.isGameOver()){
    stockfish.stdin.write("stop\n");
    stockfish.stdout.removeAllListeners("data");
    return res.send({ response: "Game Already Over"});
  }
  // if(command === "f2f4"){
  //   console.log(chess.ascii())
  // }
  stockfish.stdin.write("uci\n");
  stockfish.stdin.write("isready\n");
  function waitForStockfishResponse() {
    return new Promise((resolve, reject) => {
      let result = "";
      let bestMoveFound = false;
      const dataListener = (data) => {

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
          // console.log(end)
          // if (end === "d4e2"){
          //   console.log("possible:", end.substring(0, 2))
          //   console.log("possible:", chess.moves({ square: end.substring(0, 2)}))
          //   console.log("secondhalf", end.substring(2))
    
          // }
          // console.log(chess.ascii())
          const startSquare = end.substring(0, 2); 
          const targetSquare = end.substring(2);  
          
       
          const moves = chess.moves({ square: startSquare });
          //console.log(moves)
          
          let validMove = "";
          if (moves.includes("O-O") || moves.includes("O-O-O")){
            validMove = "castling"
          } else {
            validMove = moves.some(move => move.includes(targetSquare));
            //console.log(validMove)
          }
          if (
            validMove
          ) {
            try {
              //console.log("trying castling: ", moves)
              chess.move(end, { sloppy: true });
              //console.log(chess.history())
              // console.log(end)
              stockfish.stdout.removeListener("data", dataListener);
              resolve();
            } catch (error) {
              stockfish.stdout.removeListener("data", dataListener);
              reject("Move not accepted 1 ");
            }
          } else {
            stockfish.stdout.removeListener("data", dataListener);
            reject("Move not accepted 2");
          }
        }
      };
      stockfish.stdout.on("data", dataListener);
    });
  }
  try {
    if (command === "End") {
      //console.log("here")
      stockfish.stdin.write("stop\n");
      //console.log(chess.history())
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


    // if(command === 'c4e2'){
    //     console.log(chess.history())
    //     console.log(command)
    //     console.log(chess.ascii())
    //     console.log(command.substring(0, 2))
    //     console.log(chess.moves({square: command.substring(0, 2)}))
    //     console.log(command.substring(2))
    //   }
      const inputMove = command.substring(2)
      const possibleMoves = chess.moves({square: command.substring(0, 2)})
      const matchingMoves = possibleMoves.filter(move => move.includes(inputMove));
    if (command === "First") {
      stockfish.stdin.write("position startpos\n");
      stockfish.stdin.write("go depth 5\n");
      //console.log("this is hit ")
    } else if (
      matchingMoves
    ) {
      // console.log(command[0].substring(0, 2))
      // console.log(command)
      // console.log(chess.ascii())
      // console.log(chess.history({verbose:true}))
      //console.log(chess.turn())
      // console.log(chess.get(command[0].substring(0, 2)))
   
      try {
        //console.log("this is fen: " + chess.fen())
        // console.log(command)
        chess.move(command, { sloppy: true });
        //console.log("outer")
        stockfish.stdin.write(`position fen ${chess.fen()}\n`);
        stockfish.stdin.write("go depth 5\n");
      } catch {
        return res.status(400).send({ response: "Invalid move" });
      }
    } else {
      return res.status(400).send({ response: "Invalid move 1 " });
    }
    //console.log(chess.history())
    await waitForStockfishResponse();
    //console.log("closer")
    const lastmove = chess.history({ verbose: true })[chess.history().length-1]
    //console.log(lastmove)
    return res.send({ response: `${lastmove.from}${lastmove.to}`});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ response: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running on https://expo-chess-back.onrender.com`);
});
