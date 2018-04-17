# bamazon
This is a CLI shopping application which exemplifies a scaled-down model of the functionality of larger and more prominent shopping platforms, such as Amazon. The database used in this application is mySQL. This app provides 3 different access levels: customer, manager, and supervisor. 

##### Customer
When <node bamazonCustomer.js> is run in the command line, the user is prompted with a list of items for sale, and corresponding prices. Once an item is selected, the user is prompted to enter the quantity of the item selected. After the selection, the item id, item name, and price are displayed with a highlighted confirmation to the right which displays the quantity added. At this time, the user also receives a prompt asking whether to continue shopping or to view the cart and checkout. If continue shopping is selected, the entire process repeats, otherwise the cart contents and total are displayed. 
  
  

In order to download and run this application, you will need to have node.js installed, and then run <npm install>, after forking/cloning the application. You will also need a platform for running mySQL, such as mySQL Workbench, as well as your own password. 
