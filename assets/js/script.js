
function main() {
    //----------------------------------------------------------INIT PAGE--------------------------------------------------------//
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


    //---------------------------------------------------------INPUT HANDELING---------------------------------------------------//
    function getQuery(event) {
        event.preventDefault();
        let query = searchInputEl.value.trim();
        //if there is anything in the search input
        if (query) {
            searchInputEl.value = "";
            console.log("The query is: ", query);

            //runs the convert query to lon/lat
            convertQuery(query);
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
            convertQuery(itemText);
        }
    }



    ///--------------------------------------------------------------FETCH STARTS HERE---------------------------------------------///
    function convertQuery(query) {
        let apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + query + '&limit=1&appid=e1e7eafa5c756ed866504aaf6f3cb529'
        fetch(apiURL).then(function (response) {
            if (response.ok) {
                console.log('response: ', response);
                response.json().then(function (data) {
                    //Check if data has info
                    if (data.length) {
                        //save the query since it is valid
                        let save = data[0].name + ',' + data[0].state + ',' + data[0].country;
                        logSearch(save);
                        console.log(data);
                        console.log('Lon: ', data[0].lon);
                        console.log('Lat: ', data[0].lat);
                    }
                    else {
                        console.log("Not a valid city name");
                    }

                });
                
            }
        });

    }



    function fetchSearch(lat, lon) {
        console.log("Fetch request for:", query);
        apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=e1e7eafa5c756ed866504aaf6f3cb529"
        //we will want to log the result after its resquest is successfull but for now we will just display it on click

    }

    //----Event Listeners---//
    searchFormEl.addEventListener("submit", getQuery);
    listEl.addEventListener("click", getPrevSearch);
    /////--------------------------------------------------------------END MAIN-----------------------------------------------------------------/////
}

main();
