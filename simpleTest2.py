import aiohttp
import asyncio

# STOCKFISH_SERVER_URL = "https://expo-chess-back.onrender.com/uci"
STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
async def send_command(command):
    async with aiohttp.ClientSession() as session:
        async with session.post(STOCKFISH_SERVER_URL, json={"command": command}) as response:
            result = await response.json()  
            print(command)
            print(result)
            return
async def main():
    await send_command("New")
    await send_command("e2e4")
    await send_command("g1f3")
    await send_command("f1c4")
    await send_command("End")

asyncio.run(main())
