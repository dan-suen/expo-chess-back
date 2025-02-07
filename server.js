const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 5000;

app.use(express.json());

const stockfish = spawn("./assets/stockfish-ubuntu-x86-64-avx2");

let output = "";

stockfish.stderr.on("data", (data) => {
  console.error("Error from Stockfish:", data.toString());
});

stockfish.stdout.on("data", (data) => {
  output= "";
  output += data.toString().slice(-5, -1);
  console.log("Received from Stockfish:", data.toString());

  if (data.toString().includes("readyok")) {
    console.log("Stockfish is ready");
  }

  if (data.toString().includes("bestmove")) {
    console.log("Best move received, sending response.");
    stockfish.stdout.removeAllListeners("data");
    stockfish.stdin.end();
  }
});

app.post("/uci", (req, res) => {
  const { command } = req.body;
  output = "";
  console.log("bye " + output)
  if (command === "Start") {
    stockfish.stdin.write("uci\n");
    stockfish.stdin.write("isready\n");
    stockfish.stdin.write("position startpos\n");
  }
  
  if (command === "End") {
    stockfish.stdin.end();
  }
  if (command === "First") {
    stockfish.stdin.write("go depth 1\n");
  }
  if (typeof command === "array") {
    stockfish.stdin.write(`moves ${command[0]}\n`);
    stockfish.stdin.write("go depth 1\n");
  }
  if (command === "Start") {
    res.send({ response: "Stockfish initialized." });
  } else {
    setTimeout(() => {
      res.send({ response: output });
      output = "";
    }, 100);
  }
});

app.listen(port, () => {
  console.log(`Server running on https://expo-chess-back.onrender.com`);
});
