export type Department = { id: number, name: string };
export type Role = { id: number, title: string, salary: number, department: number };
export type Employee = { id: number | null, first_name: string, last_name: string, role_id: number, manager_id: number };
