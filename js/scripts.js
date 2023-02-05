document.addEventListener('DOMContentLoaded', function(){
	let lat; 
	let lng;
	let apiKey;
	
	const currentLocation = document.querySelector('.currient-location');
	const currentTemperature = document.querySelector('.app__main-temperature');
	const currentConditionIcon = document.querySelector('.app__main-icon img');
	const currentDate = document.querySelector('.app__main-date');
	const currentDay = document.querySelector('.app__day');
	const currentTime = document.querySelector('.app__time');
	const currentWind = document.querySelector('.wind-kph b');
	const currentHum = document.querySelector('.hum b');
	const currentWeatherBgVideo = document.querySelector('#weather-status-bg');
	const currentWeatherBgVideoSourse = document.querySelector('#weather-status-bg source');
	const currentWeathertatus = document.querySelector('.weather-status');
	const currentWeathertatusImage = document.querySelector('.weather-status-img img');
	const currentUsEpaInder = document.querySelector('#us-epa-index');
	const currentGbDefraInder = document.querySelector('#gb-defra-index');
	
	const forecastRow = document.querySelector('.app__weatrer-forecast-row');
	const forecastSunriseTime = document.querySelector('.sunrise-time');
	const forecastSunsetTime = document.querySelector('.sunset-time');
	const forecastMoonriseTime = document.querySelector('.moonrise-time');

	const searchBtn = document.querySelector('#input-btn-search');
	const currentLocationReceiveBtn = document.querySelector('.app__currient-location-receice');

	const errorPopupElement = document.querySelector('.error-popup');
	const closeErrorPopupElement = document.querySelector('.error-popup__close');
    
    currentLocationReceiveBtn.addEventListener('click', getLocation)
    function getLocation(){
		navigator.geolocation.getCurrentPosition(function(position){
			let positionString;
			lat = position.coords.latitude
			lng = position.coords.longitude
			positionString = `${lat},${lng}`;
			serverDataLoad(positionString);
		}, function(error){
			console.log(error)
			if(error.PERMISSION_DENIED){
				let positionString;
				lat = 50.459282825465216; 
				lng = 30.5244211269982;
				positionString = `${lat},${lng}`;
				errorPopup(error);
				serverDataLoad(positionString);
			}
		});
    }
    getLocation();
    
    searchBtn.addEventListener('click', searchLocation);
    function searchLocation(){
    	let positionString;
    	const inputSearch = document.querySelector('#input-search').value;
    	positionString = `${inputSearch}`;
    	serverDataLoad(positionString)
    	console.log(positionString)
    }

    function serverDataLoad(currentLocation){
    	apiKey = `http://api.weatherapi.com/v1/forecast.json?key=c16e7bedbb884ea396c65303230502&q=${currentLocation}&days=4&aqi=yes`;
		fetch(apiKey)
	    .then(response => {
	    	return response.json();
	    })
	    .then(data =>{
	    	renderData(data);
	    	showAppContent();
	    });
    }
	
    function renderData(data){
    	console.log(data);
    	let apiLocationCountry = data.location.country;
    	let apiWeatherStatusIconMain = data.current.condition.icon;
    	let apiLocationCity = data.location.name;
    	let apiTemperatureC = data.current.temp_c;
    	let apiTemperatureF = data.current.temp_f;
    	let apiDate = data.location.localtime;
    	let apiWind = data.current.wind_kph;
    	let apiHum = data.current.humidity;
    	let apiWeatherStatus = data.current.condition.text;
    	let apiWeatherStatusCode = data.current.condition.code;
    	let apiWeatherStatusIcon = data.current.condition.icon;
    	let apiForecastArr = data.forecast.forecastday
    	let apitSunriseTitle = apiForecastArr[0].astro.sunrise;
    	let apitSunsetTitle = apiForecastArr[0].astro.sunset;
    	let apitMoonriseTitle = apiForecastArr[0].astro.moonrise;
    	let apiUsAirIndex = data.current.air_quality['us-epa-index'];
    	let apiGbAirIndex = data.current.air_quality['gb-defra-index'];
    	let apiUnixTime = data.location.localtime_epoch;
    	
    	currentLocation.innerHTML = `${apiLocationCity} ${apiLocationCountry}`;
    	currentConditionIcon.src = `${apiWeatherStatusIconMain.replace(/^.{21}/, '')}`
    	currentTemperature.innerHTML = `${apiTemperatureC} C`;
    	currentWind.innerHTML = `${apiWind} kph`;
    	currentHum.innerHTML = `${apiHum} %`;
    	currentWeathertatus.innerHTML = `${apiWeatherStatus}`;
    	currentWeathertatusImage.src = `${apiWeatherStatusIcon.replace(/^.{21}/, '')}`
    	currentUsEpaInder.innerHTML = `${apiUsAirIndex}`
		currentGbDefraInder.innerHTML = `${apiGbAirIndex}`
		forecastSunriseTime.innerHTML = `${apitSunriseTitle}`;
    	forecastSunsetTime.innerHTML = `${apitSunsetTitle}`;
    	forecastMoonriseTime.innerHTML = `${apitMoonriseTitle}`;

    	forecastRow.innerHTML = '';
    	apiForecastArr.forEach(function(apiForecastArr){
    		let conditionIcon = apiForecastArr.day.condition.icon.replace(/^.{21}/, '');
    		let conditionText = apiForecastArr.day.condition.text
    		let conditioDate = apiForecastArr.date.replace(/^.{5}/, '');
    		let conditionMaxTemp = apiForecastArr.day.maxtemp_c;
    		let conditionMinTemp = apiForecastArr.day.mintemp_c;
    		let forecastBox = document.createElement('div');
    		forecastBox.classList.add('app__forecast-box');
    		forecastBox.innerHTML = `<p class="app__forecast-temperature">${conditionMaxTemp} C</p>
									<p class="app__forecast-mintemperature">${conditionMinTemp} C</p>
									<div class="app__forecast-image">
									<img src="${conditionIcon}" alt="">
									</div>
									<p class="app__forecast-day">${conditioDate}</p>
									<p class="app__forecats-status-sky">${conditionText}</p>`
    		forecastRow.append(forecastBox);
    	});

    	actionBackground(apiWeatherStatusCode);
    	airStatusArrow(apiUsAirIndex, apiGbAirIndex);
    	dateLoad(apiUnixTime);
    }

    function showAppContent(){
    	let appContent = document.querySelector('.content');
    	let preloadWidget = document.querySelector('.preload-widget');
    	appContent.classList.add('activ-content');
    	preloadWidget.classList.add('hide-preloader');
    }

    function actionBackground(weatherStatusCode){
    	if(weatherStatusCode == 1003 || weatherStatusCode == 1006 || weatherStatusCode == 1009){
    		currentWeatherBgVideo.pause()
			currentWeatherBgVideoSourse.src = 'assets/video/overcast.mp4';
			currentWeatherBgVideo.load();
			currentWeatherBgVideo.play();
    	}
    	if(weatherStatusCode == 1030 || weatherStatusCode == 1147 || weatherStatusCode == 1135){
    		currentWeatherBgVideo.pause()
			currentWeatherBgVideoSourse.src = 'assets/video/mist.mp4';
			currentWeatherBgVideo.load();
			currentWeatherBgVideo.play();
    	}
    	if(weatherStatusCode == 1000 ){
    		currentWeatherBgVideo.pause()
			currentWeatherBgVideoSourse.src = 'assets/video/sun.mp4';
			currentWeatherBgVideo.load();
			currentWeatherBgVideo.play();
    	}
    	if(weatherStatusCode == 1063  || weatherStatusCode == 1180 || weatherStatusCode == 1183 || weatherStatusCode == 1186 || weatherStatusCode == 1189 || weatherStatusCode == 1192 || weatherStatusCode == 1195 || weatherStatusCode == 1198 || weatherStatusCode == 1201 || weatherStatusCode == 1240 || weatherStatusCode == 1243 || weatherStatusCode == 1246 || weatherStatusCode == 1273 || weatherStatusCode == 1276){
    		currentWeatherBgVideo.pause()
			currentWeatherBgVideoSourse.src = 'assets/video/rainV2.mp4';
			currentWeatherBgVideo.load();
			currentWeatherBgVideo.play();
    	}
    	if(weatherStatusCode == 1072 || weatherStatusCode == 1087 || weatherStatusCode == 1069 || weatherStatusCode == 1249 || weatherStatusCode == 1252 || weatherStatusCode == 1255 || weatherStatusCode == 1258 || weatherStatusCode == 1261 || weatherStatusCode == 1264 || weatherStatusCode == 1279 || weatherStatusCode == 1282 || weatherStatusCode == 1204  || weatherStatusCode == 1207 || weatherStatusCode == 1117 || weatherStatusCode == 1210 || weatherStatusCode == 1213 || weatherStatusCode == 1216 || weatherStatusCode == 1219 || weatherStatusCode == 1222 || weatherStatusCode == 1225 || weatherStatusCode == 1066 || weatherStatusCode == 1114 || weatherStatusCode == 1150 || weatherStatusCode == 1153 || weatherStatusCode == 1168 || weatherStatusCode == 1171){
    		currentWeatherBgVideo.pause()
			currentWeatherBgVideoSourse.src = 'assets/video/snow2.mp4';
			currentWeatherBgVideo.load();
			currentWeatherBgVideo.play();
    	}
    	if(weatherStatusCode == 1237){
    		currentWeatherBgVideo.pause()
			currentWeatherBgVideoSourse.src = 'assets/video/ice-pellets.mp4';
			currentWeatherBgVideo.load();
			currentWeatherBgVideo.play();
    	}
    }

    function dateLoad(unixTime){
    	let a = new Date(unixTime * 1000);
		let months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
		];
		let year = a.getFullYear();
		let month = months[a.getMonth()];
		let date = a.getDate();
		let day = a.getDay();
		let days = [
  		'Sunday',
  		'Monday',
  		'Tuesday',
  		'Wednesday',
  		'Thursday',
  		'Friday',
  		'Saturday'
		];
		let currentDayUnix = days[day]
		let hour = a.getHours();
		let min = a.getMinutes();
		let sec = a.getSeconds();
		let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		let currentDateUnix = `${date} ${month} ${year}`;

		currentDate.innerHTML = currentDateUnix;
		currentDay.innerHTML = currentDayUnix;
		currentTime.innerHTML = `${hour + ':' + min}`;
    }

    function airStatusArrow(airUs, airGb){
    	let usAr = document.querySelector('.us-ar');
    	let gbAr = document.querySelector('.gb-ar');
    	let usCof = 180/6;
    	let gbCof = 180/10;
    	usAr.style.transform = `rotate(${usCof * airUs}deg)`;
    	gbAr.style.transform = `rotate(${gbCof * airGb}deg)`;

    }

    function errorPopup(nameError){
    	errorPopupElement.classList.add('error-popup_activ');
    	setTimeout(errorPopupClose, 5000)
    }
    function errorPopupClose(){
    	errorPopupElement.classList.remove('error-popup_activ');
    }
    closeErrorPopupElement.addEventListener('click', errorPopupClose);

});







