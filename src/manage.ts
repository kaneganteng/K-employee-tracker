import inquirer from 'inquirer';
import { pool } from './connection.js';
import { Department, Role, Employee } from './types.js';

// add a department
export async function addNewDepartment() {
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
export async function addNewRole() {
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
export async function addNewEmployee() {
    const existingRoles = await pool.query('SELECT * FROM roles');
    const rolesOptions = existingRoles.rows.map(({ id, title }: Role) => ({
        name: title,
        value: id,
    }));
    const existingEmployee = await pool.query('SELECT * FROM employee');
    const managerOptions = existingEmployee.rows.map(({ id, first_name, last_name }: Employee) => ({
        name: `${first_name} ${last_name}`,
        value: id,
    }));
    managerOptions.unshift({ name: 'None', value: null });

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Employee First Name:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Employee Last Name:',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Role for the Employee:',
            choices: rolesOptions,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Manager for the Employee:',
            choices: managerOptions,
        },
    ]);

    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]);
    console.log('Employee has been added to the list!');
}

// update an employee role
export async function updateEmployeeRole() {
    const existingEmployee = await pool.query('SELECT * FROM employee');
    const employeeOptions = existingEmployee.rows.map(({ id, first_name, last_name }: Employee) => ({
        name: `${first_name} ${last_name}`,
        value: id,
    }));

    const existingRoles = await pool.query('SELECT * FROM roles');
    const rolesOptions = existingRoles.rows.map(({ id, title }: Role) => ({
        name: title,
        value: id,
    }));

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Choose an employee to update',
            choices: employeeOptions,
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Choose a new role for the chosen employee',
            choices: rolesOptions,
        },
    ]);

    const query = "UPDATE employee SET role_id = $1 WHERE id = $2";
    await pool.query(query, [answer.role_id, answer.employee_id]);
    console.log('Employee role has been updated successfully');
}
