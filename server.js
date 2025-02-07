const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 5000;

app.use(express.json());

const stockfish = spawn('./stockfish-windows-x86-64-avx2.exe');

stockfish.stdin.write('uci\n');

app.post('/uci', (req, res) => {
  const { command } = req.body;
  stockfish.stdin.write(command + '\n');
  let output = '';

  stockfish.stdout.on('data', (data) => {
    output += data.toString();
  });

  stockfish.stdout.on('end', () => {
    res.send({ response: output });
  });
});

app.listen(port, () => {
  console.log(`Server running on https://gusty-knowledgeable-lobster.glitch.me/`);
});
