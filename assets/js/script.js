
function main() {
    //----------------------------------------------------------INIT PAGE--------------------------------------------------------//
    const searchFormEl = document.querySelector(".searchForm");
    const searchInputEl = document.querySelector(".inputBox");
    const listEl = document.querySelector(".list")
    const currentListEl = document.querySelector("#currentList");
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

    ///-----------------------if a prev search list is clicked run a fetch for that list items textContent-----------------//
    function getPrevSearch(event) {
        itemText = event.target.textContent.trim()
        //if there is text, run a fetch for text
        if (itemText) {
            convertQuery(itemText);
        }
    }

    ////------------------------------------------------------UPDATE HTML DOM-------------------------------------------------//

    //------Updates the list of prev searches dynamically----------------//
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
    ///--------Update City Headder-------///
    function updateCityEl(data) {
        const cityDisplayEl = document.querySelector("#cityDisplay");
        let cityName = data[0].name + ', ' + data[0].state + ' ' + data[0].country;
        cityDisplayEl.textContent = cityName;
        return;
    }

    //-----Update DOM to display current weather stats---//
    function currentWeatherDisplay(data) {
        //remove all list elements from parent
        while (currentListEl.firstChild) {
            //remove the child element until none left
            currentListEl.removeChild(currentListEl.firstChild)
        }

        //now create new elements/ update list
        let currentTempEl = document.createElement("li")
        currentTempEl.textContent = "Temp: " + Math.round(data.current.temp) + "\u00B0F";

        let currentWindEl = document.createElement("li")
        currentWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

        let currentHumEl = document.createElement("li")
        currentHumEl.textContent = "Humidity: " + data.current.humidity + " %";

        let currentUviEl = document.createElement("li")
        currentUviEl.textContent = "UVI Index: " + data.current.uvi;
        //append all to list
        currentListEl.append(currentTempEl);
        currentListEl.append(currentWindEl);
        currentListEl.append(currentHumEl);
        currentListEl.append(currentUviEl);

    }


    ///--------------------------------------------------------------FETCH REQUEST FUNCTIONS---------------------------------------------///
    function convertQuery(query) {
        let apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + query + '&limit=1&appid=e1e7eafa5c756ed866504aaf6f3cb529'
        fetch(apiURL).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //Check if data has info
                    if (data.length) {
                        //save the query since it is valid
                        let savedNameData = data[0].name + ',' + data[0].state + ',' + data[0].country;
                        logSearch(savedNameData);
                        updateCityEl(data);
                        console.log('Lon: ', data[0].lon);
                        console.log('Lat: ', data[0].lat);
                        fetchWeather(data[0].lat, data[0].lon);
                    }
                    else {
                        console.log("Not a valid city name");
                    }

                });
            }
            else {
                console.log("Error getting response");
            }
        });

    }



    function fetchWeather(lat, lon) {
        console.log("Fetch request for:", lat, lon);
        apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=e1e7eafa5c756ed866504aaf6f3cb529"

        fetch(apiURL).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log("Weather Data: ", data);
                    currentWeatherDisplay(data);
                });
            }
        });

    }

    //----Event Listeners---//
    searchFormEl.addEventListener("submit", getQuery);
    listEl.addEventListener("click", getPrevSearch);
    /////--------------------------------------------------------------END MAIN-----------------------------------------------------------------/////
}

main();
