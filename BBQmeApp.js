//setup DOM Strings
const DOMStrings = {
    inputLeft: document.getElementById('yourcity'),
    topBarLeft: document.getElementById('loading'),
    gobtn: document.getElementById('go'),
    weatherInfo1L: document.getElementById('w1'),
    weatherInfo2L: document.getElementById('w2'),
    weatherInfo3L: document.getElementById('w3'),
    weatherInfo4L: document.getElementById('w4'),
    weekWeather: document.getElementById('weather-display'),
    afterMain: document.getElementById('btn-week-weather'),
    displayBtn: document.querySelector('.display')

}



//Find WOE ID (Where On Earth ID) for the location input by user
async function getlocationAW(query) {
    try {
        mode: 'no-cors'
        let result = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${query}`)
        let location = await result.json()
        let ID = location[0].woeid
        console.log(ID)
        return ID

    }
    catch (error) {
        console.log(error)
        failed()
    }
}

//fetch weather data and setup data structure
async function getweatherAW(woeID) {

    try {
        mode: 'no-cors'
        let result = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeID}/`)
        let data = await result.json()
    

        //Get Sky & Temp for our 6 days
        let day0 = [data.consolidated_weather[0].weather_state_name, data.consolidated_weather[0].the_temp, data.consolidated_weather[0].applicable_date]
        let day1 = [data.consolidated_weather[1].weather_state_name, data.consolidated_weather[1].the_temp, data.consolidated_weather[1].applicable_date]
        let day2 = [data.consolidated_weather[2].weather_state_name, data.consolidated_weather[2].the_temp, data.consolidated_weather[2].applicable_date]
        let day3 = [data.consolidated_weather[3].weather_state_name, data.consolidated_weather[3].the_temp, data.consolidated_weather[3].applicable_date]
        let day4 = [data.consolidated_weather[4].weather_state_name, data.consolidated_weather[4].the_temp, data.consolidated_weather[4].applicable_date]
        let day5 = [data.consolidated_weather[5].weather_state_name, data.consolidated_weather[5].the_temp, data.consolidated_weather[5].applicable_date]


        //Put the above into an Array
        let weatherStates = [
            day0,
            day1,
            day2,
            day3,
            day4,
            day5
        ]
        return weatherStates

    }
    catch (error) {
        failed()
        console.log(error)
    }
}


// clears all of out HTML
clear = () => {
    DOMStrings.topBarLeft.textContent = ''
    DOMStrings.weatherInfo1L.textContent = ''
    DOMStrings.weatherInfo2L.textContent = ''

}

//If the fetch fails, notify user
failed = () => {
    DOMStrings.topBarLeft.textContent = 'Sorry fetch request failed, please try again later 😥'
    DOMStrings.weatherInfo1L.textContent = 'Maybe take a look at the spelling of your City 🏙️'
    DOMStrings.weatherInfo2L.textContent = 'If Your City isn\'t big enough there may not be data 📡'
}


// let the user know our app is doing something 
loading = () => {
    DOMStrings.topBarLeft.textContent = 'Fetching Weather data... 🛰️'
    DOMStrings.weatherInfo1L.textContent = 'Searching up at the sky... 🔭'
    DOMStrings.weatherInfo2L.textContent = 'Putting a finger to the wind... 🍃'
    clearDisplayWeatherBtn()
    clearWeekWeather()
}

// display results of our best day to the UI
outputBestDay = (skyState) => {
    if (skyState !== 'noBBQ') {
        DOMStrings.topBarLeft.textContent = `Best BBQ Day for ${DOMStrings.inputLeft.value}: ${convertDateToDay(skyState[2])}🍔`
        DOMStrings.weatherInfo1L.textContent = `It will be ${skyState[1].toFixed(2)}°C🌡️`
        if (skyState.includes('Clear')) {
            DOMStrings.weatherInfo2L.textContent = `The sky will be ${skyState[0]}🌞`
        } else if (skyState.includes('Light Cloud')) {
            DOMStrings.weatherInfo2L.textContent = `There will be ${skyState[0]}🌤️`
        }
    } else {
        DOMStrings.topBarLeft.textContent = `Sorry, best if you stay inside ☔`
        DOMStrings.weatherInfo1L.textContent = `Come back in a few days and try again👋`
        DOMStrings.weatherInfo2L.textContent = `The sun will be back soon 😎`

    };

}


//Get Day form Date 
convertDateToDay = (APIDate) => {

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    day = new Date(APIDate)
    var dayName = days[day.getDay()]
    return dayName

}

//Insert "Display Weather Button"
insertDisplayWeatherBtn = () => {
    markup = `<button class="buttons display" id = "display">Display Weather</button>`
    DOMStrings.afterMain.insertAdjacentHTML('afterbegin', markup)
}

clearDisplayWeatherBtn = () => {
    if (document.querySelector('.display')) {
        document.querySelector('.display').remove()
    }

}


//Add Emois Depending on the Weather
outputSkyDisplay = (sky) => {
    var skySymbol
    if (sky === 'Snow') {
        skySymbol = '🌨️'
    } else if (sky === 'Sleet') {
        skySymbol = '🌨️'
    } else if (sky === 'Hail') {
        skySymbol = '🌨️'
    } else if (sky === 'Thunderstorm') {
        skySymbol = '⛈️'
    } else if (sky === 'Heavy Rain') {
        skySymbol = '🌧️'
    } else if (sky === 'Light Rain') {
        skySymbol = '🌧️'
    } else if (sky === 'Showers') {
        skySymbol = '☔'
    } else if (sky === 'Heavy Cloud') {
        skySymbol = '🌥️'
    } else if (sky === 'Light Cloud') {
        skySymbol = '🌤️'
    } else if (sky === 'Clear') {
        skySymbol = '🌞'
    }

    return skySymbol
}

