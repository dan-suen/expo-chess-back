import aiohttp
import asyncio
STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
async def send_command(command, append = False):
    async with aiohttp.ClientSession() as session:
        async with session.post(STOCKFISH_SERVER_URL, json={"command": command}) as response:
            result = await response.json()
            if (command == "New"):
                return
            elif (command == "End"):
                return
            elif (result["response"] == "none"):
                print("No more moves!")
                return 
            elif (result["response"] == "Game Already Over"):
                print("Game Already Over")
                return 
            else:    
                print(result["response"])
            return
        

async def main():
    await send_command("New")
    await send_command("e2e4p")
    await send_command("New")
    await send_command("e2e4q")
    await send_command("New")
    await send_command("e2e4t")
asyncio.run(main())
