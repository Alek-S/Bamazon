'use strict';

//==MODULES==
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const config = require('./config.js'); //database config file  --in .gitignore

//==DB Connection==
const connection = mysql.createConnection(config);

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

	//interview - user to select among a list of products
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
	let price = undefined;

	//based on users product selection, grab the quantity availabe and current price
	connection.query('SELECT quantity, price FROM products WHERE ?',{item_id: productID}, (err,res) =>{
		if (err) throw err;
		quantity = res[0].quantity;
		price = res[0].price;

		//interview - how much user wants to buy
		inquirer.prompt([
			{
				type: 'input',
				message: 'Select quantity (inventory: ' + quantity + '):',
				name: 'quantitySelection'
			}
		]).then(function(input){

			//if inventory is lower than user's desired amount, or not a numeric value, give error and close out
			if(typeof input.quantitySelection !== 'number' || input.quantitySelection > quantity ){
				console.log( chalk.red('Error: Not a number or insufficient quantity!'));
				connection.end();
				return;
			}else{

				// else subtract the selected product's inventory
				connection.query('UPDATE products SET quantity=(quantity - ? ) WHERE item_id=?;',[input.quantitySelection, productID], (err)=>{
					if (err) throw err;
					console.log(chalk.yellow('Inventory reduced by: ') + input.quantitySelection);

					console.log( chalk.yellow('Total Charge: ') + '$' + (input.quantitySelection * price).toFixed(2) );
					connection.end();
				});
			}
		});
	});
}
