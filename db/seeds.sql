INSERT INTO department (name)
VALUES ('Engineering'),
       ('Human Resources'),
       ('Marketing'),
       ('Sales'),
       ('Finance'),
       ('Product Development'),
       ('Customer Support'),
       ('Legal'),
       ('Operations'),
       ('IT');

INSERT INTO roles (title, salary, department)
VALUES ('Software Engineer', 85000, 1),
       ('HR Manager', 70000, 2),
       ('Marketing Specialist', 60000, 3),
       ('Sales Representative', 55000, 4),
       ('Financial Analyst', 65000, 5),
       ('Product Manager', 90000, 6),
       ('Customer Support Agent', 45000, 7),
       ('Legal Counsel', 95000, 8),
       ('Operations Manager', 80000, 9),
       ('IT Administrator', 75000, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, NULL),
       ('Mark', 'Johnson', 3, 2),
       ('Emily', 'Davis', 4, NULL),
       ('Michael', 'Brown', 5, NULL),
       ('Lisa', 'Wilson', 6, NULL),
       ('Tom', 'Anderson', 7, 5),
       ('Sophia', 'Martinez', 8, NULL),
       ('James', 'Taylor', 9, NULL),
       ('Emma', 'Moore', 10, 9);
