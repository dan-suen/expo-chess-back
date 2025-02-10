import subprocess

file1 = ["python3", "simpleTest.py"]
file2 = ["python3", "simpleTest2.py"]

while True:
    process1 = subprocess.run(file1)
    if process1.returncode != 0:
        print(f"file1.py terminated with error code {process1.returncode}. Stopping loop.")
        break

    process2 = subprocess.run(file2)
    if process2.returncode != 0:
        print(f"file2.py terminated with error code {process2.returncode}. Stopping loop.")
        break