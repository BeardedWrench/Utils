# Description
Should compare the keys in two JSON files and return a new file containing the differences marked by line number

### Usage
`go run main.go file1.json file2.json`



### Examples
**test1.json**
```JSON
{
    "name": "bob",
    "family": {
        "father": "joe",
        "mother": "susan"
    },
    "familyName": "robert",
    "age": 40
}
```
**test2.json**
```JSON
{
    "name": "bob",
    "username": "bobsurUncle",
    "family": {
        "father": "joe",
        "mother": "susan",
        "sister": "jane",
        "other":{
            "aunt": "jill"
        }
    }
}
```

> [!NOTE]  
> If the differences found are greater than 20, this will create a txt file containing the differences
> otherwise it will just print the differences into your terminal

**Output:**

**test1-test2-differences-2023-11-03_00-46-18.txt**
```
____________
| test1.json |
|---------------------|
| line | difference   |
|---------------------|
|    7 | "familyName"  
|---------------------|
|    8 | "age"         
|---------------------|

____________
| test2.json |
|---------------------|
| line | difference   |
|---------------------|
|    3 | "username"    
|---------------------|
|    7 | "sister"      
|---------------------|
|    8 | "other"       
|---------------------|
|    9 | "aunt"        
|---------------------|


```
