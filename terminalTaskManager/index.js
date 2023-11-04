#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { program } from 'commander';

const tasksDirectory = './tasks';
const archiveDirectory = path.join(tasksDirectory, 'archive');
const tasksFile = path.join(tasksDirectory, 'tasks.json');

if (!fs.existsSync(tasksDirectory)) {
  fs.mkdirSync(tasksDirectory, { recursive: true });
}
if (!fs.existsSync(archiveDirectory)) {
  fs.mkdirSync(archiveDirectory, { recursive: true });
}

if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, JSON.stringify({ tasks: [] }, null, 2));
}

const loadTasks = () => {
  const content = fs.readFileSync(tasksFile, 'utf8');
  return JSON.parse(content).tasks;
};

const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFile, JSON.stringify({ tasks: tasks }, null, 2));
};

const getTimestamp = () => new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' });

const archiveTasks = (filename) => {
  const timestamp = getTimestamp();
  const archiveFilename = `tasks-${new Date().toISOString()}.json`;
  const archiveFilePath = path.join(archiveDirectory, archiveFilename);

  const tasksToArchive = loadTasks();

  fs.writeFileSync(archiveFilePath, JSON.stringify({
    archivedOn: timestamp,
    tasks: tasksToArchive
  }, null, 2));

  if (!filename) {
    saveTasks([]);
  }

  console.log(chalk.magentaBright(`Tasks archived to ${archiveFilename}`));
};

program
  .command('list')
  .description('List all tasks')
  .action(() => {
    const tasks = loadTasks();
    tasks.forEach((task, index) => {
      console.log(`${index + 1}: ${chalk[task.status === 'TODO' ? 'yellow' : 'greenBright'](task.status)} - ${task.description}`);
    });
    if (tasks.length === 0) console.log(chalk.yellow('No tasks to list.'));
  });

program
  .command('add <taskDescription>')
  .description('Add a new task - (Description should be wrapped in quotes.)')
  .action((taskDescription) => {
    const tasks = loadTasks();
    tasks.push({ id: tasks.length + 1, description: taskDescription, status: 'TODO' });
    saveTasks(tasks);
    console.log(chalk.greenBright('Task added successfully!'));
  });

program
  .command('complete <taskId>')
  .description('Mark a task as complete')
  .action((taskId) => {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id.toString() === taskId);
    if (task) {
      task.status = 'COMPLETE';
      saveTasks(tasks);
      console.log(chalk.greenBright(`Task ${taskId} marked as complete`));
      if (tasks.every(task => task.status === 'COMPLETE')) {
        archiveTasks();
      }
    } else {
      console.log(chalk.red(`Task with id ${taskId} not found.`));
    }
  });

program
  .command('save')
  .description('Archive all tasks and start with a new list')
  .action(() => {
    archiveTasks();
  });

program
  .command('archive')
  .description('List all archived task files with index')
  .action(() => {
    const files = fs.readdirSync(archiveDirectory).filter(file => file.startsWith('tasks-') && file.endsWith('.json'));
    if (files.length === 0) {
      console.log(chalk.yellow('No archived tasks files.'));
    } else {
      console.log(chalk.red('Command: task view <index>'));
      console.log(chalk.blueBright('Archived Tasks Files:'));
      files.forEach((file, index) => {
        console.log(chalk.greenBright(index) + ':' + chalk.magentaBright(file));
      });
    }
  });

program
  .command('view <fileIndex>')
  .description('View tasks from an archived file using index')
  .action((fileIndex) => {
    const files = fs.readdirSync(archiveDirectory).filter(file => file.startsWith('tasks-') && file.endsWith('.json'));
    const chosenFile = files[fileIndex];
    if (chosenFile) {
      const archiveFilePath = path.join(archiveDirectory, chosenFile);
      const archivedContent = fs.readFileSync(archiveFilePath, 'utf8');
      const tasks = JSON.parse(archivedContent).tasks;
      const archiveDate = JSON.parse(archivedContent).archivedOn;
      console.log(chalk.red(`Archived On ${archiveDate}`));
      console.log(chalk.blueBright(`Tasks from ${chosenFile}:`));

      tasks.forEach((task, index) => {
        console.log(chalk.magentaBright(`${index + 1}: ${task.status} - ${task.description}`))
      })
    } else {
      console.log(chalk.red(`Archived file with index ${fileIndex} does not exist.`));
    }
  });

program.parse();
