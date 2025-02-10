### This backend server was built using a NodeJs and tested with Python. It hosts an instance of Stockfish that can be interacted with via POST requests.

### Access my server at https://expo-chess-back.onrender.com/uci or host your own using `npm run start`

### Requests
#### The server accepts the following requests:
##### "New" : to reset and start a new game.
##### "First" : to have Stockfish make the first move.
##### "End" : to send an end signal to Stockfish
##### "[From][To][Promotion Choice]": a 4-5 letter string that represents the original position followed by the ending position of the piece with an option 5th letter denoting the choice of promotion if the piece is a pawn reaching the end rows. 


##### The server will reply with a 4 letter string that represents the original position followed by the ending position for the best possible move. If best move exist (i.e. Checkmate), the server will respond with "none"

### Generator Files
#### generator.py can be run using `python3 generator.py`. The purpose of this file is to test the server response by mimicking 2 players represented by simpleTest.py and simpleTest2.py. Start by removing ` await send_command()` function calls until each file has one ` await send_command("New")` and one `await send_command("End")` call and simpleTest.py has an additonal `send_command("First")` immediately following the "New" function call. Then simply run generator.py to have each file repeated make requests to the server to ask for the best move for the opposing player. The best moves are appended to each file beforing the process repeats, thus simulating a match between Stockfish and itself.



