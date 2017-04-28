'use strict';

//==MODULES==

//NPM
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk'); //cli text color
const Table = require('cli-table'); //cli table library

//local
const config = require('./config.js'); //database config file  --in .gitignore

//==DB Connection==
const connection = mysql.createConnection(config);

//connect to db
connection.connect( (err) => {
	if (err) throw err;
	console.log(chalk.grey('connected to database as ID: ' + connection.threadId));
	startInterview();
});


//interview - user to select action
function startInterview(){
	inquirer.prompt([
		{
			type: 'list',
			message: 'Select Action:',
			choices: [
				'View Products for Sale', 
				'View Low Inventory',
				'Add to Inventory',
				'Add to Product',
			],
			name: 'selected'
		}
	]).then( (choice)=>{

		switch(choice.selected){
			case 'View Products for Sale':
				viewProducts();
				break;

			case 'View Low Inventory':
				viewLowInventory();
				break;

			case 'Add to Inventory':
				addToInventory();
				break;

			case 'Add to Product':
				addToProduct();
				break;
		}
	});
}


//===FUNCTIONS==
function viewProducts(){

	connection.query('SELECT * FROM products', (err,res)=>{
		if(err) throw err;
		
		//cli table
		let productTable = new Table({
			head: ['ID', 'Name', 'Price', 'Quantity' ],
			colWidths: [5, 30, 10,10]
		});	

		for (let i = 0; i < res.length; i++) {
			productTable.push([res[i].item_id, res[i].product_name, '$'+res[i].price, res[i].quantity]);
		}

		//show table and close connection
		console.log(productTable.toString());
		connection.end();
	});
}


function viewLowInventory(){
	//where less than 5 in invntory
	connection.query('SELECT * FROM products WHERE quantity < 5', (err,res)=>{
		if(err) throw err;
		
		//cli table
		let productTable = new Table({
			head: ['ID', 'Name', 'Price', 'Quantity' ],
			colWidths: [5, 30, 10,10]
		});	

		for (let i = 0; i < res.length; i++) {
			productTable.push([res[i].item_id, res[i].product_name, '$'+res[i].price, res[i].quantity]);
		}

		//show table and close connection
		console.log(productTable.toString());
		connection.end();
	});
}


function addToInventory(){
	let products = [];

	connection.query('SELECT product_name, quantity FROM products', (err,res)=>{
		for (let i = 0; i < res.length; i++) {
			products.push(res[i].product_name);
		}

		inquirer.prompt([
			{
				type: 'list',
				message: 'Select product to add inventory to:',
				choices: products,
				name: 'addTo'
			},
			{
				type: 'input',
				message: 'Select quantity to add:',
				name: 'quantityToAdd'
			}
		]).then( (product)=>{

			if( !isNaN(product.quantityToAdd) ){
				//add that amount to the product's inventory
				connection.query('UPDATE products SET quantity=(quantity + ? ) WHERE product_name=?',[ parseInt(product.quantityToAdd), product.addTo], (err)=>{
					if (err) throw err;

					console.log(chalk.yellow('Added to inventory:'),product.quantityToAdd, 'to', product.addTo);
					connection.end();
				});
			} else{
				console.log( chalk.red('Error: Did not submit a valid number'));
				connection.end();
			}
		});
			
	});

}


function addToProduct(){

}



