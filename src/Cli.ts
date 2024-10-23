import inquirer from 'inquirer';

startCli(): void {
    inquirer
        .prompt([
            {
                type: 'list',
                message: "view all employees",
                name: "employee",
                choices: [`SELECT * FROM employee`]
            },
        ])
        .then(())
}