import os
import sys

#enter the full directory path in pathHeader, use double \\'s
pathHeader = "C:\\EXAMPLE\\portfolio\\"
triggers = ["$servername =", "$username =", "$password =", "$dbname ="]

#enter your database credentials below, corresponding to the triggers
credentials = ["", "", "", ""]

myFiles = os.listdir(pathHeader)

for file in myFiles:

    newFile = []
    if ".php" in file:
        with open(file, "rt") as f:
            for line in f:
                if any(word in line for word in triggers):
                    for word in triggers:
                        if word in line:
                            temp = line.split("=")
                            newFile.append("{}= \"{}\";\n".format(
                                temp[0], credentials[triggers.index(word)]))

                else:
                    newFile.append(line)

        with open(file, "wt") as f:
            f.writelines(newFile)
        
