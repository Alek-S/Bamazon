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
	console.log(choice.selected);
	switch(choice.selected){
		case 'View Products for Sale':
			viewProducts();
			break;

		case 'View Low Inventory':
			viewLowInventory()
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
	console.log('viewProducts');
	connection.end();
}


function viewLowInventory(){

}


function addToInventory(){

}


function addToProduct(){

}



