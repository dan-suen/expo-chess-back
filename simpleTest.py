import aiohttp
import asyncio

STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
async def send_command(command):
    async with aiohttp.ClientSession() as session:
        async with session.post(STOCKFISH_SERVER_URL, json={"command": command}) as response:
            print(f"\n>>> Sent: {command}")
            result = await response.json()  # Await the JSON response asynchronously
            print(result)

# Run the commands
async def main():
    await send_command("Start")
    await send_command("First")
    await send_command(["e2e4"])

    moves_list = [
        "e2e4",  
        "e7e5",  
        "a1a8",  
        "g1f3",  
        "h9h1",  
        "d7d5",  
        "e3e9",  
        "b1c3",  
        "f8b4",  
        "z2z4" 
    ]

    for move in moves_list:
        await send_command([f"{move}"])

    await send_command("End")

# Run the main async function
asyncio.run(main())