# bamazon
This is a CLI shopping application which exemplifies a scaled-down model of the functionality of larger and more prominent shopping platforms, such as Amazon. The database used in this application is mySQL. This app provides 3 different access levels: customer, manager, and supervisor. 

##### Customer
When 'node bamazonCustomer.js' is run in the command line, the user is prompted with a list of items for sale, and corresponding prices. Once an item is selected, the user is prompted to enter the quantity of the item selected. After the selection, the item id, item name, and price are displayed with a highlighted confirmation to the right which displays the quantity added. At this time, the user also receives a prompt asking whether to continue shopping or to view the cart and checkout. If continue shopping is selected, the entire process repeats, otherwise the cart contents and total are displayed. 

##### Manager
When <node bamazonManager.js> is run in the command line, the user is presented a menu of the following options:
  1. View Products for Sale - Displays a table of Item ID, Product Name, Product Description, Department Name, Price, and Stock Quantity
  2. View Low Inventory - Displays the Products for Sale table that includes records that have a stock quantity less than 5
  3. Add to Inventory - Prompts the user to enter an Item ID from the previously available table views. Next the user is prompted to input a quantity which will be added to the previous value. A confirmation will be displayed if successful, otherwise the user will given the options to try another ID or return to the main menu.
  4. Add New Product - The user will receive 5 consecutive prompts: product name, product description, item department, item price, and initial stock quantity. The Item ID will be generated inside the database (if the appropiate settings are implemented). Validation is used for the two numerical values to ensure that the quantity is a positive integer and the price is a positive number.
  5. Remove Product - This option functions similarly to the 'Add to Inventory' option, except that it deletes the entire record of the product from the database. 
  6. Quit - Exits the program.
  
##### Supervisor
When <node bamazonSupervisor.js> is run, the user is presented with three options:
  1. View Product Sales by Department - Creates and displays a table from a query that combines occurrences of the products table that have the same department name and sums the values from each department name group. The table values displayed are: Department ID, Department Name, Overhead Costs, Product Sales, and Total Profit. The overhead costs derive from a mock number that was arbitrarily chosen and created in the database in the departments table. The total profit is a derived value that is calculated in the javaScript code (Product Sales - Overhead Costs).  
  2. Create New Department - Prompts the user consecutively for two data inputs: the new department name, and the amount of the overhead. The user will receive a confirmation if successful, and a message that informs the user that although the new department is created, it must be instantiated in 'products' through the manager command by adding at least one item in that category to the inventory, at which point the newly added department will be visible from the table in the supervisor interface.
  3. Quit - Exits the program.

In order to download and run this application, you will need to have node.js installed, and then run <npm install>, after forking/cloning the application. You will also need a platform for running mySQL, such as mySQL Workbench, as well as your own password. You will then need to build a database with two tables: products and departments.
