let dotenv = require('dotenv').config();
let mysql = require('mysql');
let inquirer = require('inquirer');
let chalk = require('chalk');
let keys = require('./keys.js');
let Table = require('cli-table');

let table;
let createTable = function () {
    table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
        colWidths: [20, 20, 20, 20, 20]
    });
};
createTable();

let myValidation = function (value) {
    if ((isNaN(value) == false) && (value > 0)) {
        return true;
    } else {
        return false;
    }
};

let connection = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: keys.password,
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

supervise();
function supervise() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Main Menu:',
            choices: ['View Product Sales by Department', 'Create New Department', 'Quit']
        }
    ]).then(answers => {
        if (answers.menu === 'View Product Sales by Department') {
            connection.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, newTable.productSales FROM bamazon.departments INNER JOIN (SELECT department_name, SUM(product_sales) AS productSales FROM bamazon.products GROUP BY department_name) AS newTable ON departments.department_name=newTable.department_name ORDER BY productSales DESC;', function (error, results, fields) {
                if (error) throw error;

                let profit;
                results.forEach((value) => {
                    profit = value.productSales - value.over_head_costs;
                    if (profit < 0) {
                        profit = chalk.red(profit);
                    }
                    table.push([value.department_id, value.department_name, value.over_head_costs, value.productSales, profit]);
                });
                console.log(table.toString());
                createTable();
                supervise();
            });
        } else if (answers.menu === 'Create New Department') {
            createNewDept();
        } else {
            process.exit();
        }
    });
}

function createNewDept() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'Please enter a department name:'
        },
        {
            type: 'input',
            name: 'overhead',
            message: 'Please enter the department overhead:',
            validate: myValidation
        }
    ]).then(answers => {
        connection.query('SELECT * FROM bamazon.departments WHERE ?=department_name', [answers.deptName], function (error, results, fields) {
            if (error) throw error;
            if (results[0]) {
                console.log(results[0]);
                console.log(chalk.red('Sorry, that department name is already in use. Please try another name.'));
                supervise();
            } else {
                connection.query('INSERT INTO bamazon.departments (department_name, over_head_costs) VALUES (?, ?)', [answers.deptName, answers.overhead], function (error, results, fields) {
                    if (error) throw error;
                    console.log(chalk.yellow('New department was added successfully!'));
                    console.log('NOTE: Manager must add new product inside this department to instantiate new department into sales view.');
                    supervise();
                });
            }
        });
    });
}


