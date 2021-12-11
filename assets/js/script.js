
function main() {
//----------------------------------------------------------INIT PAGE-----------------------------------------//
    const searchFormEl = document.querySelector(".searchForm");
    const searchInputEl = document.querySelector(".inputBox");
    const listEl = document.querySelector(".list")
    let searchHistory = ["", "", "", "", ""];

    //check if any prev searchs
    if (!localStorage.getItem("searches")) {
        //if none saved create a place to save them. 
        localStorage.setItem("searches", JSON.stringify(searchHistory));
    }
    // load the data from localStorage
    searchHistory = JSON.parse(localStorage.getItem("searches"));
    updateSearchList(searchHistory);
//----------------------------------------------------------------------------------------------------------//


            //-------------------------Get the value from the input--------------------------------//
    function getQuery(event) {
        event.preventDefault();
        let query = searchInputEl.value.trim();
        //if there is anything in the search input
        if (query) {
            searchInputEl.value = "";
            console.log("The query is: ", query);

            //runs the fetch request
            fetchSearch(query);
        }
    }

             //--------------------Logs the search into the prev search results array---------------------//
    function logSearch(search) {
        //if the current query isnt in the past search history
        if (searchHistory.every((currentValue) => currentValue !== search)) {
            //push all array values down one except for the last (index 4)
            for (let i = 3; i > -1; i--) {
                let old = searchHistory[i];
                let ii = i + 1;
                searchHistory[ii] = old;
            }
            searchHistory[0] = search;
            //save updated array to loaclStorage
            localStorage.setItem("searches", JSON.stringify(searchHistory));
            updateSearchList(searchHistory);
        }
    }
            //----------------------------Updates the list of prev searches dynamically---------------------//
    function updateSearchList(array) {
        //while there is a child element
        while (listEl.firstChild) {
            //remove the child element until none left
            listEl.removeChild(listEl.firstChild)
        }
        //now reate new elements/ update list
        for (let i = 0; i < array.length; i++) {
            let listItemEl = document.createElement("li")
            //if there is text in the array index, make it visible with css classes
            if (array[i]) {
                listItemEl.classList = "border hoverHighlight";
            }
            listItemEl.textContent = array[i];
            listEl.append(listItemEl);

        }

    }
            ///-----------------------if a prev search list is clicked run a fetch for that list items textContent-----------------//
    function getPrevSearch(event) {
        itemText = event.target.textContent.trim()
        //if there is text, run a fetch for text
        if (itemText) {
            fetchSearch(itemText);
        }
    }


///--------------------------------------------------------------FETCH STARTS HERE---------------------------------------------///
    function fetchSearch(query) {
        console.log("Fetch request for:", query);

        
        //we will want to log the result after its resquest is successfull but for now we will just display it on click
        logSearch(query);
    }

    //----Event Listeners---//
    searchFormEl.addEventListener("submit", getQuery);
    listEl.addEventListener("click", getPrevSearch);
    /////--------------------------------------------------------------END MAIN-----------------------------------------------------------------/////
}

main();
