var PrayTime =
{
    dayOfYear: function (calculateDate) {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = calculateDate - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;

    },

    sunRise: function (tuluTime, declination, latitude, elevationAngle, EoT) {
        var a = 0;
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.calculateLatitude(latitude,declination);
		var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA)) + 1;
        return tuluTime - hra * 4;

    },

    sunSet: function (tuluTime, declination, latitude, elevationAngle, EoT) {
        var a = 0;
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.calculateLatitude(latitude,declination);
		var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA)) + 1;
        return tuluTime + hra * 4;
    },

    /*
	trg
	https://www.analyzemath.com/trigonometry/trigonometric_formulas.html
	cos(X - Y) = cosX cosY + sinX sinY
	cosX cosY = (1/2) [ cos (X - Y) + cos (X + Y) ]
	sinX sinY = (1/2) [ cos (X - Y) - cos (X + Y) ]
	
    ω = the hour angle;
    α = the altitude angle;
    δ = the declination angle;
    φ = observer’s latitude.

    sinα = sinδ * sin φ + cosδ * cos ω * cos φ 
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  

    */

    dawnTime: function (tuluTime, declination, latitude, elevationAngle) {
  		
		var a = PrayTime.degToRad(-18);
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.calculateLatitude(latitude,declination);
        var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA));
        return PrayTime.decimalToHour(tuluTime - hra * 4);
    },


    fajrBeginTime: function (tuluTime, declination, latitude, elevationAngle) {
        //calc with sunrise elevationAngle
        //sinα = sinδ * sin φ + cosδ * cos ω * cos φ 
        var a = PrayTime.degToRad(-9);
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.calculateLatitude(latitude,declination);
		var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA));
        return PrayTime.decimalToHour(tuluTime - hra * 4);

    },

    fajrEndTime: function (sunRise) {
        return PrayTime.decimalToHour(sunRise);
    },

    tuluTime: function (longitude, EoT, timezone) {
        var tuluTime = 720;
        if (longitude && EoT) {
            tuluTime = 720 - 4 * longitude - EoT + timezone * 60;
        }
        return tuluTime;
    },

    asrTime: function (tuluTime, declination, latitude, elevationAngle) {
        var a = PrayTime.degToRad(elevationAngle / 2);
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.calculateLatitude(latitude,declination);
		var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));
        var hra = PrayTime.radToDeg(Math.acos(cosHRA));

        return PrayTime.decimalToHour(tuluTime + hra * 4);

    },


    maghribTime: function (sunSet) {
        return PrayTime.decimalToHour(sunSet);
    },


    ishaTime: function (tuluTime, declination, latitude, elevationAngle) {
        var a = PrayTime.degToRad(-9);
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.calculateLatitude(latitude,declination);
		var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA));

        return PrayTime.decimalToHour(tuluTime + hra * 4);
    },


    ishaEndTime: function (tuluTime, declination, latitude, elevationAngle) {
        var a = PrayTime.degToRad(-18);
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.calculateLatitude(latitude,declination);
		var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA));

        return PrayTime.decimalToHour(tuluTime + hra * 4);
    },

    elevationAngle: function (latitude, declination, day) {

        var altitude = 0;
        //https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle
        //α=90+φ−δ
        //altitude = 90-latitude+declination 
        if (day) {
            altitude = 90 - latitude + declination;
        }
        else {
            //night			
            //day and night altitude differences is 2*declination
            altitude = 90 - latitude - declination;
        }
		if(altitude > 90)
			altitude = 180 - altitude;
        return altitude;
    },
	
	declination: function(calculateDate){
		
		/* +4 for (2019-2000)/4 = 4.75 (feb 29)*/
		var sina = 360 / 365 * (PrayTime.dayOfYear(calculateDate) - 81);          
		return 23.45 * Math.sin(PrayTime.degToRad(sina));
	},
	
	equationofTime : function(calculateDate){
		
		//calculate time correction  https://pveducation.org/pvcdrom/properties-of-sunlight/solar-time
		var B = PrayTime.degToRad(360 / 365 * (PrayTime.dayOfYear(calculateDate) - 81));
		var eoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
		return eoT; 
	},
	
	calculateLatitude : function(latitude, declination){
		//declination is positive in summer for north, latitude 45 above is fixed!!
		if (declination > 0 && latitude > 45) {
			latitude = 90 - latitude;
		}

		//declination is negative in summer for south, latitude 45 above is fixed!!
		if (declination < 0 &&latitude < -45) {
			latitude = -90 - latitude;
		}
		
		return PrayTime.degToRad(latitude);
	},

    decimalToHour: function (value) {
		if(isNaN(value))
			return "-";
        value = value / 60;
        var hour = Math.trunc(value);
        if (hour.toString().length == 1)
            hour = "0" + hour;
        var remain = (value - hour) * 60;
        var mninute = Math.trunc(remain);
        if (mninute.toString().length == 1)
            mninute = "0" + mninute;
        var seconds = ((remain - mninute) * 60).toFixed(0);
        if (seconds.toString().length == 1)
            seconds = "0" + seconds;
        return hour + ":" + mninute + ":" + seconds;
    },

    radToDeg: function (angleRad) {
        return (180 * angleRad / Math.PI);
    },

    degToRad: function (angleDeg) {
        return (Math.PI * angleDeg / 180);
    },

    formatDate: function (calculateDate) {
        var dd = calculateDate.getDate();
        var mm = calculateDate.getMonth() + 1; //January is 0!

        var yyyy = calculateDate.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + '/' + mm + '/' + yyyy;
    }
	
};

var UserLocation =
{
    //default value is istanbul
    latitude: 41.005,
    longitude: 28.9,

    getLocation: function (callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                UserLocation.latitude = position.coords.latitude;
                UserLocation.longitude = position.coords.longitude;
                console.log("lat long", UserLocation.latitude, UserLocation.longitude);
                if (callback) {
                    callback();
                }
            },
            function (error) {
                console.log("no permission");
                if (callback) {
                    callback();
                }
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            if (callback) {
                callback();
            }
        }
    }
}