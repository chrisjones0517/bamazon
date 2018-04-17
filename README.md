# bamazon
This is a CLI shopping application which exemplifies a scaled-down model of the functionality of larger and more prominent shopping platforms, such as Amazon. The database used in this application is mySQL. This app provides 3 different access levels: customer, manager, and supervisor. 

##### Customer
When <node bamazonCustomer.js> is run in the command line, the user is prompted with a list of items for sale, and corresponding prices. Once an item is selected, the user is prompted to enter the quantity of the item selected. After the selection, the item id, item name, and price are displayed with a highlighted confirmation to the right which displays the quantity added. At this time, the user also receives a prompt asking whether to continue shopping or to view the cart and checkout. If continue shopping is selected, the entire process repeats, otherwise the cart contents and total are displayed. 

##### Manager
When <node bamazonManager.js> is run in the command line, the user is presented a menu of the following options:
  1. View Products for Sale - Displays a table of Item ID, Product Name, Product Description, Department Name, Price, and Stock Quantity
  2. View Low Inventory - Displays the Products for Sale table that includes records that have a stock quantity less than 5
  3. Add to Inventory - Prompts the user to enter an Item ID from the previously available table views. Next the user is prompted to input a quantity which will be added to the previous value.
  4. Add New Product
  5. Remove Product
  

In order to download and run this application, you will need to have node.js installed, and then run <npm install>, after forking/cloning the application. You will also need a platform for running mySQL, such as mySQL Workbench, as well as your own password. 
