let dotenv = require('dotenv').config();
let mysql = require('mysql');
let inquirer = require('inquirer');
let chalk = require('chalk');
let keys = require('./keys.js');
let Table = require('cli-table');

let table;
let createTable = function () {
    table = new Table({
        head: ['Item ID', 'Product Name', 'Product Description', 'Department Name', 'Price', 'Stock Quantity'],
        colWidths: [9, 20, 70, 20, 10, 18]
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

manage();
function manage() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Menu Options:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Remove Product', 'Quit']
        }
    ]).then(answers => {
        connection.query('SELECT * FROM bamazon.products', function (error, results, fields) {
            if (error) throw error;

            switch (answers.menu) {
                case 'View Products for Sale':
                    let red;
                    results.forEach((value) => {
                        if (value.stock_quantity < 5) {
                            red = chalk.red(value.stock_quantity);
                        } else {
                            red = value.stock_quantity;
                        }
                        table.push([value.item_id, value.product_name, value.product_description, value.department_name, chalk.green(value.price), red]);
                    });
                    console.log(table.toString());
                    createTable();
                    manage();
                    break;
                case 'View Low Inventory':
                    connection.query('SELECT * FROM bamazon.products WHERE stock_quantity<5;', function (error, results, fields) {
                        if (error) throw error;
                        results.forEach((value) => {
                            table.push([value.item_id, value.product_name, value.product_description, value.department_name, chalk.green(value.price), chalk.red(value.stock_quantity)]);
                        });
                        console.log(table.toString());
                        createTable();
                        manage();
                    });
                    break;
                case 'Add to Inventory':
                    increaseInventory();
                    break;
                case 'Add New Product':
                    addNewProduct();
                    break;
                case 'Remove Product':
                    removeProduct();
                    break;
                case 'Quit':
                    process.exit();
            }
        });
    });
}

function increaseInventory() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'restockID',
            message: 'Please enter a valid item ID:',
            validate: myValidation
        },
        {
            type: 'input',
            name: 'restockQty',
            message: 'Please enter an integer to add to currently selected stock:',
            validate: myValidation
        }
    ]).then(answers => {
        let stockID = parseInt(answers.restockID);
        let stockQty = parseInt(answers.restockQty);
        let exists = false;
        connection.query('SELECT * FROM bamazon.products WHERE item_id=?;', [stockID], function (error, results, fields) {
            if (error) throw error;

            if (results[0] !== undefined) {
                exists = true;
            }
        });
        connection.query('UPDATE bamazon.products SET stock_quantity=stock_quantity + ? WHERE item_id=?;', [stockQty, stockID], function (error, results, fields) {
            if (error) throw error;
            if (exists) {
                console.log(chalk.yellow('Stock updated successfully!'));
                manage();
            } else {
                console.log(chalk.red('ID not found. Please try another ID.'));
                invalidID();
            }
        });
    });
}

function addNewProduct() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please enter a product name:'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please enter a product description:'
        },
        {
            type: 'input',
            name: 'department',
            message: 'Please enter an item department:'
        },
        {
            type: 'input',
            name: 'price',
            message: 'Please enter an item price:',
            validate: myValidation
        },
        {
            type: 'input',
            name: 'stock',
            message: 'Please enter an initial stock quantity:',
            validate: myValidation
        }
    ]).then(answers => {
        connection.query('INSERT INTO bamazon.products (product_name, product_description, department_name, price, stock_quantity, product_sales) VALUES (?, ?, ?, ?, ?, 0);', [answers.name, answers.description, answers.department, answers.price, answers.stock], function (error, results, fields) {
            if (error) throw error;
            console.log(chalk.yellow('New product successfully added!'));
            manage();
        });
    });
}

function invalidID() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'invalidIDnode',
            message: 'Would you like to try another ID, or return to the main menu?',
            choices: ['Try another ID', 'Return to main menu']
        }
    ]).then(answers => {
        if (answers.invalidIDnode === 'Try another ID') {
            increaseInventory();
        } else {
            manage();
        }
    });
}

function removeProduct() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'idToRemove',
            message: 'Please enter an ID of the product to DELETE:',
            validate: myValidation
        }
    ]).then(answers => {
        let productID = parseInt(answers.idToRemove);
        let exists = false;
        connection.query('SELECT * FROM bamazon.products WHERE item_id=?;', [productID], function (error, results, fields) {
            if (error) throw error;

            if (results[0] !== undefined) {
                exists = true;
            }
        });
        connection.query('DELETE FROM bamazon.products WHERE item_id=?;', [productID], function (error, results, fields) {
            if (error) throw error;
            if (exists) {
                console.log(chalk.yellow('Product deleted successfully!'));
                manage();
            } else {
                console.log(chalk.red('ID not found. Please try another ID.'));
                invalidID();
            }
        });
    });
}


