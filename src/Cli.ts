import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';


await connectToDb();

type Department = { id: number, name: string };
type Role = { id: number, title: string, salary: number, department: number };
type Employee = { id: number | null, first_name: string, last_name: string, role_id: number, manager_id: number };

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
            await addNewDepartment();
            break;
        case 'Add a Role':
            await addNewRoles();
            break;
          case 'Add an Employee':
            await addNewEmployee();
            break;
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
async function addNewDepartment() {
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
async function addNewRoles() {
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

// add a new employee
async function addNewEmployee() {
    const existingRoles = await pool.query('SELECT * FROM roles');
    const rolesOptions = existingRoles.rows.map(({ id, title }: Role) => ({
        name: title,
        value: id,
    }));;
    const existingEmployee = await pool.query('SELECT * FROM employee');
    const managerOptions = existingEmployee.rows.map(({ id, first_name, last_name }: Employee)=> ({
        name: `${first_name} ${last_name}`,
        value: id,
    }));
    managerOptions.unshift({ name: 'None', value: null });

    const answer = await inquirer.prompt([
        {
            type:'input',
            name:'first_name',
            message:'Employee First Name:',
        },
        {
            type:'input',
            name:'last_name',
            message:'Employee Last Name:',
        },
        {
            type:'list',
            name:'role_id',
            message:'Role for the Employee:',
            choices: rolesOptions,
        },
        {
            type:'list',
            name:'manager_id',
            message:'Manager for the Employee:',
            choices: managerOptions,
        },
    ]);

    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]);
    console.log('Employee has been added to the list!');
}
startCli();