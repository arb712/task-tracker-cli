# Task Tracker CLI

A command-line interface (CLI) application built with Commander.js for managing tasks stored in JSON files.

## 📋 Overview

This CLI tool allows you to create, read, update, and delete tasks stored in JSON format. Each task is saved in a specified file within the `task-list` directory, with automatic sorting by creation date and proper data validation.

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/arb712/task-tracker-cli.git

# Navigate to project directory
cd task-tracker-cli

# Install dependencies
npm install

# Make the CLI globally available (optional)
npm link
```

## 📖 Usage

### Getting Started

```bash
# Show help menu
node cli.js --help

# Show help for specific command
node cli.js task:add --help
```

## 🔧 Available Commands
>Add a New Task
Command: node cli.js task:add

Adds a new task to the specified JSON file.

Options:

-t, --task_description <description> (Required): Task description

-s, --status <status> (Required): Task status (pending/done/in-progress)

-f, --target_file <file_name> (Required): Target JSON filename (without .json extension)

Example:

```bash
node cli.js task:add -t "Complete project documentation" -s "pending" -f "project-tasks"
```

>List Tasks
Command: node cli.js task:list

Lists tasks with various filtering options.

Options:

-a, --all: List all tasks from all files

-f, --target_file <file_name>: List tasks from specific file

-s, --status <status>: Filter tasks by status

-i, --id <id>: Search for specific task by ID (requires target_file)

Examples:

```bash
# List all tasks from all files
node cli.js task:list --all

# List tasks from specific file
node cli.js task:list -f "project-tasks"

# List pending tasks from specific file
node cli.js task:list -f "project-tasks" -s "pending"

# List specific task by ID
node cli.js task:list -f "project-tasks" -i "12345-abcde"
```

>Update an Existing Task
Command: node cli.js task:update

Updates an existing task by its ID.

Options:

-i, --id <id> (Required): Task ID to update

-f, --target_file <file_name> (Required): Target JSON filename

-t, --task_description <description> (Optional): New task description

-s, --status <status> (Optional): New task status

Example:

```bash
node cli.js task:update -i "12345-abcde" -f "project-tasks" -s "done"
```
>Remove Tasks
Command: node cli.js task:remove

Removes tasks or entire task files.

Options:

-a, --all: Remove entire task file (requires target_file)

-f, --target_file <file_name>: Target JSON filename

-i, --id <id>: Remove specific task by ID

-s, --status <status>: Remove all tasks with specific status

Examples:

```bash
# Remove entire task file
node cli.js task:remove -a -f "project-tasks"

# Remove specific task by ID
node cli.js task:remove -f "project-tasks" -i "12345-abcde"

# Remove tasks by status
node cli.js task:remove -f "project-tasks" -s "pending"

# Remove task matching both ID and status
node cli.js task:remove -f "project-tasks" -i "12345-abcde" -s "pending"