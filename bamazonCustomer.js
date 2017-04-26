'use strict';

//==MODULES==
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');


//==DB Connection==
const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'Bamazon'
});

//connect to db
connection.connect( (err) => {
	if (err) throw err;
	console.log(chalk.grey('connected to database as ID: ' + connection.threadId));
});


//get current products -- for use in inquirer list
connection.query('SELECT item_id, product_name FROM products', (err,res)=>{
	let products = [];

	if (err) throw err;

	for(let i=0; i < res.length; i++){
		products.push(res[i].item_id + ') ' + res[i].product_name);
	}
	selectProduct(products);
});

function selectProduct(products){
	inquirer.prompt([
		{
			type: 'list',
			message: 'Select a Product:',
			choices: products,
			name: 'userSelection'
		}
	]).then(function(input){
		selectQuantity(input.userSelection);
	});
}

function selectQuantity(productSelection){
	let productID = productSelection.split(') ')[0];
	let quantity = undefined;

	connection.query('SELECT quantity FROM products WHERE ?',{item_id: productID}, (err,res) =>{
		if (err) throw err;
		console.log(res[0].quantity);

		inquirer.prompt([
			{
				type: 'input',
				message 'Select quantity (inventory - ' + res[0].quantity + '):',
				name: quantitySelection
			}
		]).then(function(input){
			
		});
	});
}