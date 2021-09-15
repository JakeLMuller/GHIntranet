var OnCall = {
    decodeJson: function (json, SubLevel) {
        var jsonHolder = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "jsonHolder", "Parent": document.getElementById('MainContent') });
        if (SubLevel) {
            jsonHolder.innerHTML = json;
        } else {
            jsonHolder.innerHTML = json.data;
        }
        var jsonDrop = JSON.parse(jsonHolder.innerHTML);
        document.getElementById('MainContent').removeChild(jsonHolder);
        return jsonDrop;
    },
    DrawDalyView: function (GroupId, DayOfTheWeek, Dated,UserName, SingleGroupJson, GroupsJson, CallJson) {
        var OnCallContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallContainer", "Id": "OnCallContainer", "Parent": document.getElementById('MainContent') });
        var TopBar = RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": OnCallContainer });
        var getUser = UserName.replace("GHVHS", "");
        var WelUser =  GHVHS.DOM.create({ "Type": "div", "Class": "WelUser", "Id": "WelUser", "Content": "Welcome: " + getUser, "Parent": TopBar });
        var TOnCall =  GHVHS.DOM.create({ "Type": "div", "Class": "TOnCall", "Id": "TOnCall", "Content": "On Call", "Parent": TopBar });
        var ViewContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ViewContainer", "Id": "ViewContainer", "Parent": TopBar });
        var Filler = GHVHS.DOM.create({ "Type": "div", "Class": "FillerView",  "Parent": ViewContainer });
        var DailyView = GHVHS.DOM.create({ "Type": "div", "Class": "SingleViewContainer", "Id": "DailyView", "Content": "Daily View", "Parent": ViewContainer });
        var Monthly = GHVHS.DOM.create({ "Type": "div", "Class": "SingleViewContainer", "Id": "Monthly", "Content": "Monthly View", "Parent": ViewContainer });
        var RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "RightContainer", "Id": "RightContainer", "Parent": OnCallContainer });
        var filterContainer = GHVHS.DOM.create({ "Type": "div", "Class": "filterContainer", "Id": "filterContainer", "Parent": RightContainer });
        var filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Parent": filterContainer });
        var option = [];
        for (var i = 0; i < GroupsJson.length; i++) {
            option.push(GroupsJson[i]["GroupName"]);
        }
        GHVHS.DOM.CreateDropDown({ "Element": "Filter", "dropDownId": "", "Options": option, "todraw": "input", "NoClear": "Y" });
        filter.value = SingleGroupJson[0]["GroupName"];
        filter.setAttribute("placeholder", "Search Groups...");
        var opts = OnCallContainer.querySelectorAll(".DropOption");
        filter.onkeyup = function () {
          
            for (var i = 0; i < opts.length; i++) {
                if (this.value == "" || this.value == " " ){
                   
                    opts[i].className = "DropOption";
                }else {
                    var CompareValue = opts[i].innerHTML.toLowerCase();
                    var value = this.value.toLowerCase();
                    if (CompareValue.indexOf(value) >= 0) {
                        opts[i].className = "DropOption";
                    } else {
                        opts[i].className = "hide";
                    }
                }

            }
        }
        filter.style.marginBottom = "0px";
        filter.style.width = "99%";
        filter.style.marginLeft = "0px";
        SearchButton = GHVHS.DOM.create({ "Type": "div", "Class": "DepartmentButton", "Id": "DepartmentButton", "Content": "Go To On Call Scheduale", "Parent": filterContainer });
        SearchButton.onclick = function () {
            var urlParts = window.location.href.split("Daily/");
            var NewPageValue = filter.value.split(" (");
            var Enity = NewPageValue[1].replace(")", "");
            window.location.href = urlParts[0] + "Daily/" + NewPageValue[0] + "?Entity=" + Enity;
        }
        CallComments = GHVHS.DOM.create({ "Type": "div", "Class": "CallComments", "Id": "CallComments", "Parent": RightContainer });
        CallTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "CallTableHeader", "Id": "CallTableHeader", "Parent": CallComments });
        CallTableHeader.innerHTML = SingleGroupJson[0]["GroupName"] +" Group Comments:"
        CallTableBody = GHVHS.DOM.create({ "Type": "div", "Class": "CallTableBody", "Id": "CallTableBody", "Parent": CallComments });
        CallTableBody.innerHTML = SingleGroupJson[0]["GroupComments"];

        var LeftContainer = GHVHS.DOM.create({ "Type": "div", "Class": "LeftContainer", "Id": "LeftContainer", "Parent": OnCallContainer });
        OnCall.DrawDateContainer(LeftContainer, Dated);
        var TimesCol = GHVHS.DOM.create({ "Type": "div", "Class": "TimesCol", "Id": "TimesCol", "Parent": LeftContainer });
        for (var i = 0; i < 12; i++) {
            var SingleTime = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTime", "Id": "SingleTime", "Parent": TimesCol });
            if (i == 0){
                SingleTime.innerHTML = "12 am";
                SingleTime.id = "12 am";
            } else {
                SingleTime.innerHTML = i +" am";
                SingleTime.id = i + " am";
            }
        }
        for (var i = 0; i < 12; i++) {
            var SingleTime = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTime", "Id": "SingleTime", "Parent": TimesCol });
            if (i == 0) {
                SingleTime.innerHTML = "12 pm";
                SingleTime.id = "12 pm";
            } else {
                SingleTime.innerHTML = i + " pm";
                SingleTime.id = i + " pm";
            }
        }
        var Schedules = GHVHS.DOM.create({ "Type": "div", "Class": "Schedules", "Id": "Schedules", "Parent": LeftContainer });
        for (var i = 0; i < 23; i++) {
            var SingleLine = GHVHS.DOM.create({ "Type": "div", "Class": "SingleLine", "Id": "SingleLine", "Parent": Schedules });
            SingleLine.style.width = Schedules.offsetWidth + "px";
            
        }
       
        
        var callOne;
        var callTwo;
        if (CallJson.length > 0) {
            for (var i = 0; i < CallJson.length; i++) {
                call = GHVHS.DOM.create({ "Type": "div", "Class": "call", "Id": "call", "Parent": Schedules });
                 callOne = CallJson[i]["StartTime"].split("T");
                 callTwo = CallJson[i]["EndTime"].split("T");
                var splitDate = Dated.split("/");
                var LimitElem;
                var d = splitDate[2] + "-" + splitDate[0] + "-" + splitDate[1];
                var checkSplit = callOne[1].split(":");
                var checkSplit2 = callTwo[1].split(":");
                if (Number(checkSplit[0]) > 12) {
                    var num = Number(checkSplit[0]) - 12;
                    LimitElem = document.getElementById(num + " pm");
                    call.style.top = (LimitElem.offsetTop ) + "px";
                } else {
                    var num = Number(checkSplit[0]) ;
                    LimitElem = document.getElementById(num + " am");
                    call.style.top = (LimitElem.offsetTop) + "px";
                }
                if (Number(checkSplit2[0]) > 12 && Number(checkSplit[0]) < 12) {
                    var num = Number(checkSplit2[0]) - 12;
                    LimitElem = document.getElementById(num+" pm");
                    call.style.height = (LimitElem.offsetTop - call.offsetTop) + "px";
                }else {
                    LimitElem = Schedules;
                    call.style.height = ((LimitElem.offsetTop + LimitElem.offsetHeight -5) - call.offsetTop) + "px";
                }
                
                        call.style.left = (Schedules.offsetLeft + 10) + "px";
                        call.style.width = "450px";
                        var callInfo = GHVHS.DOM.create({ "Type": "div", "Class": "callInfo", "Id": "callInfo", "Parent": call });
                        OnCall.formateCallInfo(callOne[1], callTwo[1],Dated, CallJson[i]["ExternalID"], callInfo);
                        var callInfoComment = GHVHS.DOM.create({ "Type": "div", "Class": "callInfoComment", "Id": "callInfoComment", "Parent": call });
                        callInfoComment.innerHTML += CallJson[i]["Comments"];
                   
            }
            var check = callOne[0].split("-");
            var g1 = new Date(check[0],check[1],check[2]);
            var check2 = Dated.split("/");
            var g2 = new Date(check2[2], check2[0], check2[1]); 
           
            var getCallsPerPage = Schedules.querySelectorAll(".call");
            if (getCallsPerPage.length == 1) {
                if (g1.getTime() < g2.getTime()) {
                    var checkSplit = callOne[1].split(":");
                    var checkSplit2 = callTwo[1].split(":");
                    call = GHVHS.DOM.create({ "Type": "div", "Class": "call", "Style": "background-color:#ff9000;border:2px solid #ff2500;", "Id": "call2", "Parent": Schedules });
                    if (checkSplit[0] <= 12 && checkSplit2[0] > 12) {
                        var num = Number(checkSplit[0]) ;
                        LimitElem = document.getElementById(num + " am");
                        call.style.top = (LimitElem.offsetTop) + "px";
                    } else {
                        call.style.top = (Schedules.offsetTop + 5) + "px";
                    }
                    if (checkSplit2[0] <= 12) {
                        var num = Number(checkSplit2[0]);
                        LimitElem = document.getElementById(num + " am");
                        call.style.height = (LimitElem.offsetTop - call.offsetTop) + "px";
                    } else {
                        call.style.height = (Schedules.offsetHeight - getCallsPerPage[0].offsetHeight -8) + "px";
                    }
                    call.style.left = (Schedules.offsetLeft + 10) + "px";
                    call.style.width = "450px";
                    var callInfo2 = GHVHS.DOM.create({ "Type": "div", "Class": "callInfo", "Id": "callInfo2", "Parent": call });
                    
                    dated2 = OnCall.CalculateDate(Dated, -1);
                    OnCall.formateCallInfo(callOne[1], callTwo[1], dated2, CallJson[0]["ExternalID"], callInfo2);
                    var callInfoComment = GHVHS.DOM.create({ "Type": "div", "Class": "callInfoComment", "Id": "callInfoComment", "Parent": call });
                    callInfoComment.innerHTML += CallJson[0]["Comments"];
                }
            }
            }
        
    },
    CalculateDate:function(Date,OffSet){
        var dateParts = Date.split("/");
        var day = Number(dateParts[1]);
        var month = Number(dateParts[0]);
        var year = Number(dateParts[2]);
        var maxDays = GHVHS.DOM.monthsYears[month-1]["Days"];
        if (day + OffSet <= 0) {
            if (month > 1){
                day = GHVHS.DOM.monthsYears[month - 2]["Days"];
                if (OffSet >= -1) {
                    OffSet + 1;
                }
                day = day + OffSet;
                month = month - 1;
            } else {
                day = GHVHS.DOM.monthsYears[11]["Days"];
                day = day + OffSet;
                month = 12;
                year = year + 1;
            }
            
        } else if (day + OffSet > maxDays) {
            if (month < 12) {
                day = 0;
                day = day + OffSet;
                month = month - 1;
            } else {
                day = 0;
                day = day + OffSet;
                month = 1;
                year = year + 1;
            }
        } else {
            day = day +OffSet;
        }
        if (month < 10){
            month = "0" + month;
        } 
        if (day < 10){
            day = "0" + day;
        }
        return month + "/" + day + "/" + year;
    },
    DrawDateContainer:function(elem, Dated){
        var dateContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dateContainer", "Id": "dateContainer", "Parent": elem });
        var leftDateArrow = GHVHS.DOM.create({ "Type": "img", "Src": "/img/downwhite.png", "Class": "leftDateArrow", "Id": "leftDateArrow", "Parent": dateContainer });
        leftDateArrow.onclick = function () {
            var newDate = OnCall.CalculateDate(Dated, -1);
            if (window.location.href.indexOf("&") >= 0) {
                var urlParts = window.location.href.split("&");
                window.location.href = urlParts[0] + "&date=" + newDate;
            }else {
                window.location.href = window.location.href + "&date=" + newDate;
            }
            
        }
        var dateTimeContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dateTimeContainer", "Id": "dateTimeContainer", "Parent": dateContainer });
        var dateElement = GHVHS.DOM.create({ "Type": "div", "Class": "dateElement", "Content": Dated, "Id": "dateElement", "Parent": dateTimeContainer });
        var calander = GHVHS.DOM.create({ "Type": "img", "Src": "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png", "Class": "calander", "Id": "OnCallCal", "Parent": dateTimeContainer });
        calander.onclick = function () {
            GHVHS.DOM.drawCalander("", "", this);
        }
        var rightDateArrow = GHVHS.DOM.create({ "Type": "img", "Src": "/img/downwhite.png", "Class": "rightDateArrow", "Id": "rightDateArrow", "Parent": dateContainer });
        rightDateArrow.onclick = function () {
            var newDate = OnCall.CalculateDate(Dated, 1);
            if (window.location.href.indexOf("&") >= 0) {
                var urlParts = window.location.href.split("&");
                window.location.href = urlParts[0] + "&date=" + newDate;
            } else {
                window.location.href = window.location.href + "&date=" + newDate;
            }

        }
    },
    formateCallInfo: function (TimeOne, TimeTwo, Dated, Id, Elem) {
        var timesInfo = "";
        var timeOne;
        var timeTwo;
        var checkSplit = TimeOne.split(":");
        var checkSplit2 = TimeTwo.split(":");
        if (Number(checkSplit[0]) > 12) {
            timeOne = (Number(checkSplit[0]) - 12);
            if (checkSplit[1] == "00") {
                timeOne += ":00" + " PM";
            } else {
                timeOne += ":" + checkSplit[1] + " PM";
            }
        } else {
            timeOne = checkSplit[0];
            if (checkSplit[1] == "00") {
                timeOne += ":00" + " AM";
            } else {
                timeOne += ":" + checkSplit[1] + " AM";
            }
        }
        if (Number(checkSplit2[0]) > 12) {
            timeTwo = (Number(checkSplit2[0]) - 12);
            if (checkSplit2[1] == "00") {
                timeTwo += ":00" + " PM";
            } else {
                timeTwo += ":" + checkSplit2[1] + " PM";
            }
        } else {
            timeTwo = checkSplit2[0];
            if (checkSplit2[1] == "00") {
                timeTwo += ":00" + " AM";
            } else {
                timeTwo += ":" + checkSplit[1] + " AM";
            }
        }
        timesInfo = timeOne + " - " + timeTwo;
            function UpdateCallInfo(json, Elem2) {

                json = OnCall.decodeJson(json);
                Elem2.innerHTML = json[0]["FirstName"] + " " + json[0]["LastName"] + "<br>" + Dated + "<br>" + json[0]["Entity"] + "<br>" + timesInfo;
                
            }

            GHVHS.DOM.send({ "URL": "/OnCall/GetPeople?ExternalID=" + Id + "", "Callback": UpdateCallInfo, "CallbackParams": Elem });
            
        
    }
}; 