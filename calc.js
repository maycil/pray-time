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

    sunRise: function (tuluTime, declination, latitude, EoT) {
        var a = PrayTime.getRadian(-1);
        var d = PrayTime.getRadian(declination);
        var l = PrayTime.calculateLatitude(latitude);
        var hra = PrayTime.calculateHourAngle(a,d,l);
        
		return tuluTime - hra * 4;
    },

    sunSet: function (tuluTime, declination, latitude, EoT) {
        var a = PrayTime.getRadian(-1);
        var d = PrayTime.getRadian(declination);
        var l = PrayTime.calculateLatitude(latitude);
		var hra = PrayTime.calculateHourAngle(a,d,l);
        
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

    dawnTime: function (tuluTime, declination, latitude) {  		
		var a = PrayTime.getRadian(-18);
        var d = PrayTime.getRadian(declination);
        var l = PrayTime.calculateLatitude(latitude);
		var hra = PrayTime.calculateHourAngle(a,d,l); 
        
		return PrayTime.decimalToHour(tuluTime - hra * 4);
    },


    fajrBeginTime: function (tuluTime, declination, latitude) {
        //sinα = sinδ * sin φ + cosδ * cos ω * cos φ 
        var a = PrayTime.getRadian(-9);
        var d = PrayTime.getRadian(declination);
        var l = PrayTime.calculateLatitude(latitude);
		var hra = PrayTime.calculateHourAngle(a,d,l);
		
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

    asrTime: function (tuluTime, declination, latitude) {

        //sun set calc
		//var a = PrayTime.getRadian(-1);
        var d = PrayTime.getRadian(declination);
        var l = PrayTime.calculateLatitude(latitude);
        var a = Math.atan(1 / (1 + Math.tan(l - d)));
		var hra = PrayTime.calculateHourAngle(a,d,l);
		
        return PrayTime.decimalToHour(tuluTime + hra * 4);

    },


    maghribTime: function (sunSet) {
        return PrayTime.decimalToHour(sunSet);
    },


    ishaTime: function (tuluTime, declination, latitude) {
        var a = PrayTime.getRadian(-9);
        var d = PrayTime.getRadian(declination);
        var l = PrayTime.calculateLatitude(latitude);
		var hra = PrayTime.calculateHourAngle(a,d,l);
		
		return PrayTime.decimalToHour(tuluTime + hra * 4);
    },


    ishaEndTime: function (tuluTime, declination, latitude) {
        var a = PrayTime.getRadian(-18);
        var d = PrayTime.getRadian(declination);
        var l = PrayTime.calculateLatitude(latitude);
		var hra = PrayTime.calculateHourAngle(a,d,l);
		
		return PrayTime.decimalToHour(tuluTime + hra * 4);
    },

    elevationAngle: function (latitude, declination, day) {

        var altitude = 0;
        //https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle
        //α=90+φ−δ 
        if (day) {
            altitude = 90 + latitude - declination;
			if(altitude > 90)
				altitude = 180 - altitude;
        }
        else {
            //night			
            //day and night altitude differences is 2*declination
            altitude = 90 + latitude + declination;
			if(altitude > 90)
				altitude = altitude - 180;
        }
		
        return altitude;
    },
	
	declination: function(calculateDate){		
		/* +4 for (2019-2000)/4 = 4.75 (feb 29)*/
		var sina = 360 / 365 * (PrayTime.dayOfYear(calculateDate) - 81);          
		return 23.45 * Math.sin(PrayTime.getRadian(sina));
	},
	
	equationofTime : function(calculateDate){		
		//calculate time correction  https://pveducation.org/pvcdrom/properties-of-sunlight/solar-time
		var B = PrayTime.getRadian(360 / 365 * (PrayTime.dayOfYear(calculateDate) - 81));
		var eoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
		return eoT; 
	},
	
	calculateLatitude : function(latitude){
		if (latitude > 45) {
			latitude = 90 - latitude;
		}

		if (latitude < -45) {
			latitude = -90 - latitude;
		}
		
		return PrayTime.getRadian(latitude);
	},
	
	calculateHourAngle : function(altitude, declination,latitude){
		var cosHRA = Math.acos((Math.sin(altitude) - Math.sin(declination) * Math.sin(latitude)) / (Math.cos(declination) * Math.cos(latitude)));
		return PrayTime.getDegree(cosHRA);		
	},

    decimalToHour: function (value) {
		if(isNaN(value))
			return "-";
        value = value / 60;
        var hour = Math.trunc(value);
        var remain = (value - hour) * 60;
        var minute = Math.trunc(remain);
        var seconds = ((remain - minute) * 60).toFixed(0);
        if (seconds > 1)
		{
            minute = parseInt(minute) + 1;
			if(minute == 60)
			{
				hour = parseInt(hour) + 1;
				minute = 0;
			}
		}
        if (hour.toString().length == 1)
            hour = "0" + hour;
       
	   if (minute.toString().length == 1)
            minute = "0" + minute;
        
		return hour + ":" + minute;
    },

    getDegree: function (radianAngle) {
        return (180 * radianAngle / Math.PI);
    },

    getRadian: function (degreeAngle) {
        return (Math.PI * degreeAngle / 180);
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
