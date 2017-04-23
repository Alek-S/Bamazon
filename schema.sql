CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products(
  item_id INTEGER UNIQUE NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NULL,
  price DECIMAL (10, 2) NOT NULL,
  quantity INTEGER(50) NULL,
  PRIMARY KEY (item_id)
);




#Mock Data
INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('Sony MDR-Pro Headphones','Audio','75.23','42');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('City of Thieves','Books','5.58','4');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('Canon EOS 6D','Photography','745.14','9');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('JetBoil','Camping','245.14','45');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('250GB SSD','Storage','445.54','15');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('Bianchi Single Speed','Cycling','210.12','67');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('Scotch Precision Scissor','Office','5.14','75');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('Oral-B Electic Toothbrush','Personal Care','62.94','50');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('Brave New World','Books','2.59','13');

INSERT INTO Bamazon.products(product_name, department_name, price, quantity)
  VALUE ('Advil','Health','3.84','125');
