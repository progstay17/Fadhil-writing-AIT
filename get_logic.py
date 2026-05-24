import sys

content = open("src/app/page.tsx", "r").read()
parts = content.split("return (")
if len(parts) > 1:
    # Get everything before the last return ( which is usually the main component return
    logic = "return (".join(parts[:-1])
    print(logic)
else:
    print("Error: Could not split by return (")
