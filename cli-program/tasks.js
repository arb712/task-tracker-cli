const {
    program
} = require("commander")
const fs = require("fs");
const {
    v4: uuidv4
} = require('uuid');
const moment = require("moment");
const path = require('path');


const TaskStatus = require("../enums/TaskStatus");

const sortTaskByCreatedAt = (taskData) => {
    taskData.task.sort((a, b) => {
        const keyA = new Date(a.createdAt),
            keyB = new Date(b.createdAt);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    })

    return taskData;
}

const validateTaskStatus = (status, program) => {
    if(!TaskStatus.includes(status)){
        program.error("Status can be only pending, done or in-progress, please use one of the option.")
    }
}

program
    .command("task:add")
    .summary("To add task to the list. For usage: node cli.js task:add -h")
    .description("This command line used to add task to the task list, the list will be created into JSON file in the folder task-list")
    .requiredOption("-t, --task_description <description>", "Description for the task")
    .requiredOption("-s, --status <status>", "Status for the task")
    .requiredOption("-f, --target_file <file_name>", "File name for task to save into")
    .action((options) => {
        console.log(options, "checkOptions")
        const checkTaskFolder = fs.readdirSync(`${__dirname}/task-list`);
        const filterFolderContents = checkTaskFolder.filter(data => data.endsWith(".json"))
        // Check if json file with same name exists or not
        const checkFile = filterFolderContents.map(data => data.split(".")[0]).sort()
        let fileName = options.target_file;
        let targetData = {
            task: [],
        }

        // Validate file
        if (checkTaskFolder.length > 0 && checkFile.includes(fileName)) {
            targetData = require(`./task-list/${fileName}.json`);
            if (!targetData.task || !Array.isArray(targetData.task))
                program.error("JSON file is not in the right format.")
        }
        
        validateTaskStatus(options?.status, program);

        const dataToPush = {
            id: uuidv4(),
            task_description: options.task_description,
            status: options.status,
            target_file: options.target_file,
            createdAt: moment(),
            updatedAt: moment(),
        }

        targetData.task.push(dataToPush)
        // Sort data by created at
        targetData = sortTaskByCreatedAt(targetData);
        try {
            fs.writeFile(`${__dirname}/task-list/${fileName}.json`, JSON.stringify(targetData), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(`Successfully added task to ${fileName}`)
            });
        } catch (error) {
            program.error("Error while creating/modifying target file.", error, error.stack, error.message)
        }
    })

program
    .command("task:update")
    .summary("To add task to the list. For usage: node cli.js task:add -h")
    .description("This command line used to add task to the task list, the list will be created into JSON file in the folder task-list")
    .requiredOption("-i, --id <id>", "Id of the task")
    .option("-t, --task_description <description>", "Task description")
    .option("-s, --status <status>", "Task status")
    .requiredOption("-f, --target_file <file_name>", "File name for task to save into")
    .action((options) => {
        let targetFile = require(`./task-list/${options.target_file}.json`);
        if(!options?.task_description && !options?.status){
            program.error("Please fill up status or description to update the task.")
        }
        
        if(!targetFile){
            program.error("Unable to find target file.")
        }

        validateTaskStatus(options?.status, program);

        try {
            if(Array.isArray(targetFile.task) && targetFile.task.length > 0){
                targetFile.task = targetFile.task.map((data) => {
                    const taskDescription = !options?.task_description ? data?.task_description : options?.task_description,
                    status = !options?.status ? data?.status : options?.status;

                    if(data?.id === options?.id){
                        data.task_description = taskDescription;
                        data.status = status;
                        data.updatedAt = moment();
                    }

                    return data;
                })
                targetFile = sortTaskByCreatedAt(targetFile);

                fs.writeFile(`${__dirname}/task-list/${options.target_file}.json`, JSON.stringify(targetFile), function writeJSON(err) {
                    if (err) return console.log(err);
                    console.log(`Successffully updating task: '${options.target_file}' id: '${options.id}'`)
                });
            }
        } catch (error) {
            console.error(error.stack, error.message, error)
            program.error(`Error while updating task: ${options.target_file} id: ${options.id}`)
        }
    })

program
    .command("task:list")
    .summary("To add task to the list. For usage: node cli.js task:add -h")
    .description("This command line used to add task to the task list, the list will be created into JSON file in the folder task-list")
    .option("-a, --all", "Will list all of the list if flag included in the command, if not will search for details task.")
    .option("-s, --status <status>", "Will list the list of task based on the status")
    .option("-f, --target_file <file_name>", "Will list all of the specific task")
    .action((options) => {
        if(!options.all && !options.target_file){
            program.error("Must include either all status or specific file flag.")
        }

        if(options?.status){
            validateTaskStatus(options?.status)
        }

        if(options.target_file){
            let targetFile = require(`./task-list/${options.target_file}.json`);
            if(options?.status){
                targetFile.task = targetFile.task.filter(task => task.status === options?.status);
                console.info(`List task of ${options.target_file}:`)
                if(targetFile.task.length < 1){
                    console.info(`There is no data in this task with status ${options.status}`)
                    return;
                }
                console.table(targetFile.task)
                return;
            }

            console.info(`List task of ${options.target_file}:`)
            console.table(targetFile.task)
            return;
        }
        const combinedTask = {};
        const folderPath = `${__dirname}/task-list`;
        if(options.all && !options.target_file){
            try {
                const allFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".json"));
                allFiles.forEach(file => {
                    try {
                     // Read file content
                     const filePath = path.join(folderPath, file)
                     const data = fs.readFileSync(filePath, 'utf-8');
                     const jsonData = JSON.parse(data);
                     
                     const fileName = path.basename(file, ".json");
                     combinedTask[fileName] = options?.status ? jsonData.task.filter(task => task.status === options.status) : jsonData.task || [];
                    } catch (error) {
                     console.error(error, error.messsage, error.stack);
                     program.error(`Error while reading file ${file}`)
                    }
                })

                const isAllEmpty = Object.values(combinedTask).every(data => data.length < 1);
                if(isAllEmpty){
                    console.info(`There is no data in this task with status ${options.status}`)
                    return;
                }

                Object.entries(combinedTask).forEach(([fileName, tasks]) => {
                    console.info(`List task of ${fileName}:`)
                    console.table(tasks)
                })
                return combinedTask;
            } catch (error) {
                console.error(error, error.message, error.stack)
                program.error("Error while reading directory");
            }
        }
    })
