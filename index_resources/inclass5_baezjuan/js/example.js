// ADD NEW ITEM TO END OF LIST
var list = document.getElementsByTagName("ul")[0];
list.innerHTML = list.innerHTML + `<li>cream</li>`;

// ADD NEW ITEM START OF LIST
list.innerHTML = `<li>kale</li>` + list.innerHTML;

// ADD A CLASS OF COOL TO ALL LIST ITEMS
var items = list.getElementsByTagName("li");
for (var i = 0; i < items.length; i++)
	items[i].setAttribute('class', 'cool');

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
document.getElementsByTagName("h2")[0].innerHTML += " (" + i.toString() + ")";