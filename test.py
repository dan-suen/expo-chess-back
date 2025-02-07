import chess
import chess.engine

STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
stockfish_path = "./assets/stockfish-ubuntu-x86-64-avx2"

board = chess.Board()
print(board)
print(chess)
def is_valid_move(move, board):
    # try:
    #     chess_move = chess.Move.from_uci(move)
    # except:
    #     return False

    # if chess_move not in board.legal_moves:
    #     return False

    # if (board.turn == chess.WHITE and chess_move.from_square // 8 != 6):
    #     return False  
    
    # if (board.turn == chess.BLACK and chess_move.from_square // 8 != 1):
    #     return False  
    return True

engine.quit()