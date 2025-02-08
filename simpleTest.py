import aiohttp
import asyncio

STOCKFISH_SERVER_URL = "http://localhost:5000/uci"

async def send_command(command):
    async with aiohttp.ClientSession() as session:
        async with session.post(STOCKFISH_SERVER_URL, json={"command": command}) as response:
            result = await response.json()  
            print("result: " + result["response"])
            return command, result  
async def main():
    await send_command("Start")
    await send_command("First")
    await send_command("End")
    await send_command("Start")
    await send_command(["e2e4"])
    await send_command("End")
    await send_command(["e2e4"])
    await send_command(["e7e5"])
    await send_command(["a1a8"])
    await send_command(["g1f3"])
    await send_command(["h9h1"])
    await send_command(["d7d5"])
    await send_command(["e3e9"])
    await send_command(["b1c3"])
    await send_command(["f8b4"])
    await send_command(["z2z4"])
    await send_command("New")
    await send_command(["e2e4"])
    await send_command("End")

asyncio.run(main())
