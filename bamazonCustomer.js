let dotenv = require('dotenv').config();
let mysql = require('mysql');
let inquirer = require('inquirer');
let chalk = require('chalk');
let keys = require('./keys.js');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: keys.password,
    database: 'bamazon'
});

let userCart = {
    items: [],
    qty: [],
    total: 0
};

shop();
function shop() {
    pool.getConnection((err, connection) => {
        if (err) throw err; 
        connection.query('SELECT * FROM bamazon.products', function (error, results, fields) {

            let productList = [];
            results.forEach((value, index) => {
                let str = `${value.item_id} ${value.product_name}                         `;
                str = str.split('');
                str.splice(25, 30, `$${value.price}`);
                let strLayout = str.join('');
                productList.push(strLayout);
            });
            connection.release();
            if (error) throw error; 

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'product_choice',
                    message: 'Welcome to Bamazon!\nWhich of the following products would you like to add to your cart?',
                    choices: productList
                },
                {
                    type: 'input',
                    name: 'numItems',
                    message: 'How many would you like to add?',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ]).then(answers => {
                let idArr = answers.product_choice.split(' ');
                let id = idArr[0];
                connection.query(`SELECT * FROM bamazon.products WHERE item_id = ${id};`, function (error, results, fields) {
                    if (results[0].stock_quantity >= answers.numItems) {
                        console.log(`${answers.product_choice} - quantity ${answers.numItems} has been added to your cart.`);
                        userCart.items.push(answers.product_choice);
                        userCart.qty.push(answers.numItems);
                        userCart.total += answers.numItems * results[0].price;
                        connection.query(`UPDATE bamazon.products SET stock_quantity = ${results[0].stock_quantity - answers.numItems}, product_sales = ${results[0].product_sales} + ${answers.numItems} * ${results[0].price} WHERE item_id = ${id}`, function (error, results, fields) {
                            if (error) throw error;
                        });

                        cartOrShop();
                    } else {
                        console.log(chalk.red('Sorry, current stock is insufficient to complete your order. Please select another item or number of items.'));
                        shop();
                    }

                    if (error) throw error;
                });
            });
        });
    });
}

function cartOrShop() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'doneShopping',
            message: 'Would you like to continue shopping?',
            choices: ['Continue shopping', 'View cart and checkout']
        }
    ]).then(answers => {
        if (answers.doneShopping === 'Continue shopping') {
            shop();
        } else {
            userCart.items.forEach((value, index) => {
                console.log(value);
                console.log(`Qty: ${userCart.qty[index]}\n`);
            });
            console.log(chalk.green(`$${userCart.total}`) + ' (plus tax and shipping)');
            process.exit();
        }
    });
}

