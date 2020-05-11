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

    sunRise: function (tulutime, declination) {
        var sunrise = 4 * (90 + declination)
        return tulutime - sunrise;
    },

    sunSet: function (tulutime, declination) {
        var sunset = 4 * (90 + declination)
        return tulutime + sunset;
    },

    /*
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
        var l = PrayTime.degToRad(latitude);
        var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA));

        return PrayTime.decimalToHour(tuluTime - hra * 4);
    },


    fajrBeginTime: function (tuluTime, declination, latitude, elevationAngle) {

        var a = PrayTime.degToRad(-9);
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.degToRad(latitude);
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
        var l = PrayTime.degToRad(latitude);
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
        var l = PrayTime.degToRad(latitude);
        var cosHRA = (Math.sin(a) - Math.sin(d) * Math.sin(l)) / (Math.cos(d) * Math.cos(l));

        var hra = PrayTime.radToDeg(Math.acos(cosHRA));

        return PrayTime.decimalToHour(tuluTime + hra * 4);
    },


    ishaEndTime: function (tuluTime, declination, latitude, elevationAngle) {
        var a = PrayTime.degToRad(-18);
        var d = PrayTime.degToRad(declination);
        var l = PrayTime.degToRad(latitude);
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
        return altitude;
    },

    decimalToHour: function (value) {
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
}