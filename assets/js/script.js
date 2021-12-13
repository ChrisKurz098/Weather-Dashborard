
function main() {
    //----------------------------------------------------------INIT PAGE--------------------------------------------------------//
    const Apikey = 'e1e7eafa5c756ed866504aaf6f3cb529';
    const searchFormEl = document.querySelector(".searchForm");
    const searchInputEl = document.querySelector(".inputBox");
    const listEl = document.querySelector(".list");
    const resultContailerEl = document.querySelector("#resultsContainer");
    let cityDisplayEl = document.querySelector("#cityDisplay"); //needs to be let variable as it changes
    const resultDisplayEl = document.querySelector(".resultsDisplay");
    const currentListEl = document.querySelector("#currentList");
    const currentTempDiv = document.querySelector(".currentTempHolder");
    const fiveDayEl = document.querySelector(".fiveDayContainer");
    let searchHistory = ["", "", "", "", "", "", ""];//make as many blanks as results desired


    //check if no prev search data found
    if (!localStorage.getItem("searches")) {
        //create a place to save prev search data. 
        localStorage.setItem("searches", JSON.stringify(searchHistory));
    }
    // load the prev search data from localStorage
    searchHistory = JSON.parse(localStorage.getItem("searches"));
    updateSearchList(searchHistory);
    //----------------------------------------------------------------------------------------------------------//

    //-------------Get Current Location---------------------//

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showLocal, getLocalError);
        } else {
            cityDisplayEl.textContent = "Geolocation is not supported by this browser.";
        }
    }

    function showLocal(position) {

        //Reverse location search to get the city name of the users location
        let apiUrl = "https://api.openweathermap.org/geo/1.0/reverse?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&limit=1&appid=" + Apikey;
        fetch(apiUrl).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //update the displyed name to current location
                    updateCityEl(data);
                });
            } else {
                cityDisplayEl.textContent = "No response from server";
            }
        })
            //errors are sent to the catch() method
            .catch(function (error) {
                // Notice this `.catch()` getting chained onto the end of the `.then()` method
                cityDisplayEl.textContent = "Unable to connect to server";
            });
        //get weather for current location
        fetchWeather(position.coords.latitude, position.coords.longitude);
    }
    function getLocalError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                cityDisplayEl.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                cityDisplayEl.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                cityDisplayEl.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                cityDisplayEl.innerHTML = "An unknown error occurred."
                break;
        }
    }

    getLocation();//Run functions to get local weather


    //---------------------------------------------------------INPUT HANDELING---------------------------------------------------//
    function getQuery(event) {
        event.preventDefault();
        let query = searchInputEl.value.trim();
        //if there is anything in the search input
        if (query) {
            searchInputEl.value = "";


            //runs the convert query to lon/lat
            convertQuery(query);
        }
    }

    //--------------------Logs the search into the prev search results array---------------------//
    function logSearch(search) {
        //if the current query isnt in the past search history
        if (searchHistory.every((currentValue) => currentValue !== search)) {
            //push all array values down one except for the last
            for (let i = searchHistory.length - 2; i > -1; i--) {
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
        //now create new elements/ update list
        for (let i = 0; i < array.length; i++) {
            let listItemEl = document.createElement("li");
            //if there is text in the array index, make the element visible with css classes
            if (array[i]) {
                listItemEl.classList = "border hoverHighlight bnt";
            }
            listItemEl.textContent = array[i];
            listEl.append(listItemEl);
        }
    }
    ///--------Update City Headder-------///
    function updateCityEl(data) {


        cityDisplayEl.remove();
        const newCityEl = document.createElement("h2");
        newCityEl.id = "cityDisplay"
        newCityEl.classList = "";

        let cityName = data[0].name + ', ' + data[0].state + ' ' + data[0].country;
        newCityEl.textContent = cityName;
        resultDisplayEl.prepend(newCityEl);
        //must redefine this elements variable beacuse you removed it
        cityDisplayEl = document.querySelector("#cityDisplay");
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
        currentTempEl.style.animation = "fade 1s"
        currentTempEl.textContent = "Temp: " + Math.round(data.current.temp) + "\u00B0F";

        let currentWindEl = document.createElement("li")
        currentWindEl.style.animation = "fade 1s"
        currentWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

        let currentHumEl = document.createElement("li")
        currentHumEl.style.animation = "fade 1s"
        currentHumEl.textContent = "Humidity: " + data.current.humidity + " %";

        let currentUviEl = document.createElement("li")
        currentUviEl.style.animation = "fade 1s"
        currentUviEl.textContent = "UVI Index: " + data.current.uvi;


        document.querySelector(".largeIcon").remove();
        let icon = document.createElement("li");
        icon.classList = "list";
        icon.innerHTML = '<i class = "owf largeIcon col-even owf-' + (data.current.weather[0].id) + '"></i>';
        //this will change the color of the icon depeding on how cloudy it is
        let c = data.current.clouds;
        icon.style.color = "rgb(" + (255-c) + "," + (255 - c) + "," + ((c * 2)+55) + ")";;

        document.querySelector("#description").remove();
        let descript = document.createElement("li");
        descript.classList = "list col-even";
        descript.id = "description";
        let weatherDescription = capitalize(data.current.weather[0].description);
        descript.innerHTML = weatherDescription;



        //append all to list
        currentListEl.append(currentTempEl);
        currentListEl.append(currentWindEl);
        currentListEl.append(currentHumEl);
        currentListEl.append(currentUviEl);
        currentTempDiv.append(icon);
        currentTempDiv.append(descript);
    }

    //this will capitalize each word in a string
    function capitalize(text) {
        //split word into array at spaces
        const textArray = text.split(" ");
        //create variable to hold capitalized words    
        let newText = "";
        //go through each word and capitalize
        for (let i = 0; i < textArray.length; i++) {
            newText += " " + textArray[i].charAt(0).toUpperCase() + textArray[i].slice(1) + " ";
        }
        //trim the extra spaces on ends
        newText = newText.trim();
        return newText;
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

            let iconEl = document.createElement("li");
            iconEl.innerHTML = '<i class = "owf col-even owf-' + (data.daily[i].weather[0].id) + '"></i>'
            iconEl.classList = "center";
            //this will change the color of the icon depeding on how cloudy it is
            let c = data.daily[i].clouds;
            iconEl.style.color = "rgb(" + (255-c) + "," + (255 - c) + "," + ((c * 2)+55) + ")";


            let tempEl = document.createElement("li")
            tempEl.textContent = "min/max: \n" + Math.round(data.daily[i].temp.min) + "\u00B0F / " + Math.round(data.daily[i].temp.max) + "\u00B0F";
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



    ///-----------------------------------------------FETCH REQUEST FUNCTIONS---------------------------------------------///
    function convertQuery(query) {
        let apiURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + query + '&limit=1&appid=' + Apikey;
        fetch(apiURL).then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    //Check if data has info
                    if (data.length) {
                        //save the query since it is valid
                        let savedNameData = data[0].name + ',' + data[0].state + ' ' + data[0].country;
                        logSearch(savedNameData);
                        updateCityEl(data);
                        fetchWeather(data[0].lat, data[0].lon);
                    }
                    else {
                        cityDisplayEl.textContent = "Not a valid city name";
                    }

                });
            }
            else {
                cityDisplayEl.textContent = "Error getting response";
            }
        }) //errors are sent to the catch() method
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            cityDisplayEl.textContent = "Unable to connect to server";
        });

    }


    //------Get weather data from lat and lon-----//
    function fetchWeather(lat, lon) {

        apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + Apikey;

        fetch(apiURL).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    currentWeatherDisplay(data);
                    forcastDisplay(data);
                    resultContailerEl.scrollIntoView({ behavior: "smooth" });
                });

            }
        });

    }

    //----Event Listeners---//
    searchFormEl.addEventListener("submit", getQuery);
    listEl.addEventListener("click", getPrevSearch);

    /////-----------------------------------------------END MAIN-------------------------------------------------------/////
}

///Run Code///
main();
