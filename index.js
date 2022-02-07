const inquirer = require("inquirer");
const db = require("./db/connection");

const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        message: "Choose an option",
        name: "action",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then(({ action }) => {
      switch (action) {
        case "View all Departments":
          viewDepartments();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "View all Employees":
          viewEmployees();
          break;
        case "Add a Department":
          promptDepartment();
          break;
        case "Add a Role":
          promptRole();
          break;
        case "Add an Employee":
          promptEmployee();
          break;
        case "update an Employee Role":
          updateRole();
          break;
      }
    });
};

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});
