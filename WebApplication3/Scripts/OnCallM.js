var OnCall = {
    Groups:[],
    DrawMonth: function (Groups, Data, Days, Month, Year, Entity, Department) {
        OnCall.Groups = Groups;
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthShorts = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var monthName = monthNames[Number(Month)];
        var monthShort = monthShorts[Number(Month)];
        var app = document.getElementById("App");
        OnCall.DrawTopBar(app, monthName, monthShort, Month, Year, Entity, Department);
        OnCall.drawCalender(app, Data, Days, Month, Year);
    },
    MonthCalanderX: null,
    MonthCalanderY:null,
    getTouches:function(evt) {
        return evt.touches ||             // browser API
               evt.originalEvent.touches;
    },
    handleTouchStart: function(evt) {
        if (document.getElementById('main')) {
            return;
        }
        const firstTouch = OnCall.getTouches(evt)[0];
        OnCall.MonthCalanderX = firstTouch.clientX;
        OnCall.MonthCalanderY = firstTouch.clientY;
    },
       
    CalanderInHalf:"N",
    handleTouchMove:function(evt) {
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
        var xDiff = xUp - OnCall.MonthCalanderX;
        var getCanvas = document.getElementById("Site");
        var getIcon = document.getElementById("right");
        var DropDowned = document.getElementById('menuNav');
        var YDiff = yUp - OnCall.MonthCalanderY;
        var getApp = document.getElementById("MonthCalander");
        var test = getApp.offsetHeight * 0.3;
        // to slide drop down menu back

        if (YDiff > test) {
            console.log(YDiff);
            getApp.style.height = "94.9%";
            getApp.style.paddingBottom = "0%";
            OnCall.CalanderInHalf = "N";
        }
        if (YDiff < -test) {
            console.log(YDiff);
            getApp.style.height = "49.9%";
            getApp.style.paddingBottom = "1%";
            OnCall.CalanderInHalf = "Y";
        }
        
    },
    drawCalender: function (Elem, Data, Days, Month, Year) {
        var MonthCalander = GHVHS.DOM.create({ "Type": "div", "Class": "MonthCalander", "Id": "MonthCalander", "Parent": Elem });
        MonthCalander.addEventListener('touchstart', OnCall.handleTouchStart);
        MonthCalander.addEventListener('touchmove', OnCall.handleTouchMove, false);
        var DaysOfTheWeek = ["S", "M", "T", "W", "T", "F", "S"];
        var WeekDaysContainer = GHVHS.DOM.create({ "Type": "div", "Class": "WeekDaysContainer", "Id": "WeekDaysContainer", "Parent": MonthCalander });
        for (var i = 0; i < DaysOfTheWeek.length; i++){
            DayName = GHVHS.DOM.create({ "Type": "div", "Class": "DayName", "Id": i + "", "Parent": WeekDaysContainer });
            DayName.innerHTML = DaysOfTheWeek[i];
        }
        var DaysOfTheMonth = GHVHS.DOM.create({ "Type": "div", "Class": "DaysOfTheMonth", "Id": "DaysOfTheMonth", "Parent": MonthCalander });
        var d = new Date(Year, Month, 1);
        var n = d.getDay();
        if (n > 0) {
            var monthToCheck = Month - 1;
            if (Month == 0) {
                monthToCheck = 12;
                Year = Year - 1;
            }
            var daysinPastMonth = new Date(Year, monthToCheck, 0).getDate();
            var startDayOfPastMonth = (daysinPastMonth) - (n);
            for (var i = startDayOfPastMonth; i < daysinPastMonth; i++) {
                SingleMonthDay = GHVHS.DOM.create({ "Type": "div", "Class": "SingleMonthDay", "Id": "SingleMonthDay", "Parent": MonthCalander });
                DayLabelOld = GHVHS.DOM.create({ "Type": "div", "Class": "DayLabelOld", "Id": "DayLabelOld", "Parent": SingleMonthDay });
                DayLabelOld.innerHTML = i + "";
            }
        }
        for (var i = 1; i < Days; i++) {
            SingleMonthDay = GHVHS.DOM.create({ "Type": "div", "Class": "SingleMonthDay", "Id": "SingleMonthDay", "Parent": MonthCalander });
            SingleMonthDay.id = Month + "/" + i + "/" + Year;
            DayLabel = GHVHS.DOM.create({ "Type": "div", "Class": "DayLabel", "Id": "DayLabel", "Parent": SingleMonthDay });
            DayLabel.innerHTML = i + "";
                SingleMonthDay.onclick = function(){
                    var getOld = this.parentElement.querySelectorAll(".SingleMonthDaySelected");
                    for (var i = 0; i < getOld.length; i++) {
                        getOld[i].className = "SingleMonthDay";
                        var getDayLabel = getOld[i].querySelector(".DayLabelSelected");
                        getDayLabel.className = "DayLabel";
                        var getDayLabelOlf= getOld[i].querySelector(".ScheduleForDay");
                        if (getDayLabelOlf){
                            getDayLabelOlf.style.backgroundColor = "rgba(64, 0, 23,0.2)";
                            getDayLabelOlf.style.color = "rgba(64, 0, 23,0.8)";
                        }
                    }
                    this.className = "SingleMonthDaySelected";
                    var getDayLabel = this.querySelector(".DayLabel");
                    getDayLabel.className = "DayLabelSelected";
                    var getDayLabel = this.querySelector(".ScheduleForDay");
                    if (getDayLabel){
                        getDayLabel.style.backgroundColor = "blue";
                        getDayLabel.style.color = "white";
                    }
                    if (OnCall.CalanderInHalf == "Y") {
                        if (getDayLabel){
                            OnCall.DrawBottom(this, getDayLabel.id);
                        }else{
                            OnCall.DrawBottom(this);
                        }

                    } else {
                        if (getDayLabel) {
                            OnCall.DrawSlideUpDay(this, getDayLabel.id);
                            OnCall.DrawBottom(this, getDayLabel.id);
                        } else {
                            OnCall.DrawSlideUpDay(this);
                            OnCall.DrawBottom(this);
                        }
                    }
                }
            for (var j = 0; j < Data.OnCall.length; j++) {
                start = Data.OnCall[j].Fields.StartTime;
                end = Data.OnCall[j].Fields.EndTime;
                currentDate2 = Month + "/" + i + "/" + Year + " 0:00:01 AM";
                currentDate1 = Month + "/" + i + "/" + Year + " 11:59:59 PM"
                if (dates.inRange(currentDate1, start, end) || dates.inRange(currentDate2, start, end)) {
                    var external = Data.OnCall[j].Fields.ExternalID;
                    var personName = "";
                    for (var k = 0; k < Data.Person.length; k++) {
                        if (Data.Person[k].Fields.ExternalID == external) {
                            personName = Data.Person[k].Fields.FirstName + " " + Data.Person[k].Fields.LastName;
                        }
                    }
                    ScheduleForDay = GHVHS.DOM.create({ "Type": "div", "Class": "ScheduleForDay", "Id": "ScheduleForDay", "Parent": SingleMonthDay });
                    ScheduleForDay.innerHTML = personName;
                    ScheduleForDay.id = "" + j;
                }
            }
        }
    },
    SULX: 0,
    SULY: 0,
    InTransitionSlide:"N",
    handleTouchStartSUL: function (evt) {
        if (document.getElementById('main')) {
            return;
        }
        const firstTouch = OnCall.getTouches(evt)[0];
        OnCall.SULX = firstTouch.clientX;
        OnCall.SULY = firstTouch.clientY;
    },
    handleTouchMoveSUL: function (evt) {
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
        var xDiff = xUp - OnCall.SULX;
        var getCanvas = document.getElementById("Site");
        var getIcon = document.getElementById("right");
        var DropDowned = document.getElementById('menuNav');
        var YDiff = yUp - OnCall.SULY;
        var getApp = document.getElementById("MonthCalander");
        var test = getApp.offsetWidth * 0.3;
        // to slide drop down menu back
        if (OnCall.InTransitionSlide == "N") {
            if (xDiff > test) {
                OnCall.InTransitionSlide = "Y";
                var getSlideUp = "";
                if (document.getElementById("SlideFromRightDay")) {
                    getSlideUp = document.getElementById("SlideFromRightDay");
                } else if (document.getElementById("SlideFromLeftDay")) {
                    getSlideUp = document.getElementById("SlideFromLeftDay");
                } else if (document.getElementById("SlideUpDay")) {
                    getSlideUp = document.getElementById("SlideUpDay");
                }
                var getDate = getSlideUp.querySelector(".DateSchedule");
                var tempDate = new Date(getDate.id);
                tempDate.setDate(tempDate.getDate() - 1);
                var formateed = dates.getFormattedDate(tempDate);
                var dateElem = document.getElementById(formateed);
                OnCall.DrawSlideUpFromRight(dateElem);
                getSlideUp.style.left = "100%";
                setTimeout(function () {
                    OnCall.InTransitionSlide = "N";
                    var getApp = document.getElementById("backg");
                    getApp.removeChild(getSlideUp);
                }, 200);
            }
            if (xDiff < -test) {
                OnCall.InTransitionSlide = "Y";
                var getSlideUp = "";
                if (document.getElementById("SlideFromRightDay")) {
                    getSlideUp = document.getElementById("SlideFromRightDay");
                } else if (document.getElementById("SlideFromLeftDay")) {
                    getSlideUp = document.getElementById("SlideFromLeftDay");
                } else if (document.getElementById("SlideUpDay")) {
                    getSlideUp = document.getElementById("SlideUpDay");
                }
                var getDate = getSlideUp.querySelector(".DateSchedule");
                var tempDate = new Date(getDate.id);
                tempDate.setDate(tempDate.getDate() + 1);
                var formateed = dates.getFormattedDate(tempDate);
                var dateElem = document.getElementById(formateed);
                OnCall.DrawSlideUpFromRight(dateElem, "Y");
                getSlideUp.style.left = "-100%";
                setTimeout(function () {
                    OnCall.InTransitionSlide = "N";
                    var getApp = document.getElementById("backg");
                    getApp.removeChild(getSlideUp);
                }, 200);
            }
        }

    },
    DrawSlideUpDay: function (DateElem, DataIndex, date) {
        var date = DateElem.id;
        var getApp = document.getElementById("App");
        var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "backg", "Style": "z-index:7000000000000000000000000009;", "Parent": getApp });
        backg.addEventListener('touchstart', OnCall.handleTouchStartSUL);
        backg.addEventListener('touchmove', OnCall.handleTouchMoveSUL, false);
        var X = GHVHS.DOM.create({ "Type": "img", "Class": "whiteX2", "Id": "whiteX", "Src": "/img/xWhite.png", "Parent": backg });
        X.onclick = function () {
            getApp.removeChild(backg);
        }
        SlideUpDay = GHVHS.DOM.create({ "Type": "div", "Class": "SlideUpDay", "Id": "SlideUpDay", "Parent": backg });
        DateHeader = GHVHS.DOM.create({ "Type": "div", "Class": "DateHeader", "Id": "DateHeader", "Content": date, "Parent": SlideUpDay });
        DateHeader.style.backgroundColor = "rgba(64, 0, 23,0.95)";
        DateHeader.style.height = "6%";
        DateHeader.style.borderTopRightRadius = "10px";
        DateHeader.style.borderTopLeftRadius = "10px";
        DateSchedule = GHVHS.DOM.create({ "Type": "div", "Class": "DateSchedule", "Id": "DateSchedule", "Parent": SlideUpDay });
        DateSchedule.style.height = "93.7%";
        var Schedule = GHVHS.DOM.create({ "Type": "div", "Class": "Schedule", "Id": "Schedule", "Parent": DateSchedule });
        var TimesCol = GHVHS.DOM.create({ "Type": "div", "Class": "TimesCol", "Id": "TimesCol", "Parent": Schedule });
        for (var i = 0; i < 25; i++) {

            var HourLabel = GHVHS.DOM.create({ "Type": "div", "Class": "HourLabel", "Id": "HourLabel", "Parent": TimesCol });
            if (i == 0) {
                HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>AM</span>";
            } else if (i > 12) {
                if (i == 24) {
                    HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>AM</span>";

                } else {
                    HourLabel.innerHTML = i % 12 + "<span style = 'font-size:70%;'>PM</span>";

                }
            } else {
                if (i == 12) {
                    HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>PM</span>";

                } else {
                    HourLabel.innerHTML = i + "<span style = 'font-size:70%;'>AM</span>";

                }
            }
            HourLabel.id = i + "Hour";
        }
        var DateCol = GHVHS.DOM.create({ "Type": "div", "Class": "DateCol", "Id": "DateCol", "Parent": Schedule });

        for (var j = 0; j < Data.OnCall.length; j++) {
            start = Data.OnCall[j].Fields.StartTime;
            end = Data.OnCall[j].Fields.EndTime;
            currentDate2 = date + " 0:00:01 AM";
            currentDate1 = date + " 11:59:59 PM"
            if (dates.inRange(currentDate1, start, end) || dates.inRange(currentDate2, start, end)) {

                var external = Data.OnCall[j].Fields.ExternalID;
                var personName = "";
                var Title = "";
                var DeptDescription = "";
                for (var k = 0; k < Data.Person.length; k++) {
                    if (Data.Person[k].Fields.ExternalID == external) {
                        personName = Data.Person[k].Fields.FirstName + " " + Data.Person[k].Fields.LastName;
                        DeptDescription = Data.Person[k].Fields.DeptDescription;
                        Title = Data.Person[k].Fields.Title;
                    }
                }
                var phone = "";
                for (var k = 0; k < Data.Phone.length; k++) {
                    if (Data.Phone[k].Fields.ExternalID == external) {
                        phone += Data.Phone[k].Fields.PhoneDescription + ": <a style='color:white;' href='callto:" + Data.Phone[k].Fields.PhoneNumber + "'>" + Data.Phone[k].Fields.PhoneNumber + "</a><br>";
                    }
                }
                /* allSubInfo = GHVHS.DOM.create({ "Type": "div", "Class": "allSubInfo", "Id": "allSubInfo", "Parent": DateSchedule });
                 SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Id": "SingleInfo", "Parent": allSubInfo });
                 SingleInfo.innerHTML = personName;
                 SingleInfo2 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "SingleInfo", "Parent": allSubInfo });
                 SingleInfo2.innerHTML = Title;
                 SingleInfo3 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "SingleInfo", "Parent": allSubInfo });
                 SingleInfo3.innerHTML = DeptDescription;
                 contactInfo = GHVHS.DOM.create({ "Type": "div", "Class": "contactInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "contactInfo", "Parent": DateSchedule });
                 contactInfo.innerHTML = phone;
                 ScheduleForDay = GHVHS.DOM.create({ "Type": "div", "Class": "ScheduleForDay", "Style": "background-color:white;", "Id": "ScheduleForDay", "Parent": DateSchedule });
                 Time = GHVHS.DOM.create({ "Type": "div", "Class": "Time", "Id": "Time", "Parent": ScheduleForDay });*/

                var Tstart = Data.OnCall[j].Fields.StartTime;
                var Tend = Data.OnCall[j].Fields.EndTime;
                var S = new Date(date);

                OnCall.formatDate(S.toString());
                var getRange = OnCall.calHoursPerDay(Tstart, Tend, OnCall.formatDate(S.toString()) + " 0:00:01 AM", OnCall.formatDate(S.toString()) + " 11:59:59 PM");
                var getTimeOne = Number(new Date(getRange[0]).getHours());
                if (getTimeOne == 0) {
                    getTimeOne = 1;
                }
                var getTimeTwo = Number(new Date(getRange[1]).getHours());
                if (getTimeTwo == 0) {
                    getTimeTwo = 24;
                }
                if (document.getElementById("coloredHour1")) {
                    var coloredHour = GHVHS.DOM.create({ "Type": "div", "Class": "coloredHour2", "Id": "coloredHour2", "Parent": DateCol });
                } else {
                    var coloredHour = GHVHS.DOM.create({ "Type": "div", "Class": "coloredHour", "Id": "coloredHour1", "Parent": DateCol });
                }

                var getElem = document.getElementById(getTimeTwo + "Hour")
                if (getTimeTwo == 24) {
                    coloredHour.style.height = (25.5 * 30) + "px";
                } else {
                    coloredHour.style.height = ((getTimeTwo) * 31.5) + "px";
                }
                if ((coloredHour.offsetTop + (getTimeTwo) * 31.5) > (25.5 * 30)) {
                    coloredHour.style.height = ((26.5 * 30) - coloredHour.offsetTop) + "px";
                }
                coloredHour.innerHTML = personName + "<br><br>" + getRange[0] + "<br> - <br> " + getRange[1];


            }
        }
        DateSchedule.id = date;
    },
    DrawSlideUpFromRight: function (DateElem, FromLeft) {
        var date = DateElem.id;
        if (FromLeft) {
            SlideFromRightDay = GHVHS.DOM.create({ "Type": "div", "Class": "SlideFromRightDay", "Id": "SlideFromRightDay", "Parent": document.getElementById("backg") });
        } else {
            SlideFromRightDay = GHVHS.DOM.create({ "Type": "div", "Class": "SlideFromLeftDay", "Id": "SlideFromLeftDay", "Parent": document.getElementById("backg") });
        }
        DateHeader = GHVHS.DOM.create({ "Type": "div", "Class": "DateHeader", "Id": "DateHeader", "Content": date + "", "Parent": SlideFromRightDay });
        DateHeader.style.backgroundColor = "rgba(64, 0, 23,0.95)";
        DateHeader.style.height = "6%";
        DateHeader.style.borderTopRightRadius = "10px";
        DateHeader.style.borderTopLeftRadius = "10px";
        DateSchedule = GHVHS.DOM.create({ "Type": "div", "Class": "DateSchedule", "Id": "DateSchedule", "Parent": SlideFromRightDay });
        DateSchedule.style.height = "93.7%";
        var Schedule = GHVHS.DOM.create({ "Type": "div", "Class": "Schedule", "Id": "Schedule", "Parent": DateSchedule });
        var TimesCol = GHVHS.DOM.create({ "Type": "div", "Class": "TimesCol", "Id": "TimesCol", "Parent": Schedule });
        for (var i = 0; i < 25; i++) {

            var HourLabel = GHVHS.DOM.create({ "Type": "div", "Class": "HourLabel", "Id": "HourLabel", "Parent": TimesCol });
            if (i == 0) {
                HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>AM</span>";
            } else if (i > 12) {
                if (i == 24) {
                    HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>AM</span>";

                } else {
                    HourLabel.innerHTML = i % 12 + "<span style = 'font-size:70%;'>PM</span>";

                }
            } else {
                if (i == 12) {
                    HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>PM</span>";

                } else {
                    HourLabel.innerHTML = i + "<span style = 'font-size:70%;'>AM</span>";

                }
            }
            HourLabel.id = i + "Hour";
        }
        var DateCol = GHVHS.DOM.create({ "Type": "div", "Class": "DateCol", "Id": "DateCol", "Parent": Schedule });

        for (var j = 0; j < Data.OnCall.length; j++) {
            start = Data.OnCall[j].Fields.StartTime;
            end = Data.OnCall[j].Fields.EndTime;
            currentDate2 = date + " 0:00:01 AM";
            currentDate1 = date + " 11:59:59 PM"
            if (dates.inRange(currentDate1, start, end) || dates.inRange(currentDate2, start, end)) {

                var external = Data.OnCall[j].Fields.ExternalID;
                var personName = "";
                var Title = "";
                var DeptDescription = "";
                for (var k = 0; k < Data.Person.length; k++) {
                    if (Data.Person[k].Fields.ExternalID == external) {
                        personName = Data.Person[k].Fields.FirstName + " " + Data.Person[k].Fields.LastName;
                        DeptDescription = Data.Person[k].Fields.DeptDescription;
                        Title = Data.Person[k].Fields.Title;
                    }
                }
                var phone = "";
                for (var k = 0; k < Data.Phone.length; k++) {
                    if (Data.Phone[k].Fields.ExternalID == external) {
                        phone += Data.Phone[k].Fields.PhoneDescription + ": <a style='color:white;' href='callto:" + Data.Phone[k].Fields.PhoneNumber + "'>" + Data.Phone[k].Fields.PhoneNumber + "</a><br>";
                    }
                }
                /* allSubInfo = GHVHS.DOM.create({ "Type": "div", "Class": "allSubInfo", "Id": "allSubInfo", "Parent": DateSchedule });
                 SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Id": "SingleInfo", "Parent": allSubInfo });
                 SingleInfo.innerHTML = personName;
                 SingleInfo2 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "SingleInfo", "Parent": allSubInfo });
                 SingleInfo2.innerHTML = Title;
                 SingleInfo3 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "SingleInfo", "Parent": allSubInfo });
                 SingleInfo3.innerHTML = DeptDescription;
                 contactInfo = GHVHS.DOM.create({ "Type": "div", "Class": "contactInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "contactInfo", "Parent": DateSchedule });
                 contactInfo.innerHTML = phone;
                 ScheduleForDay = GHVHS.DOM.create({ "Type": "div", "Class": "ScheduleForDay", "Style": "background-color:white;", "Id": "ScheduleForDay", "Parent": DateSchedule });
                 Time = GHVHS.DOM.create({ "Type": "div", "Class": "Time", "Id": "Time", "Parent": ScheduleForDay });*/

                var Tstart = Data.OnCall[j].Fields.StartTime;
                var Tend = Data.OnCall[j].Fields.EndTime;
                var S = new Date(date);

                OnCall.formatDate(S.toString());
                var getRange = OnCall.calHoursPerDay(Tstart, Tend, OnCall.formatDate(S.toString()) + " 0:00:01 AM", OnCall.formatDate(S.toString()) + " 11:59:59 PM");
                var getTimeOne = Number(new Date(getRange[0]).getHours());
                if (getTimeOne == 0) {
                    getTimeOne = 1;
                }
                var getTimeTwo = Number(new Date(getRange[1]).getHours());
                if (getTimeTwo == 0) {
                    getTimeTwo = 24;
                }
                if (document.getElementById("coloredHour1")) {
                    var coloredHour = GHVHS.DOM.create({ "Type": "div", "Class": "coloredHour2", "Id": "coloredHour2", "Parent": DateCol });
                } else {
                    var coloredHour = GHVHS.DOM.create({ "Type": "div", "Class": "coloredHour", "Id": "coloredHour1", "Parent": DateCol });
                }

                var getElem = document.getElementById(getTimeTwo + "Hour")
                if (getTimeTwo == 24) {
                    coloredHour.style.height = (25.5 * 30) + "px";
                } else {
                    coloredHour.style.height = ((getTimeTwo) * 31.5) + "px";
                }
                if ((coloredHour.offsetTop + (getTimeTwo) * 31.5) > (25.5 * 30)) {
                    coloredHour.style.height = ((26.5 * 30) - coloredHour.offsetTop) + "px";
                }
                coloredHour.innerHTML = personName + "<br><br>" + getRange[0] + "<br> - <br> " + getRange[1];


            }
        }
         DateSchedule.id = date;
        
    },
    BottomX: 0,
    BottomY: 0,
    BottomTransitionSlide: "N",
    handleTouchStartBottom: function (evt) {
        if (document.getElementById('main')) {
            return;
        }
        const firstTouch = OnCall.getTouches(evt)[0];
        OnCall.BottomX = firstTouch.clientX;
        OnCall.BottomY = firstTouch.clientY;
    },
    handleTouchMoveBottom: function (evt) {
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
        var xDiff = xUp - OnCall.BottomX;
        var getCanvas = document.getElementById("Site");
        var getIcon = document.getElementById("right");
        var DropDowned = document.getElementById('menuNav');
        var YDiff = yUp - OnCall.BottomY;
        var getApp = document.getElementById("MonthCalander");
        var test = getApp.offsetWidth * 0.3;
        // to slide drop down menu back
        if (OnCall.BottomY > getApp.offsetHeight * 0.5) {
            if (OnCall.BottomTransitionSlide == "N") {
                if (xDiff > test) {
                    OnCall.BottomTransitionSlide = "Y";
                    var getSlideUp = "";
                    if (document.getElementById("BottomContainerRight")) {
                        getSlideUp = document.getElementById("BottomContainerRight");
                    } else if (document.getElementById("BottomContainer")) {
                        getSlideUp = document.getElementById("BottomContainer");
                    } else if (document.getElementById("BottomContainerLeft")) {
                        getSlideUp = document.getElementById("BottomContainerLeft");
                    }
                    var getDate = getSlideUp.querySelector(".DateSchedule");
                    var tempDate = new Date(getDate.id);
                    tempDate.setDate(tempDate.getDate() - 1);
                    var formateed = dates.getFormattedDate(tempDate);
                    var dateElem = document.getElementById(formateed);
                    getSlideUp.className = "BottomContainer";
                    setTimeout(function () {
                        OnCall.DrawBottom(dateElem, "", "Left");
                    }, 15);
                    setTimeout(function () {
                        OnCall.BottomTransitionSlide = "N";
                        //var getApp = document.getElementById("App");
                        //getApp.removeChild(getSlideUp);
                    }, 200);
                }
                if (xDiff < -test) {
                    OnCall.BottomTransitionSlide = "Y";
                    var getSlideUp = "";
                    if (document.getElementById("BottomContainerRight")) {
                        getSlideUp = document.getElementById("BottomContainerRight");
                    } else if (document.getElementById("BottomContainer")) {
                        getSlideUp = document.getElementById("BottomContainer");
                    } else if (document.getElementById("BottomContainerLeft")) {
                        getSlideUp = document.getElementById("BottomContainerLeft");
                    }
                    var getDate = getSlideUp.querySelector(".DateSchedule");
                    var tempDate = new Date(getDate.id);
                    tempDate.setDate(tempDate.getDate() + 1);
                    var formateed = dates.getFormattedDate(tempDate);
                    var dateElem = document.getElementById(formateed);
                    getSlideUp.className = "BottomContainer";
                    setTimeout(function () {
                        OnCall.DrawBottom(dateElem, "", "Right");
                    }, 15);
                    
                    setTimeout(function () {
                        OnCall.BottomTransitionSlide = "N";
                        //var getApp = document.getElementById("App");
                        //getApp.removeChild(getSlideUp);
                    }, 200);
                }
            }
        }
    },
    DrawBottom: function (DateElem, DataIndex, ContainerType) {
        var BottomContainer = "";
        var DateHeader = "";
        var DateSchedule = "";
        var date = DateElem.id;
        if (document.getElementById("BottomContainer")) {
            var temp = document.getElementById("BottomContainer");
            if (ContainerType) {
                if (ContainerType == "Left") {
                    temp.className = "BottomContainerLeft";
                } else if (ContainerType == "Right") {
                    temp.className = "BottomContainerRight";

                }
            }
            while (temp.firstChild) {
                temp.removeChild(temp.firstChild);
            }
            BottomContainer = temp;
        } else {
            var getApp = document.getElementById("App");
            BottomContainer = GHVHS.DOM.create({ "Type": "div", "Class": "BottomContainer", "Id": "BottomContainer", "Parent": getApp });
            getApp.addEventListener('touchstart', OnCall.handleTouchStartBottom);
            getApp.addEventListener('touchmove', OnCall.handleTouchMoveBottom, false);
        }
        


            
            DateHeader = GHVHS.DOM.create({ "Type": "div", "Class": "DateHeader", "Id": "DateHeader","Content":date, "Parent": BottomContainer });
            DateSchedule = GHVHS.DOM.create({ "Type": "div", "Class": "DateSchedule", "Id": "DateSchedule", "Parent": BottomContainer });
            var Schedule = GHVHS.DOM.create({ "Type": "div", "Class": "Schedule", "Id": "Schedule", "Parent": DateSchedule });
            var TimesCol = GHVHS.DOM.create({ "Type": "div", "Class": "TimesCol", "Id": "TimesCol", "Parent": Schedule });
            for (var i = 0; i < 25; i++) {

                var HourLabel = GHVHS.DOM.create({ "Type": "div", "Class": "HourLabel", "Id": "HourLabel", "Parent": TimesCol });
                if (i == 0) {
                    HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>AM</span>";
                } else if (i > 12) {
                    if (i == 24) {
                        HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>AM</span>";

                    } else {
                        HourLabel.innerHTML = i % 12 + "<span style = 'font-size:70%;'>PM</span>";

                    }
                } else {
                    if (i == 12) {
                        HourLabel.innerHTML = 12 + "<span style = 'font-size:70%;'>PM</span>";

                    } else {
                        HourLabel.innerHTML = i + "<span style = 'font-size:70%;'>AM</span>";

                    }
                }
                HourLabel.id = i + "Hour";
            }
            var DateCol = GHVHS.DOM.create({ "Type": "div", "Class": "DateCol", "Id": "DateCol", "Parent": Schedule });
            
            for (var j = 0; j < Data.OnCall.length; j++) {
                start = Data.OnCall[j].Fields.StartTime;
                end = Data.OnCall[j].Fields.EndTime;
                currentDate2 = date + " 0:00:01 AM";
                currentDate1 = date + " 11:59:59 PM"
                if (dates.inRange(currentDate1, start, end) || dates.inRange(currentDate2, start, end)) {

                        var external = Data.OnCall[j].Fields.ExternalID;
                        var personName = "";
                        var Title = "";
                        var DeptDescription = "";
                        for (var k = 0; k < Data.Person.length; k++) {
                            if (Data.Person[k].Fields.ExternalID == external) {
                                personName = Data.Person[k].Fields.FirstName + " " + Data.Person[k].Fields.LastName;
                                DeptDescription = Data.Person[k].Fields.DeptDescription;
                                Title = Data.Person[k].Fields.Title;
                            }
                        }
                        var phone = "";
                        for (var k = 0; k < Data.Phone.length; k++) {
                            if (Data.Phone[k].Fields.ExternalID == external) {
                                phone += Data.Phone[k].Fields.PhoneDescription + ": <a style='color:white;' href='callto:" + Data.Phone[k].Fields.PhoneNumber + "'>" + Data.Phone[k].Fields.PhoneNumber + "</a><br>";
                            }
                        }
                        /* allSubInfo = GHVHS.DOM.create({ "Type": "div", "Class": "allSubInfo", "Id": "allSubInfo", "Parent": DateSchedule });
                         SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Id": "SingleInfo", "Parent": allSubInfo });
                         SingleInfo.innerHTML = personName;
                         SingleInfo2 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "SingleInfo", "Parent": allSubInfo });
                         SingleInfo2.innerHTML = Title;
                         SingleInfo3 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "SingleInfo", "Parent": allSubInfo });
                         SingleInfo3.innerHTML = DeptDescription;
                         contactInfo = GHVHS.DOM.create({ "Type": "div", "Class": "contactInfo", "Style": "font-size:110%;margin-top:1%;", "Id": "contactInfo", "Parent": DateSchedule });
                         contactInfo.innerHTML = phone;
                         ScheduleForDay = GHVHS.DOM.create({ "Type": "div", "Class": "ScheduleForDay", "Style": "background-color:white;", "Id": "ScheduleForDay", "Parent": DateSchedule });
                         Time = GHVHS.DOM.create({ "Type": "div", "Class": "Time", "Id": "Time", "Parent": ScheduleForDay });*/
                        
                        var Tstart = Data.OnCall[j].Fields.StartTime;
                        var Tend = Data.OnCall[j].Fields.EndTime;
                        var S = new Date(date);

                        OnCall.formatDate(S.toString());
                        var getRange = OnCall.calHoursPerDay(Tstart, Tend, OnCall.formatDate(S.toString()) + " 0:00:01 AM", OnCall.formatDate(S.toString()) + " 11:59:59 PM");
                        var getTimeOne = Number(new Date(getRange[0]).getHours());
                        if (getTimeOne == 0) {
                            getTimeOne = 1;
                        }
                        var getTimeTwo = Number(new Date(getRange[1]).getHours());
                        if (getTimeTwo == 0) {
                            getTimeTwo = 24;
                        }
                        if (document.getElementById("coloredHour")) {
                            var coloredHour = GHVHS.DOM.create({ "Type": "div", "Class": "coloredHour2", "Id": "coloredHour2", "Parent": DateCol });
                        } else {
                            var coloredHour = GHVHS.DOM.create({ "Type": "div", "Class": "coloredHour", "Id": "coloredHour", "Parent": DateCol });
                        }
                       
                        var getElem = document.getElementById(getTimeTwo + "Hour")
                        if (getTimeTwo == 24) {
                            coloredHour.style.height = (25.5 * 30) + "px";
                        } else {
                            coloredHour.style.height = ((getTimeTwo) * 31.5) + "px";
                        }
                        if ((coloredHour.offsetTop + (getTimeTwo) * 31.5) > (25.5 * 30)) {
                            coloredHour.style.height = ((26.5 * 30) - coloredHour.offsetTop ) + "px";
                        }
                        coloredHour.innerHTML = personName + "<br><br>" + getRange[0] + "<br> - <br> " + getRange[1];


                    }
                }
                DateSchedule.id = date;    
            },
            
        
   
    DrawTopBar: function (Elem, Name, monthShort, Month, Year, Entity, Department) {
        OnCall.drawSlideMenu(Elem, "Month");
        var TopBar = GHVHS.DOM.create({ "Type": "div", "Class": "TopBarM", "Id": "TopBar", "Parent": Elem });
        var menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/whiteMenu.png", "Class": "menu2", "Id": "menu", "Parent": TopBar });
        menu.onclick = function () {
            var getMenu = document.getElementById("SideMenu");
            getMenu.style.left = "0px";

            if (document.getElementById("sidebackground").style.display == "none") {
                setTimeout(function () {
                    document.getElementById("sidebackground").style.display = "block";
                }, 10);
            }
        }
        DepartmentContainer = GHVHS.DOM.create({ "Type": "div", "Class": "DepartmentContainer", "Id": Department + "|" + Entity, "Parent": TopBar });
        DepoText = GHVHS.DOM.create({ "Type": "div", "Class": "MonthText", "Id": Department, "Content": Department, "Parent": DepartmentContainer });
        DepoText.innerHTML += "<span style='font-size:85%;font-weight:normal;'>(" + Entity + ")</span>";
        DepartmentContainer.onclick = function () {
            var getInfo = this.id.split("|");
            OnCall.DrawDepartmentSlideUp(getInfo[0], getInfo[1]);
        }
        MonthYearContainer = GHVHS.DOM.create({ "Type": "div", "Class": "MonthYearContainer", "Id": "MonthYearContainer", "Parent": TopBar });
        MonthText = GHVHS.DOM.create({ "Type": "div", "Class": "MonthText", "Id": Month, "Content": monthShort, "Parent": MonthYearContainer });
        YearText = GHVHS.DOM.create({ "Type": "div", "Class": "YearText ", "Id": Year + "", "Content": Year + "", "Parent": MonthYearContainer });
        MonthYearContainer.onclick = function () {
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            OnCall.DrawMonthSlideUp(monthNames);
        }
    },
    drawSlideMenu: function (Elem, Selected) {
        var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "sidebackground", "Style": "z-index:7000000000000000000000000009;display:none", "Parent": Elem });
        SideMenu = GHVHS.DOM.create({ "Type": "div", "Class": "SideMenu", "Id": "SideMenu", "Parent": Elem });
       
        var menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/menu.png", "Style": "margin-right:1%;height:5%;width:14%;margin-left:75%;", "Class": "menu", "Id": "menu", "Parent": SideMenu });
        menu.onclick = function () {
            var getMenu = document.getElementById("SideMenu");
            getMenu.style.left = "-1000px";
            if (document.getElementById("sidebackground").style.display == "block") {
                setTimeout(function () {
                    document.getElementById("sidebackground").style.display = "none";
                }, 10);
            }
        }
        var links = ["Departments", "Year", "Month", "Week", "Day" ];
        linkContainer = GHVHS.DOM.create({ "Type": "div", "Class": "linkContainer", "Id": "linkContainer", "Parent": SideMenu });
        for (var i = 0; i < links.length; i++){
            if (links[i] == Selected) {
                link = GHVHS.DOM.create({ "Type": "div", "Class": "Selected", "Id": "links", "Content": links[i], "Parent": linkContainer });
            }else{
                link = GHVHS.DOM.create({ "Type": "div", "Class": "links", "Id": "links","Content":links[i], "Parent": linkContainer });
            }
        }
        LogoContainer = GHVHS.DOM.create({ "Type": "div", "Class": "LogoContainer", "Id": "LogoContainer", "Parent": SideMenu });
        logo = GHVHS.DOM.create({ "Type": "img", "Src": "/img/logoTrans.png", "Class": "logo", "Id": "logo", "Parent": LogoContainer });
        LogoText = GHVHS.DOM.create({ "Type": "div", "Class": "LogoText", "Id": "LogoText", "Content": "On Call", "Parent": LogoContainer });
    },
    SlideUpX: null,
    SlideUpY: null,
    handleTouchStartSU: function (evt) {
        if (document.getElementById('main')) {
            return;
        }
        const firstTouch = OnCall.getTouches(evt)[0];
        OnCall.SlideUpX = firstTouch.clientX;
        OnCall.SlideUpY = firstTouch.clientY;
    },
    checkTransition: "Y",
    handleTouchMoveSU: function (evt) {
        if (evt.target.id != "SlideUpSmallBody" && evt.target.className != "SingleDepartment") {
            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;
            var xDiff = xUp - OnCall.SlideUpX;
            var getCanvas = document.getElementById("Site");
            var getIcon = document.getElementById("right");
            var DropDowned = document.getElementById('menuNav');
            var YDiff = yUp - OnCall.SlideUpY;
            var getApp = document.getElementById("MonthCalander");
            var test = getApp.offsetHeight * 0.2;
            var bigTest = getApp.offsetHeight * 0.55;
            // to slide drop down menu back

            if (YDiff > test && YDiff < bigTest) {
                if (OnCall.checkTransition == "Y") {
                    OnCall.RemoveSlideUp();
                } else {
                    document.getElementById("slideUpSmall").style.top = "55%";
                    setTimeout(function () {
                        document.getElementById("slideUpSmall").style.height = "45%";
                    }, 400);
                    setTimeout(function () {
                        OnCall.checkTransition = "Y";
                    }, 400)
                }
            } else if (YDiff >= bigTest) {
                OnCall.RemoveSlideUp();
            }
            if (YDiff < -test) {
                console.log(YDiff);
                document.getElementById("slideUpSmall").style.top = "10%";
                document.getElementById("slideUpSmall").style.height = "90%";
                OnCall.checkTransition = "N";
            }
        }

    },
    DrawMonthSlideUp: function (Months) {
        var getApp = document.getElementById("App");
        var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "backg", "Style": "z-index:7000000000000000000000000009;", "Parent": getApp });
        var X = GHVHS.DOM.create({ "Type": "img", "Class": "whiteX2", "Id": "whiteX", "Src": "/img/xWhite.png", "Parent": backg });
        X.onclick = function () {
            OnCall.RemoveSlideUp();
        }
        backg.addEventListener('touchstart', OnCall.handleTouchStartSU);
        backg.addEventListener('touchmove', OnCall.handleTouchMoveSU, false);
        slideUpSmall = GHVHS.DOM.create({ "Type": "div", "Class": "slideUpSmall", "Id": "slideUpSmall", "Parent": backg });
        SlideUpSmallHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SlideUpSmallHeader", "Content": "Click on month to view schedule", "Id": "SlideUpSmallHeader", "Parent": slideUpSmall });
        SlideUpSmallBody = GHVHS.DOM.create({ "Type": "div", "Class": "SlideUpSmallBody", "Id": "SlideUpSmallBody", "Parent": slideUpSmall });
        for (var i = 0; i < Months.length; i++) {
            SingleDepartment = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDepartment", "Id": "SingleDepartment", "Parent": SlideUpSmallBody });
            SingleDepartment.innerHTML = Months[i];
        }
    },
    DrawDepartmentSlideUp: function (Department, Entity) {
        var getApp = document.getElementById("App");
        var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "backg", "Style": "z-index:7000000000000000000000000009;", "Parent": getApp });
        var X = GHVHS.DOM.create({ "Type": "img", "Class": "whiteX2", "Id": "whiteX", "Src": "/img/xWhite.png", "Parent": backg });
        X.onclick = function () {
            OnCall.RemoveSlideUp();
        }
        backg.addEventListener('touchstart', OnCall.handleTouchStartSU);
        backg.addEventListener('touchmove', OnCall.handleTouchMoveSU, false);
        slideUpSmall = GHVHS.DOM.create({ "Type": "div", "Class": "slideUpSmall", "Id": "slideUpSmall", "Parent": backg });
        SlideUpSmallHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SlideUpSmallHeader", "Content": "Click on deparment to view schedule", "Id": "SlideUpSmallHeader", "Parent": slideUpSmall });
        SlideUpSmallBody = GHVHS.DOM.create({ "Type": "div", "Class": "SlideUpSmallBody", "Id": "SlideUpSmallBody", "Parent": slideUpSmall });
        for (var i = 0; i < OnCall.Groups.length; i++) {
            SingleDepartment = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDepartment", "Id": "SingleDepartment", "Parent": SlideUpSmallBody });
            SingleDepartment.innerHTML = OnCall.Groups[i].Fields.GroupName;
            SingleDepartment.id = OnCall.Groups[i].Fields.GroupID + "|" + OnCall.Groups[i].Fields.FacilityFilter;
            SingleDepartment.onclick = function () {
                var getX = document.getElementById("whiteX2");
                if (getX) {
                    getX.click();
                }
                GHVHS.DOM.DrawSmallLoader2(document.getElementById("App"));
                var getData = this.id.split("|");
                window.location.href = "/OnCallM/Month/" + getData[0];
            }
        }
    },
    isRemoved:"N",
    RemoveSlideUp: function () {
        var dp = document.getElementById("slideUpSmall");
        if (dp) {
            dp.style.top = "100%";
            OnCall.isRemoved = "Y";
            setTimeout(function () {
                if (OnCall.isRemoved == "Y") {
                    dp.parentElement.parentElement.removeChild(dp.parentElement);
                    OnCall.isRemoved = "N";
                }
            }, 350);
        }

    },
    calHoursPerDay:function(startR, endR, startT, endT){
        var returnHourS = "";
        var returnHourEnd = "";
        var checkStart = dates.compare(startR, startT);
        if (checkStart == -1) {
            returnHourS = OnCall.formatDate(startT) + " 12:00:00 AM";
        } else {
            returnHourS = startR;
        }
        var checkStart = dates.compare(endR, endT);
        if (checkStart == 1) {
            returnHourEnd = OnCall.formatDate(endT) + " 12:00:00 AM";
        } else {
            returnHourEnd = endR;
        }

        return [returnHourS, returnHourEnd];
    },
    formatDate:function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}



};
var dates = {
    convert: function (d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
        );
    },
    compare: function (a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
        );
    },
    getFormattedDate: function (date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month :  month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day :  day;
  
        return month + '/' + day + '/' + year;
     },
    inRange: function (d, start, end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
             isFinite(d = this.convert(d).valueOf()) &&
             isFinite(start = this.convert(start).valueOf()) &&
             isFinite(end = this.convert(end).valueOf()) ?
             start <= d && d <= end :
             NaN
         );
    }
}