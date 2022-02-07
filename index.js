const inquirer = require("inquirer");
const db = require("./db/connection");

let deptSelect = [];
let roleSelect = [];
let mgrSelect = [];
let employSelect = [];

const selectDept = () => {
  deptSelect = [];
  let dept = `SELECT * FROM department`;
  db.query(dept, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var deptList = rows[i].dept_name;
        deptSelect.push(deptList);
      }
    }
  });
};

const selectRole = () => {
  roleSelect = [];
  let role = `SELECT title FROM roles`;
  db.query(role, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var roleList = rows[i].title;
        roleSelect.push(roleList);
      }
    }
  });
};

const selectMgr = () => {
  mgrSelect = [];
  let mgr = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE is_manager = 1 ORDER BY last_name`;
  db.query(mgr, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var mgrList = rows[i].name;
        mgrSelect.push(mgrList);
      }
    }
  });
};

const selectEmploy = () => {
  employSelect = [];
  let emp = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY last_name`;
  db.query(emp, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var empList = rows[i].name;
        employSelect.push(empList);
      }
    }
  });
};

const promptUser = () => {
  selectEmploy();
  selectRole();
  selectMgr();
  selectDept();
  return inquirer
    .prompt([
      {
        type: "list",
        message: "Choose an option",
        name: "selection",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a Role",
          "Update an Employee's Role",
          "Add an Employee",
          "Exit",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.selection) {
        case "View all Departments":
          viewDepartments();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "View all Employees":
          viewEmployee();
          break;
        case "Add a Department":
          promptDepartment();
          break;
        case "Add a Role":
          promptRole();
          break;
        case "Update an Employee's Role":
          updEmp();
          break;
        case "Add an Employee":
          promptEmployee();
          break;
        case "Exit":
          console.log("Have a nice day!");
          process.exit();
      }
    });
};

const viewDepartments = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    promptUser();
  });
};

const viewRoles = () => {
  const sql = `SELECT r.id, r.title, r.salary, d.dept_name FROM roles AS r JOIN department AS d ON d.id = r.department_id ORDER BY r.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      return err;
    }
    console.table(rows);
    promptUser();
  });
};

const viewEmployee = () => {
  const sql = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, e.manager_id, d.dept_name FROM employee AS e JOIN roles AS r ON r.id = e.role_id JOIN department AS d ON d.id = r.department_id ORDER BY e.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      return err;
    }
    console.table(rows);
    promptUser();
  });
};

const promptDepartment = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "What is the name of the department you'd like to add?",
      },
    ])
    .then(function (answer) {
      const sql = `INSERT INTO department (dept_name) VALUES ('${answer.dept}')`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

const promptRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the role you are wanting to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department do you want to add this role to?",
        choices: deptSelect,
      },
    ])
    .then((answer) => {
      let deptPick;
      for (let i = 0; i < deptSelect.length; i++) {
        if (deptSelect[i] === answer.department_id) {
          deptPick = i + 1;
        }
      }
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${deptPick}')`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

const promptEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter employee's last name:",
      },
      {
        type: "list",
        name: "role_id",
        message: "Select employee role:",
        choices: roleSelect,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: mgrSelect,
      },
      {
        type: "confirm",
        name: "is_manager",
        message: "Is this person a manager?",
        default: false,
      },
    ])
    .then((answer) => {
      let rolePick;
      for (var i = 0; i < roleSelect.length; i++) {
        if (roleSelect[i] === answer.role_id) {
          rolePick = i + 1;
        }
      }
      let mgrPick;
      for (var i = 0; i < mgrSelect.length; i++) {
        if (mgrSelect[i] === answer.manager_id) {
          mgrPick = i + 1;
        }
      }
      let isMgr;
      if (answer.is_manager == false) {
        isMgr = 0;
      } else {
        isMgr = 1;
      }

      const sql = `INSERT INTO employee (first_name, last_name, role_id, is_manager, manager_id) 
      VALUES ('${answer.first_name}', '${answer.last_name}', '${rolePick}', '${isMgr}', '${mgrPick}')`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

const updEmp = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "id",
        message: "Choose employee for update",
        choices: employSelect,
      },
      {
        type: "input",
        name: "first_name",
        message: "Enter employee's first name",
      },
      {
        type: "input",
        name: "last_name",
        message: "enter employee's last name",
      },
      {
        type: "list",
        name: "role_id",
        message: "Select employee's role",
        choices: roleSelect,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: mgrSelect,
      },
      {
        type: "confirm",
        name: "is_manager",
        message: "Is this employee a manager?",
        default: false,
      },
    ])
    .then((answer) => {
      let empChoice;
      for (var i = 0; i < employSelect.length; i++) {
        if (employSelect[i] === answer.id) {
          empChoice = i + 1;
        }
      }
      let newRole;
      for (var i = 0; i < roleSelect.length; i++) {
        if (roleSelect[i] === answer.role_id) {
          newRole = i + 1;
        }
      }
      let newMgr;
      for (var i = 0; i < mgrSelect.length; i++) {
        if (mgrSelect[i] === answer.manager_id) {
          newMgr = i + 1;
        }
      }
      let isMgr;
      if (answer.is_manager == false) {
        isMgr = 0;
      } else {
        isMgr = 1;
      }

      const sql = `UPDATE employee SET first_name = '${answer.first_name}', last_name = '${answer.last_name}', role_id = '${newRole}', is_manager = '${isMgr}', manager_id = '${newMgr}' WHERE id = '${empChoice}'`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  promptUser();
});
