
function main() {
    //----------------------------------------------------------INIT PAGE--------------------------------------------------------//
    const searchFormEl = document.querySelector(".searchForm");
    const searchInputEl = document.querySelector(".inputBox");
    const listEl = document.querySelector(".list");
    const resultContailerEl = document.querySelector("#resultsContainer");
    const resultDisplayEl = document.querySelector(".resultsDisplay");
    const currentListEl = document.querySelector("#currentList");
    const currentTempDiv = document.querySelector(".currentTempHolder");
    const fiveDayEl = document.querySelector(".fiveDayContainer");
    let searchHistory = ["", "", "", "", "","",""];
    

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
            //push all array values down one except for the last
            for (let i = searchHistory.length-2; i > -1; i--) {
                let old = searchHistory[i];
                let ii = i + 1;
                searchHistory[ii] = old;
            }
            searchHistory[0] = search;
            //save updated array to loaclStorage
            localStorage.setItem("searches", JSON.stringify(searchHistory));
            updateSearchList(searchHistory);
        }
        return;
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
            let listItemEl = document.createElement("li");
            //if there is text in the array index, make it visible with css classes
            if (array[i]) {
                listItemEl.classList = "border hoverHighlight bnt";
            }
            listItemEl.textContent = array[i];
            listEl.append(listItemEl);
        }
    }
    ///--------Update City Headder-------///
    function updateCityEl(data) {
        const cityDisplayEl = document.querySelector("#cityDisplay");
        const newCityEl = document.createElement("h2");
        newCityEl.id = "cityDisplay"
        cityDisplayEl.remove();
        let cityName = data[0].name + ', ' + data[0].state + ' ' + data[0].country;
        newCityEl.textContent = cityName;
        resultDisplayEl.prepend(newCityEl);
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
        currentTempEl.style.animation = "rightFade 1s"
        currentTempEl.textContent = "Temp: " + Math.round(data.current.temp) + "\u00B0F";

        let currentWindEl = document.createElement("li")
        currentWindEl.style.animation = "rightFade 1s"
        currentWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

        let currentHumEl = document.createElement("li")
        currentHumEl.style.animation = "rightFade 1s"
        currentHumEl.textContent = "Humidity: " + data.current.humidity + " %";

        let currentUviEl = document.createElement("li")
        currentUviEl.style.animation = "rightFade 1s"
        currentUviEl.textContent = "UVI Index: " + data.current.uvi;


        document.querySelector(".largeIcon").remove();
        let icon = document.createElement("li");
        icon.classList = "list";
        icon.innerHTML = '<i class = "owf largeIcon owf-' + (data.current.weather[0].id) + '"></i>';
        

        //append all to list
        currentListEl.append(currentTempEl);
        currentListEl.append(currentWindEl);
        currentListEl.append(currentHumEl);
        currentListEl.append(currentUviEl);
        currentTempDiv.append(icon);
    }

    //--------Update DOM to show five day forcast-----//
    function forcastDisplay(data) {
        while (fiveDayEl.firstChild) {
            //remove the child element until none left
            fiveDayEl.removeChild(fiveDayEl.firstChild)
        }

        for (let i = 1; i < 5; i++) {
            //convert the date
            let dateInfo = new Date((data.daily[i].dt) * 1000);
            let theDate = (dateInfo.getMonth() + 1) + "/" + (dateInfo.getUTCDate()) + "/" + (dateInfo.getUTCFullYear());
            //Create amd populate ol
            const ol = document.createElement("ol");
            ol.classList = "list border col-even dailyList";

            //now create new elements/ update list
            let dayEl = document.createElement("li")
            dayEl.classList = "bold center border-bottom";
            dayEl.textContent = theDate;

            ///Create New Ico
           
            let iconEl = document.createElement ("li");
            iconEl.innerHTML = '<i class = "owf col-even owf-' + (data.daily[i].weather[0].id) + '"></i>'
            iconEl.classList = "center";
            

            let tempEl = document.createElement("li")
            tempEl.textContent = "min/max: \n" + Math.round(data.daily[i].temp.min) + "\u00B0F / " + Math.round(data.daily[i].temp.min) + "\u00B0F";
            tempEl.classList = "center";

            let windEl = document.createElement("li")
            windEl.textContent = "Wind: \n" + data.daily[i].wind_speed + " MPH";
            windEl.classList = "center";

            let humEl = document.createElement("li")
            humEl.textContent = "Humidity: \n" + data.daily[i].humidity + " %";
            humEl.classList = "center";

            let uviEl = document.createElement("li")
            uviEl.textContent = "UVI Index: \n" + data.daily[i].uvi;
            uviEl.classList = "center";

          
            //append all to list
            ol.append(dayEl);
            ol.append(iconEl);
            ol.append(tempEl);
            ol.append(windEl);
            ol.append(humEl);
            ol.append(uviEl);
            
            fiveDayEl.append(ol);

        }
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
                    forcastDisplay(data);
                    resultContailerEl.scrollIntoView({behavior: "smooth"});
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
