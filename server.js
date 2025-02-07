const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 5000;
const { Chess } = require("chess.js");



app.use(express.json());

const stockfish = spawn("./assets/stockfish-ubuntu-x86-64-avx2");
const chess = new Chess();

let output = "";
let moves = [];
let first = true;

stockfish.stdout.on("data", (data) => {
  if (first){
    first = !first;
    return;
  }
  let result = data.toString();
  let end = result.slice(-5, -1)

  output = "";
  if (result.includes("readyok")) {
    return console.log("Stockfish is ready");
  }
  output += end;
  moves.push(end);
  if (chess.moves({square : end.substring(0, 1)}).includes(end.substring(2))){
    chess.move(end, { sloppy: true })
  } else {
    console.log("Move not accepted")
  }
  stockfish.stdout.write("");
});
stockfish.stdout.on("end", () => {
  console.log(moves)
});

app.post("/uci", (req, res) => {
  const { command } = req.body;
  if (command === "Start") {
    stockfish.stdin.write("uci\n");
    stockfish.stdin.write("isready\n");
  }
  if (command === "New") {
    stockfish.stdin.write("ucinewgame\n");
    stockfish.stdin.write("isready\n");
    chess.reset();
  }
  if (command === "End") {
    stockfish.stdin.destroy();
  }
  if (command === "First") {
    stockfish.stdin.write("go depth 5\n");
  }
  if (typeof command === "object") {
    if (chess.moves(command[0].substring(0, 1)).includes(command[0].substring(2))) {
      moves.push(command[0]);
      stockfish.stdin.write(`posi tion startpos moves ${moves.join(" ")}\n`);
      stockfish.stdin.write("go depth 5\n");
    } else {
      output = "invalid move";
    }
  }
  if (command === "Start") {
    res.send({ response: "Stockfish initialized." });
  } else {
    res.send({ response: output });
    output = "";
  }
});

app.listen(port, () => {
  console.log(`Server running on https://expo-chess-back.onrender.com`);
});


