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
});


//interview - user to select action
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

}


function addToProduct(){

}



