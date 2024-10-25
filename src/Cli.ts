import inquirer from 'inquirer';
import { connectToDb, pool } from './connection.js';
import { viewAllDepartments, viewAllRoles, viewAllEmployees } from './view.js';
import { addNewDepartment, addNewRole, addNewEmployee, updateEmployeeRole } from './manage.js';

await connectToDb();

async function startCli() {
    inquirer
        .prompt({
            type: 'list',
            name: 'whatYouCanDo',
            message: 'What would you like to do?',
            choices: [
                { name: 'View All Departments', value: viewAllDepartments },
                { name: 'View All Roles', value: viewAllRoles },
                { name: 'View All Employees', value: viewAllEmployees },
                { name: 'Add a Department', value: addNewDepartment },
                { name: 'Add a Role', value: addNewRole },
                { name: 'Add an Employee', value: addNewEmployee },
                { name: 'Update Employee Role', value: updateEmployeeRole },
                { name: 'Exit', value: exitProgram },
            ],
        })
        .then((answer) => answer.whatYouCanDo()) // list of actions
        .then(startCli) // start the inquirer
        .catch((error) => console.error(error)); // catch in case of error
}

async function exitProgram() {
    await pool.end();
    process.exit();
}

startCli();
