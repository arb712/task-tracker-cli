const {
    program
} = require("commander")
const fs = require("fs");
const {
    v4: uuidv4
} = require('uuid');
const moment = require("moment");
program
    .command("task:add")
    .summary("To add task to the list. For usage: node cli.js task:add -h")
    .description("This command line used to add task to the task list, the list will be created into JSON file in the folder task-list")
    .requiredOption("-t, --task_description <description>", "Task description")
    .requiredOption("-s, --status <status>", "Task status")
    .requiredOption("-f, --target_file <file_name>", "File name for task to save into")
    .action((options) => {
        console.log(options, "checkOptions")
        const checkTaskFolder = fs.readdirSync(`${__dirname}/task-list`);
        const filterFolderContents = checkTaskFolder.filter(data => data.endsWith("json"))
        // Check if json file with same name exists or not
        const checkFile = filterFolderContents.map(data => data.split(".")[0]).sort()
        let fileName = options.target_file;
        let targetData = {
            task: [],
        }

        // Validate file
        if (checkTaskFolder.length > 0 && checkFile.includes(fileName)) {
            console.log(checkFile, fileName, checkFile.includes(fileName), `${__dirname}/task-list/${fileName}.json`, "cheeekk")
            targetData = require(`./task-list/${fileName}.json`);
            if (!targetData.task || !Array.isArray(targetData.task))
                program.error("JSON file is not in the right format.")
        }

        const dataToPush = {
            id: uuidv4(),
            task_description: options.task_description,
            status: options.status,
            target_file: options.target_file,
            createdAt: moment(),
            updatedAt: moment(),
        }

        targetData.task.push(dataToPush)
        try {
            fs.writeFile(`${__dirname}/task-list/${fileName}.json`, JSON.stringify(targetData), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(`Successfully added task to ${fileName}`)
            });
        } catch (error) {
            program.error("Error while creating/modifying target file.", error, error.stack, error.message)
        }
    })
