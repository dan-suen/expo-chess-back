import aiohttp
import asyncio
import sys

# STOCKFISH_SERVER_URL = "https://expo-chess-back.onrender.com/uci"
STOCKFISH_SERVER_URL = "http://localhost:5000/uci"
file_path = 'simpleTest2.py'
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
    await send_command("a8c8")
    await send_command("e5g6")
    await send_command("c3d2")
    await send_command("g6f4")
    await send_command("f4h3")
    await send_command("h4g4")
    await send_command("h3g5")
    await send_command("g4e6")
    await send_command("c8c2")
    await send_command("e6a2")
    await send_command("f8c8")
    await send_command("g7g5")
    await send_command("c2f2")
    await send_command("c8c2")
    await send_command("g8f8")
    await send_command("f8g7")
    await send_command("g7g8")
    await send_command("g8g7")
    await send_command("g7g8")
    await send_command("g8g7", append = True)
    await send_command("End") #Do not remove
asyncio.run(main())
