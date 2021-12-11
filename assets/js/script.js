
function main() {

    const searchFormEl = document.querySelector(".searchForm");
    const searchInputEl = document.querySelector(".inputBox");
    let searchHistory = ["0", "1", "2", "3", "4"];

    //check if any prev searchs
    if (!localStorage.getItem("searches")) {
        //if none saved create a place to save them. 
        localStorage.setItem("searches", JSON.stringify(searchHistory));
    }
    // load the data from localStorage
    searchHistory = JSON.parse(localStorage.getItem("searches"));

    //-------------------------Get the value from the input--------------------------------//
    function getQuery(event) {
        event.preventDefault();
        let search = searchInputEl.value;
        console.log(search);
        //we will want to log the result after its resquest is successfull but for now we will just display it on click
        logSearch(search);
    }

    //Logs the search into the prev search results
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
        }
    }


    searchFormEl.addEventListener("submit", getQuery);

}

main();
