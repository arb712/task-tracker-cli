const { program } = require("commander")
require("./cli-program/tasks")

program
  .name('my-cli')
  .description('A CLI application to track your task into JSON file.')
  .version('1.0.0');

program.parse();