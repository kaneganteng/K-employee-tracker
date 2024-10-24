import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';


await connectToDb();

type Department = { id: number, name: string };
// type Role = { id: number, title: string, salary: number, department: number };
// type Employee = { id: number, first_name: string, last_name: string, role_id: number, manager_id: number | null };

async function startCli() {
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update Employee Role',
            'Exit',
        ],
    });

    switch (answer.action) {
        case 'View All Departments':
            await viewAllDepartments();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'Add a Department':
            await addDepartment();
            break;
        case 'Add a Role':
            await addRoles();
            break;
        //   case 'Add an Employee':
        //     await addEmployee();
        //     break;
        //   case 'Update Employee Role':
        //     await updateEmployeeRole();
        //     break;
        default:
            await pool.end();
            process.exit();
    }
    startCli();
}

// view all departments
async function viewAllDepartments() {
    const query = 'SELECT id AS department_id, name AS department_name FROM department';
    const result = await pool.query(query);
    console.table(result.rows);
}
// view all employees
async function viewAllEmployees() {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN roles ON employee.role_id = roles.id
      LEFT JOIN department ON roles.department = department.id
      LEFT JOIN employee manager ON manager.id = employee.manager_id
    `;
    const result = await pool.query(query);
    console.table(result.rows);
}
// view all roles
async function viewAllRoles() {
    const query = `
    SELECT roles.id AS role_id, roles.title AS role_title, roles.salary AS role_salary, department.name AS department_name
    From roles
    LEFT JOIN department ON roles.department = department.id
    `;
    const result = await pool.query(query);
    console.table(result.rows);
};
// add a department
async function addDepartment() {
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'department_name',
        message: 'Enter name of new department:',
    });
    const query = 'INSERT INTO department (name) VALUES ($1)';
    await pool.query(query, [answer.department_name]);
    console.log('Department added successfully!');
}
// add a role
async function addRoles() {
    const existingDepartment = await pool.query('SELECT * FROM department');
    const departmentOptions = existingDepartment.rows.map(({ id, name }: Department) => ({
        name: name,
        value: id,
    }));
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'role_title',
            message: 'Enter name of new role:'
        },
        {
            type: 'input',
            name: 'role_salary',
            message: 'Enter salary of new role',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Choose the department for the new role',
            choices: departmentOptions,
        },
    ]);
    const query = 'INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)';
    await pool.query(query, [answer.role_title, answer.role_salary, answer.department_id]);
    console.log('New role has been added!');
}
startCli();