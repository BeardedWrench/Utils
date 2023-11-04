## Description
A simple task manager / todo list for your terminal.

### Installation
- Clone this Repo
- Navigate to the projects folder.
- run `npm install`
- On `UNIX` based systems, once inside the folder execute `chmod +x index.js` to make the file executable
- run `npm link`
- Profit. begin using the app inside your terminal.

### Commands
```
Usage: task [command]

Options:
  -h, --help             display help for command

Commands:
  list                   List all tasks
  add <taskDescription>  Add a new task
  complete <taskId>      Mark a task as complete
  save                   Archive all tasks and start with a new list
  archive                List all archived task files
  view <fileIndex>       View tasks from an archived file using the index
  help [command]         display help for command
```