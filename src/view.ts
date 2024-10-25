import { pool } from './connection.js';

// view all departments
export async function viewAllDepartments() {
    const query = 'SELECT id AS department_id, name AS department_name FROM department';
    const result = await pool.query(query);
    
    console.table(result.rows);
}

// view all employees
export async function viewAllEmployees() {
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
export async function viewAllRoles() {
    const query = `
        SELECT roles.id AS role_id, roles.title AS role_title, roles.salary AS role_salary, department.name AS department_name
        FROM roles
        LEFT JOIN department ON roles.department = department.id
    `;
    const result = await pool.query(query);
    console.table(result.rows);
}
