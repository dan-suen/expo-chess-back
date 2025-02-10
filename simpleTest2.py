import aiohttp
import asyncio
import sys

# STOCKFISH_SERVER_URL = "https://expo-chess-back.onrender.com/uci"
STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
file_path = 'simpleTest.py'
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
                sys.exit(1)
                return 
            elif (result["response"] == "Game Already Over"):
                print("Game Already Over")
                sys.exit(1) 
                return 
            else:    
                append_to_second_last_line(file_path, result["response"], command, append)
            # print(command)
            # print(result)
            return
def append_to_second_last_line(file_path, response, command, append = False, ):
    # return
    if append:
        with open(file_path, 'r') as file:
            lines = file.readlines()
            current = "" if command == "First" else lines[-3][24:-18]
            # print(current)
            # print(response)
            if(current == response):
                sys.exit(1) 
                print("Line is already there")
                return
            croppedcontent = f'    await send_command("{current}")\n'
            # print(croppedcontent)
            if current:
                lines[-3] = croppedcontent
            lines.insert(-2, f'    await send_command("{response}", append = True)\n')
            with open(file_path, 'w') as file:
                file.writelines(lines)
async def main():
    await send_command("New") #Do not remove
    # await send_command("First", append = True) #Uncomment and call generator file to start move generation
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
    await send_command("f2f4")
    await send_command("b3b4")
    await send_command("d1d2")
    await send_command("g2g3")
    await send_command("g1g2")
    await send_command("e1h1")
    await send_command("h1h4")
    await send_command("e3g5")
    await send_command("g5e3")
    await send_command("d2f2")
    await send_command("h4f4")
    await send_command("f4f5")
    await send_command("f5f2")
    await send_command("e3g5")
    await send_command("g5d8")
    await send_command("d8f6")
    await send_command("f6d8")
    await send_command("d8f6")
    await send_command("f6d8", append = True)
    await send_command("End") #Do not remove
asyncio.run(main())
