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