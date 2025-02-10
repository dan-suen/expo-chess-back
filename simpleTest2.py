import aiohttp
import asyncio

# STOCKFISH_SERVER_URL = "https://expo-chess-back.onrender.com/uci"
STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
file_path = 'simpleTest.py'
async def send_command(command, append = False):
    async with aiohttp.ClientSession() as session:
        async with session.post(STOCKFISH_SERVER_URL, json={"command": command}) as response:
            result = await response.json()  
            if (result["response"] == "none"):
                return print("No more moves!")
            else:    
                append_to_second_last_line(file_path, result["response"], append)
            print(command)
            print(result)
            return
def append_to_second_last_line(file_path, command, append = False):
    # return
    if append:
        with open(file_path, 'r') as file:
            #croppedcontent = f'    await send_command("d7e5")\n' #initial
            croppedcontent = f'    await send_command("d7e5")\n'
            lines = file.readlines()
            prev = croppedcontent[24:-3]
            print(prev)
            print(command)
            lines[-3] = croppedcontent
            lines.insert(-2, f'    await send_command("{command}", append = True)\n')
            lines[23] = f"            croppedcontent = f'    await send_command(\"{command}\")\\n'\n"
            with open(file_path, 'w') as file:
                file.writelines(lines)
async def main():
    await send_command("New")
    await send_command("e2e4")
    await send_command("g1f3")
    await send_command("f1c4")
    await send_command("e1g1")
    await send_command("f1e1")
    await send_command("c4e2")
    await send_command("d1e2")
    await send_command("d2d4")
    await send_command("e2f3")
    await send_command("a2a3")
    await send_command("b2b3")
    await send_command("c1b2")
    await send_command("b1d2")
    await send_command("d2c4")
    await send_command("h2h3")
    await send_command("c2c3")
    await send_command("c3d4")
    await send_command("a1d1")
    await send_command("c4a5")
    await send_command("b2c1")
    await send_command("c1d2")
    await send_command("f3e3")
    await send_command("f2f4", append = True)
    await send_command("End")
asyncio.run(main())
