import os
import sys

#enter the full directory path in pathHeader, use double \\'s
pathHeader = "I:\\REG\\htdocs_REG\\portfolio\\scripts\\"
triggers = ["$servername =", "$username =", "$password =", "$dbname ="]

myFiles = os.listdir(pathHeader)

for file in myFiles:

    newFile = []
    count = 1
    if ".php" in file:
        with open(file, "rt") as f:
            for line in f:
                if any(word in line for word in triggers):
                    
                    temp = line.split("=")
                    newFile.append(temp[0] + "= \"\";\n")

                else:
                    newFile.append(line)

                count += 1

        with open(file, "wt") as f:
            f.writelines(newFile)
        
