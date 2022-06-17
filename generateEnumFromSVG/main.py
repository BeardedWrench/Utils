import os

files = os.listdir('.')

fileNames = []

for image in files:
    if image.endswith('.svg'):
        imageValue = image[:-4]
        imageKey = imageValue.upper().replace('-', '_')
        fileNames.append(imageKey + ' = ' + '\'' + imageValue +  '\',\n')

fileNames.insert(0, '{' + '\n')
fileNames.append('}')      

f = open("enum.txt", "w")
f.writelines(fileNames)
f.close()