//insert weather for the 6 days
insertWeekWeather = () => {

    markup = `<section class="container weathers" id="weather-display">
                <article class="float-child">
                    <h3 class = "days">${convertDateToDay(globalTemp_Sky[0][2])}</h3>
                    <p>${globalTemp_Sky[0][0]} ${outputSkyDisplay(globalTemp_Sky[0][0])}</p>
                    <p>${globalTemp_Sky[0][1].toFixed(2)}&#176C 🌡️</p>
                </article>
                <article class="float-child">
                    <h3 class = "days">${convertDateToDay(globalTemp_Sky[1][2])}</h3>
                    <p>${globalTemp_Sky[1][0]} ${outputSkyDisplay(globalTemp_Sky[1][0])}</p>
                    <p>${globalTemp_Sky[1][1].toFixed(2)}&#176C 🌡️</p>
                </article>
                <article class="float-child">
                    <h3 class = "days">${convertDateToDay(globalTemp_Sky[2][2])}</h3>
                    <p>${globalTemp_Sky[2][0]} ${outputSkyDisplay(globalTemp_Sky[2][0])}</p>
                    <p>${globalTemp_Sky[2][1].toFixed(2)}&#176C 🌡️</p>
                </article>
                <article class="float-child">
                    <h3 class = "days">${convertDateToDay(globalTemp_Sky[3][2])}</h3>
                    <p>${globalTemp_Sky[3][0]} ${outputSkyDisplay(globalTemp_Sky[3][0])}</p>
                    <p>${globalTemp_Sky[3][1].toFixed(2)}&#176C 🌡️</p>
                </article>
                <article class="float-child">
                    <h3 class = "days">${convertDateToDay(globalTemp_Sky[4][2])}</h3>
                    <p>${globalTemp_Sky[4][0]} ${outputSkyDisplay(globalTemp_Sky[4][0])}</p>
                    <p>${globalTemp_Sky[4][1].toFixed(2)}&#176C 🌡️</p>
                </article>
                <article class="float-child">
                    <h3 class = "days">${convertDateToDay(globalTemp_Sky[5][2])}</h3>
                    <p>${globalTemp_Sky[5][0]} ${outputSkyDisplay(globalTemp_Sky[5][0])}</p>
                    <p>${globalTemp_Sky[5][1].toFixed(2)}&#176C 🌡️</p>
                </article>
            </section>
            `
    DOMStrings.afterMain.insertAdjacentHTML('beforeend', markup)
}

//Clear week weather if it already sxists 
clearWeekWeather = () => {
    if (document.querySelector('.container')) {
        document.querySelector('.container').remove()
    }
}


//find best day for a BBQ
action = async () => {
    document.querySelector('.column').style.display = 'block'
    clear()
    var input1 = DOMStrings.inputLeft.value;
    loading()
    //get WOE ID from API
    ID1 = await getlocationAW(input1)
    //get Weather for that WOE ID
    temp_Sky = await getweatherAW(ID1)
    window.globalTemp_Sky = temp_Sky

    //If temp_Sky entries include Clear or light cloud put them into seperate arrays 
    clearDays = []
    lightCloudDays = []
    temp_Sky.forEach(element => {
        if (element.includes('Clear')) {
            clearDays.push(element)
        } else if (element.includes('Light Cloud')) {
            lightCloudDays.push(element)
        }
    });
    //put clear days into an array
    allClearDays = [].concat(...clearDays)
    //put light cloud days into an array
    allLightCloudDays = [].concat(...lightCloudDays)


    //Clear Temps 
    clearTemps = []
    allClearDays.forEach(el => {
        if (typeof(el) === 'number') {
            clearTemps.push(el)
        }
    })
    //Light Cloud Temps
    lightCloudTemps = []
    allLightCloudDays.forEach(el => {
        if (typeof(el) === 'number') {
            lightCloudTemps.push(el)
        }
    })

    //find highest temp in each
    highestClearTemp = Math.max(...clearTemps)
    highestLightCloudTemp = Math.max(...lightCloudTemps)




    //output highest temp clear day
    let bestClearDay, bestLightCloudDay
    temp_Sky.forEach(element => {
        if (element.includes('Clear') && element.includes(highestClearTemp)) {
            bestClearDay = element
        } else if (element.includes('Light Cloud') && element.includes(highestLightCloudTemp)) {
            bestLightCloudDay = element
        }
    });

    //output best clear day
    if (bestClearDay) {

        outputBestDay(bestClearDay)

    } //if that doesn't exist then output highest light cloud day  
    else if (!bestClearDay && bestLightCloudDay) {

        outputBestDay(bestLightCloudDay)

    } //if neither exist then output a sorry message
    else {
        outputBestDay('noBBQ')

    }
    // add Display Weather Button and Clear if already exist
    clearDisplayWeatherBtn()
    insertDisplayWeatherBtn()
}



//running action() on click
DOMStrings.gobtn.addEventListener('click', () => {
    action()
})
//running action() on enter press
document.addEventListener('keypress', (event) => {
    if (event.keyCode === 13 || event.which === 13) {
        action()

    }
})

// on click of dynamicly added display Weather btn then Display Weather
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'display') {
        clearWeekWeather()
        insertWeekWeather()


    }
});

init = () => {
    document.querySelector('.column').style.display = 'none'
}
init()
