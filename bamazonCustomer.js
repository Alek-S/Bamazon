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

	//interview for user to select among a list of products
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

		//interview user for how much they want to buy
		inquirer.prompt([
			{
				type: 'input',
				message: 'Select quantity (inventory: ' + quantity + '):',
				name: 'quantitySelection'
			}
		]).then(function(input){

			//if inventory is lower than user's desired amount, let them know and close out
			if(typeof quantity !== 'number' || input.quantitySelection > quantity ){
				console.log( chalk.red('Insufficient quantity!'));
				connection.end();
				return;
			}else{

				// else subtract the selected product's inventory
				connection.query('UPDATE products SET quantity=(quantity - ? ) WHERE item_id=?;',[input.quantitySelection, productID], (err)=>{
					if (err) throw err;
					console.log(chalk.yellow('Inventory deduced by: ') + input.quantitySelection);

					console.log( chalk.yellow('Total Charge: ') + '$' + (input.quantitySelection * price).toFixed(2) );
					connection.end();
				});
			}
		});
	});
}






