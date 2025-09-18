# Inventory Management Frontend
## Link to backend: https://github.com/andronisdre/inventory-management-backend

## The frontend for my inventory management application
I made this project as an assignment to show VGR on the recruitment day.

The project is made to handle the inventory of articles/products in a healthcare center. The project is made in vs code with react + vite
For the UI to look correct you should make sure that your browser has dark mode enabled.
The light mode design hasnt been configured.

## Functionality
First you need to start the backend.
then you can access all the backend endpoints. Click around the dashboard to try things out.

You can create articles by clicking "create article", close it again by pressing the same button or the close button on the form.
The validation works but sometimes toast error messages dont display since setError is delayed.

You can open a similar form for updating the article by pressing the blue update button that is displayed in the article's "action" column in the article list.
A delete button is also present in the action column, be careful, it intsantly deletes articles, in the future i would add an "are you sure you weant to delete this article" popup.

You can show all articles, only low stock article, also filter based on name by searching. 
You can order by name, unit and updatedAt. unit sorting doesnt currently work preoperly since articles with the same unit value get arranged randomly, they should instead be ordered secondarily by name.
sort by name, date and unit by pressing them in the table. click again to switch between ascending and descending order.

you can also simply patch the amount of an article by either subtracting or adding a number to the current amount. Do this by clicking the mapped articles amount in the article list.

## Installation
go to the code page of the repository and click the "green" code buton, copy to clipboard or install in the way you like.

in the project, in the root folder, make an .env.local file with this line "VITE_API_URL=http://localhost:8080/api"
