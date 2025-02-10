import aiohttp
import asyncio

# STOCKFISH_SERVER_URL = "https://expo-chess-back.onrender.com/uci"
STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
file_path = 'simpleTest2.py'
croppedcontent = f'\tawait send_command("a8c8")\n'
async def send_command(command, append = False):
    async with aiohttp.ClientSession() as session:
        async with session.post(STOCKFISH_SERVER_URL, json={"command": command}) as response:
            result = await response.json()  
            if (result["response"] == "none"):
                return print("No more moves!")
            else:    
                append_to_second_last_line(file_path, result["response"], append)
            return
def append_to_second_last_line(file_path, command, append = False):
    if append:
        with open(file_path, 'r') as file:
            lines = file.readlines()
            lines[-3] = croppedcontent
            lines.insert(-2, f"\tawait send_command({command}, append = True)\n")
            croppedcontent = f'\tawait send_command({command})\n'
            with open(file_path, 'w') as file:
                file.writelines(lines)
async def main():
    await send_command("New")
    await send_command("First")
    await send_command("e7e5")
    await send_command("b8c6")
    await send_command("d7d6")
    await send_command("c8g4")
    await send_command("c6d4")
    await send_command("d4e2")
    await send_command("g8f6")
    await send_command("g4f3")
    await send_command("e5d4")
    await send_command("f6d7")
    await send_command("f8e7")
    await send_command("e7f6")
    await send_command("f6e5")
    await send_command("d8h4")
    await send_command("c7c5")
    await send_command("e8g8")
    await send_command("c5d4")
    await send_command("b7b5")
    await send_command("d4d3")
    await send_command("e5c3")
    await send_command("d7e5")
    await send_command("a8c8", append = True)
    await send_command("End")
asyncio.run(main())
