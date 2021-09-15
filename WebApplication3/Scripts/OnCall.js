var OnCallDeskTop = {
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
    GlobalGropFilter:"",
    drawLeftContainer: function (GroupsJson, SingleGroupJson, OnCallContainer, callJson, NotDaily, Access) {
        var RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "RightContainer", "Id": "RightContainer", "Parent": OnCallContainer });
        if (!NotDaily) {
            RightContainer.onmouseover = function (e) {
                if (e.target.className != "rowed" && e.target.className != "rowMain" && e.target.className != "rowSmall" && e.target.className != "row") {
                    var getSchedules = document.getElementById("Schedules");
                    var calls = getSchedules.querySelectorAll(".call2, .call");
                    for (var i = 0; i < calls.length; i++) {
                        calls[i].style.backgroundColor = "white";
                    }
                    var getSchedules = document.getElementById("PhoneDataTable");
                    var calls = getSchedules.querySelectorAll(".rowed");
                    for (var i = 0; i < calls.length; i++) {
                        calls[i].style.backgroundColor = "white";
                    }

                }
            }
        }
        
        var filterContainer = GHVHS.DOM.create({ "Type": "div", "Class": "filterContainer", "Id": "filterContainer", "Parent": RightContainer });
        var filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Parent": filterContainer });
        var option = [];
        for (var i = 0; i < GroupsJson.length; i++) {
            option.push(GroupsJson[i]["Fields"]["GroupName"]);
        }
        GHVHS.DOM.CreateDropDown({ "Element": "Filter", "dropDownId": "", "Options": option, "todraw": "input", "NoClear": "Y" });
        filter.value = SingleGroupJson["Fields"]["GroupName"];
        filter.setAttribute("placeholder", "Search Groups...");
        var opts = OnCallContainer.querySelectorAll(".DropOption");
        filter.onkeyup = function () {

            for (var i = 0; i < opts.length; i++) {
                if (this.value == "" || this.value == " ") {
                    var CompareValue = opts[i].innerHTML.toLowerCase();
                    if (OnCallDeskTop.GlobalGropFilter) {
                        if (CompareValue.indexOf(OnCallDeskTop.GlobalGropFilter) >= 0) {
                            opts[i].className = "DropOption";
                        }
                    } else {
                        opts[i].className = "DropOption";
                    }
                } else {
                    var CompareValue = opts[i].innerHTML.toLowerCase();
                    var value = this.value.toLowerCase();
                    if (OnCallDeskTop.GlobalGropFilter) {
                        if (CompareValue.indexOf(OnCallDeskTop.GlobalGropFilter) >= 0) {
                            if (CompareValue.indexOf(value) >= 0) {
                                opts[i].className = "DropOption";
                            } else {
                                opts[i].className = "hide";
                            }
                        } else {
                            opts[i].className = "hide";
                        }
                    } else {
                        if (CompareValue.indexOf(value) >= 0) {
                            opts[i].className = "DropOption";
                        } else {
                            opts[i].className = "hide";
                        }
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
            var NewPageValue = filter.value;
            var result = "";
            for (var i = 0; i < GroupsJson.length; i++) {
                if (GroupsJson[i]["Fields"]["GroupName"] == NewPageValue) {
                    result = GroupsJson[i]["Fields"]["GroupID"]
                }
            }
            if (result) {
                GHVHS.DOM.DrawSmallLoader2();
                if (window.location.href.indexOf("Daily") >= 0) {
                    window.location.href = "/OnCall/Daily/" + result;
                } else if (window.location.href.indexOf("Month") >= 0) {
                    window.location.href = "/OnCall/Daily/Month/" + result;
                } else if (window.location.href.indexOf("History") >= 0) {
                    window.location.href = "/OnCall/Daily/History/" + result;
                } else if (window.location.href.indexOf("MonthlyHistory") >= 0) {
                    window.location.href = "/OnCall/Daily/MonthlyHistory/" + result;
                } else if (window.location.href.indexOf("WeeklyHistory") >= 0) {
                    window.location.href = "/OnCall/Daily/WeeklyHistory/" + result;
                }
            } else {
                OnCallDeskTop.drawErrorMsg("Please Select a Valid Department!");
            }
        }
        OnCallButtonContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButtonContainer", "Id": "OnCallButtonContainer", "Parent": RightContainer });
        OnCallButton1 = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButton", "Id": "OnCallButtonLabel", "Content": "All Schedules", "Parent": OnCallButtonContainer });
        OnCallButton1.onclick = function(){
            var getButtons = this.parentElement.querySelectorAll(".OnCallButtonSelected");
            for (var i = 0; i < getButtons.length; i++) {
                getButtons[i].className = "OnCallButton";
            }
            this.className = "OnCallButtonSelected";
            var getParent = this.parentElement.parentElement;
            var getDrop = getParent.querySelector(".DropDown");
            OnCallDeskTop.GlobalGropFilter = "";
            var allDropsOptions = getDrop.querySelectorAll("div");
            for (var i = 0; i < allDropsOptions.length; i++) {
                allDropsOptions[i].className = "DropOption";
            }

        }
        OnCallButton1.click();
        OnCallButton2 = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButton", "Id": "OnCallButtonLabel", "Content": "ORMC Schedules", "Parent": OnCallButtonContainer });
        OnCallButton2.onclick = function () {
            var getButtons = this.parentElement.querySelectorAll(".OnCallButtonSelected");
            for (var i = 0; i < getButtons.length; i++) {
                getButtons[i].className = "OnCallButton";
            }
            this.className = "OnCallButtonSelected";
            var getParent = this.parentElement.parentElement;
            var getDrop = getParent.querySelector(".DropDown");
            OnCallDeskTop.GlobalGropFilter = "ormc";
            var allDropsOptions = getDrop.querySelectorAll("div");
            for (var i = 0; i < allDropsOptions.length; i++) {
                if (allDropsOptions[i].innerHTML.toLowerCase().indexOf("ormc") >= 0) {
                    allDropsOptions[i].className = "DropOption";
                } else {
                    allDropsOptions[i].className = "hide";
                }
            }

        }
        OnCallButton3 = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButton", "Id": "OnCallButtonLabel", "Content": "CRMC Schedules", "Parent": OnCallButtonContainer });
        OnCallButton3.onclick = function () {
            var getButtons = this.parentElement.querySelectorAll(".OnCallButtonSelected");
            for (var i = 0; i < getButtons.length; i++) {
                getButtons[i].className = "OnCallButton";
            }
            this.className = "OnCallButtonSelected";
            var getParent = this.parentElement.parentElement;
            var getDrop = getParent.querySelector(".DropDown");
            var allDropsOptions = getDrop.querySelectorAll("div");
            OnCallDeskTop.GlobalGropFilter = "crmc";
            for (var i = 0; i < allDropsOptions.length; i++) {
                if (allDropsOptions[i].innerHTML.toLowerCase().indexOf("crmc") >= 0) {
                    allDropsOptions[i].className = "DropOption";
                } else {
                    allDropsOptions[i].className = "hide";
                }
            }
        }
        CallComments = GHVHS.DOM.create({ "Type": "div", "Class": "CallComments", "Id": "CallComments", "Parent": RightContainer });
        CallTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "CallTableHeader", "Id": "CallTableHeader", "Parent": CallComments });
        CallTableHeader.innerHTML = SingleGroupJson["Fields"]["GroupName"] + " Group Comments:"
        CallTableBody = GHVHS.DOM.create({ "Type": "div", "Class": "CallTableBody", "Id": "CallTableBody", "Parent": CallComments });
        CallTableBody.innerHTML = SingleGroupJson["Fields"]["GroupComments"];


        if (!NotDaily) {
            TableContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TableContainer", "Id": "TableContainer", "Parent": RightContainer });
            PhoneDataTable = GHVHS.DOM.create({ "Type": "table", "Class": "PhoneDataTable", "Id": "PhoneDataTable", "Parent": TableContainer });

            headerTB = GHVHS.DOM.create({ "Type": "thead", "Class": "headerTB", "Id": "headerTB", "Parent": PhoneDataTable });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "row", "Content": "Name", "Parent": headerTB });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "row", "Content": "Start Time", "Parent": headerTB });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "row", "Content": "End Time", "Parent": headerTB });
            ContactInfo = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "ContactInfo", "Content": "ContactInfo", "Parent": headerTB });
            tbody = GHVHS.DOM.create({ "Type": "tbody", "Class": "tbody", "Style": "overflow:auto", "Id": "tbody", "Parent": PhoneDataTable });
            for (var i = 0; i < callJson.length; i++) {
                tr = GHVHS.DOM.create({ "Type": "tr", "Class": "rowed", "Id": "TableRow" + i, "Parent": tbody });
                tr.onmouseover = function () {
                    var id = this.id.replace("TableRow", "");
                    var getCall = document.getElementById("call" + id);
                    getCall.style.backgroundColor = "#dddddd";
                    var getSchedules = document.getElementById("Schedules");
                    var calls = getSchedules.querySelectorAll(".call2, .call");
                    for (var i = 0; i < calls.length; i++) {
                        if (calls[i].id != getCall.id) {
                            calls[i].style.backgroundColor = "white";
                        }
                    }
                    this.style.backgroundColor = "#dddddd";
                }
                row = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Style": "font-size:120%;", "Id": "row", "Content": callJson[i]["Fields"]["FirstName"] + " " + callJson[i]["Fields"]["LastName"], "Parent": tr });
                row = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Id": "row", "Content": callJson[i]["Fields"]["StartTime"], "Parent": tr });
                row = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Id": "row", "Content": callJson[i]["Fields"]["EndTime"], "Parent": tr });
                ContactInfo2 = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Style": "width:40%;", "Id": "ContactInfo2", "Parent": tr });
                PhoneNumbers = GHVHS.DOM.create({ "Type": "table", "Class": "table", "Id": "table", "Parent": ContactInfo2 });
                for (var j = 0; j < callJson[i]["Fields"]["Phone"].length; j++) {
                    tr2 = GHVHS.DOM.create({ "Type": "tr", "Class": "rowedSmall", "Id": "tr", "Style": "border-bottom:1px solid black;", "Parent": PhoneNumbers });
                    row = GHVHS.DOM.create({ "Type": "td", "Class": "row", "Id": "row", "Style": "Width:80%;font-size:100%;padding-top:5px;padding-bottom:5px;", "Content": callJson[i]["Fields"]["Phone"][j]["Fields"]["PhoneNumber"], "Parent": tr2 });
                    row = GHVHS.DOM.create({ "Type": "td", "Class": "row", "Id": "row", "Style": "Width:30%;font-size:80%;padding-top:5px;padding-bottom:5px;", "Content": callJson[i]["Fields"]["Phone"][j]["Fields"]["PhoneDescription"], "Parent": tr2 });
                }
            }
        } else if (NotDaily == "N") {
            CallComments.style.height = "15%";
            TableContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TableContainer", "Id": "TableContainer", "Parent": RightContainer });
            PhoneDataTable = GHVHS.DOM.create({ "Type": "table", "Class": "PhoneDataTable", "Id": "PhoneDataTable", "Parent": TableContainer });

            headerTB = GHVHS.DOM.create({ "Type": "thead", "Class": "headerTB", "Id": "headerTB", "Parent": PhoneDataTable });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "row", "Content": "Name", "Parent": headerTB });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "row", "Content": "Start Time", "Parent": headerTB });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "row", "Content": "End Time", "Parent": headerTB });
            ContactInfo = GHVHS.DOM.create({ "Type": "td", "Class": "rowHeader", "Id": "ContactInfo", "Content": "ContactInfo", "Parent": headerTB });
            tbody = GHVHS.DOM.create({ "Type": "tbody", "Class": "tbody", "Style": "overflow:auto", "Id": "tbody", "Parent": PhoneDataTable });
            for (var i = 0; i < callJson[1].length; i++) {
                tr = GHVHS.DOM.create({ "Type": "tr", "Class": "rowed", "Id": "TableRow" + i, "Parent": tbody });
                tr.id = callJson[1][i]["Fields"]["ExternalID"] + "row";
                row = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Style": "font-size:120%;", "Id": "row", "Content": callJson[1][i]["Fields"]["FirstName"] + " " + callJson[1][i]["Fields"]["LastName"], "Parent": tr });
                var start, end;
                for (var k = 0; k < callJson[0].length; k++) {
                    if (callJson[1][i]["Fields"]["ExternalID"] == callJson[0][k]["Fields"]["ExternalID"]) {
                        start = callJson[0][k]["Fields"]["StartTime"];
                        end = callJson[0][k]["Fields"]["EndTime"];
                    }

                }
                row = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Id": "row", "Content": start, "Parent": tr });
                row = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Id": "row", "Content": end, "Parent": tr });
                ContactInfo2 = GHVHS.DOM.create({ "Type": "td", "Class": "rowMain", "Style": "width:40%;", "Id": "ContactInfo2", "Parent": tr });
                PhoneNumbers = GHVHS.DOM.create({ "Type": "table", "Class": "table", "Id": "table", "Parent": ContactInfo2 });
                for (var j = 0; j < callJson[2].length; j++) {
                    if (callJson[1][i]["Fields"]["ExternalID"] == callJson[2][j]["Fields"]["ExternalID"]) {
                        tr2 = GHVHS.DOM.create({ "Type": "tr", "Class": "rowedSmall", "Id": "tr", "Style": "border-bottom:1px solid black;", "Parent": PhoneNumbers });
                        row = GHVHS.DOM.create({ "Type": "td", "Class": "row", "Id": "row", "Style": "Width:80%;font-size:100%;padding-top:5px;padding-bottom:5px;", "Content": callJson[2][j]["Fields"]["PhoneNumber"], "Parent": tr2 });
                        row = GHVHS.DOM.create({ "Type": "td", "Class": "row", "Id": "row", "Style": "Width:30%;font-size:80%;padding-top:5px;padding-bottom:5px;", "Content": callJson[2][j]["Fields"]["PhoneDescription"], "Parent": tr2 });
                    }
                }
            }
        }
    },
    SelectedGroup: [],
    AllPeopleInGroup:[],
    DrawDalyView: function (GroupId, DayOfTheWeek, Dated, UserName, SingleGroupJson, GroupsJson, CallJson, Access, allPeople, Admin) {
        var getmain = document.getElementById("MainContent");
        var getHeader = document.getElementById("header");
        OnCallDeskTop.AllPeopleInGroup = allPeople;
        getmain.style.marginTop = (getHeader.offsetHeight + 20) + "px";
        var OnCallContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallContainer", "Id": "OnCallContainer",  "Parent": document.getElementById('MainContent') });
        var TopBar = RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": OnCallContainer });
        OnCallDeskTop.drawSideMenu("", OnCallContainer, Access, GroupId, Admin, SingleGroupJson);
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

       
        var TOnCall =  GHVHS.DOM.create({ "Type": "div", "Class": "TOnCall", "Id": "TOnCall", "Content": "On Call Daily", "Parent": TopBar });
       
         var getUser = UserName.replace("GHVHS", "");
        var WelUser =  GHVHS.DOM.create({ "Type": "div", "Class": "WelUser", "Id": "WelUser", "Content": "Welcome: " + getUser, "Parent": TopBar });
        OnCallDeskTop.SelectedGroup = SingleGroupJson;
        OnCallDeskTop.drawLeftContainer(GroupsJson, SingleGroupJson, OnCallContainer, CallJson,"", Access, Admin);
        var LeftContainer = GHVHS.DOM.create({ "Type": "div", "Class": "LeftContainer", "Id": "LeftContainer", "Parent": OnCallContainer });
        LeftContainer.onmouseover = function (e) {
            if (e.target.className != "rowed" && e.target.className != "rowMain" && e.target.className.indexOf("call") < 0 && e.target.className.indexOf("Call") < 0) {
                var getSchedules = document.getElementById("Schedules");
                var calls = getSchedules.querySelectorAll(".call2, .call");
                for (var i = 0; i < calls.length; i++) {
                    calls[i].style.backgroundColor = "white";
                }
                var getSchedules = document.getElementById("PhoneDataTable");
                var calls = getSchedules.querySelectorAll(".rowed");
                for (var i = 0; i < calls.length; i++) {
                        calls[i].style.backgroundColor = "white";
                }

            }
        }
        OnCallDeskTop.DrawDateContainer(LeftContainer, Dated, Access);
        OnCallDeskTop.drawRightContainerDaily(LeftContainer, CallJson, Dated,  Access);
        
    },
    drawRightContainerDaily: function (LeftContainer, CallJson, Dated, Access) {
        var TimesCol = GHVHS.DOM.create({ "Type": "div", "Class": "TimesCol", "Id": "TimesCol", "Parent": LeftContainer });
        for (var i = 0; i < 12; i++) {
            var SingleTime = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTime", "Id": "SingleTime", "Parent": TimesCol });
            if (i == 0) {
                SingleTime.innerHTML = "12 am";
                SingleTime.id = "0 am";
            } else {
                SingleTime.innerHTML = i + " am";
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
        var CallWidth = 0;
        if (CallJson.length) {
            for (var i = 0; i < CallJson.length; i++) {
                if (i % 2 == 0) {
                    call = GHVHS.DOM.create({ "Type": "div", "Class": "call", "Id": "call"+i, "Parent": Schedules });
                } else {
                    call = GHVHS.DOM.create({ "Type": "div", "Class": "call2", "Id": "call"+i, "Parent": Schedules });
                }
                call.onmouseover = function () {
                    var id = this.id.replace("call", "");
                    
                    var getCall = document.getElementById("TableRow" + id);
                    getCall.style.backgroundColor = "#dddddd";
                    var getSchedules = document.getElementById("PhoneDataTable");
                    var calls = getSchedules.querySelectorAll(".rowed");
                    for (var i = 0; i < calls.length; i++) {
                        if (calls[i].id != getCall.id) {
                            calls[i].style.backgroundColor = "white";
                        }
                    }
                    var getSchedules = document.getElementById("Schedules");
                    var calls = getSchedules.querySelectorAll(".call2, .call");
                    for (var i = 0; i < calls.length; i++) {
                        if (calls[i].id != this.id) {
                            calls[i].style.backgroundColor = "white";
                        }
                    }
                    this.style.backgroundColor = "#dddddd";
                }
                callOne = dates.convert(CallJson[i]["Fields"]["StartTime"]);
                callTwo = dates.convert(CallJson[i]["Fields"]["EndTime"]);
                var TodayEnd = dates.convert(Dated + " 11:59:59 pm");
                var TodayStart = dates.convert(Dated + " 12:00:00 am");
                var startTimeLabel = "";
                var endTimeLabel = "";
                var startHour = callOne.getHours();
                var EndHour = callTwo.getHours();
                var check1 = dates.convert(dates.getFormattedDate(TodayEnd));
                var check2 = dates.convert(dates.getFormattedDate(callTwo));
                var compareEnd = dates.compare(check2, check1);
                var compareStart = dates.compare(callOne, TodayStart);
                if (compareEnd == 1) {
                    EndHour = 23;
                }
                if (compareStart == -1) {
                    startHour = 0;
                }
                if (startHour > 12) {
                    var num = startHour - 12;
                    LimitElem = document.getElementById(num + " pm");
                    call.style.top = (LimitElem.offsetTop) + "px";
                } else {
                    var num = startHour;
                    LimitElem = document.getElementById(num + " am");
                    call.style.top = (LimitElem.offsetTop) + "px";
                }
                var startElem = LimitElem;
                startTimeLabel = LimitElem.innerHTML;
                if (EndHour > 12 && startHour < 12) {
                    var num = EndHour - 12;
                    LimitElem = document.getElementById(num + " pm");
                    if (num == 11) {
                        endTimeLabel = "12 am";
                        call.style.height = ((LimitElem.offsetTop - startElem.offsetTop) + LimitElem.offsetHeight) + "px";
                    } else {
                        endTimeLabel = LimitElem.innerHTML;
                        call.style.height = (LimitElem.offsetTop - startElem.offsetTop) + "px";
                    }

                } else {
                    if (compareEnd == 0) {
                        var num = EndHour;
                        if (EndHour > 12) {
                            num = EndHour - 12;
                            LimitElem = document.getElementById(num + " pm");
                            endTimeLabel = num + "pm";
                        } else {
                            LimitElem = document.getElementById(EndHour + " am");
                            endTimeLabel = num + "am";
                        }
                       
                    } else {
                        LimitElem = Schedules;
                        endTimeLabel = "12 am";
                    }
                    call.style.height = ((LimitElem.offsetTop + LimitElem.offsetHeight - 5) - startElem.offsetTop) + "px";
                }
                endTimeLabel = endTimeLabel.replace(" ", ":00");
                startTimeLabel = startTimeLabel.replace(" ", ":00");
                var external = CallJson[i]["Fields"].ExternalID;
                var personName = "";
                var Title = "";
                var DeptDescription = "";
                for (var k = 0; k < CallJson[i]["Fields"].Person.length; k++) {
                    if (CallJson[i]["Fields"].Person[k].Fields.ExternalID == external) {
                        personName = CallJson[i]["Fields"].Person[k].Fields.FirstName + " " + CallJson[i]["Fields"].Person[k].Fields.LastName;
                        DeptDescription = CallJson[i]["Fields"].Person[k].Fields.DeptDescription;
                        Title = CallJson[i]["Fields"].Person[k].Fields.Title;
                    }
                }
                var phone = "";
                for (var k = 0; k < CallJson[i]["Fields"].Phone.length; k++) {
                    if (CallJson[i]["Fields"].Phone[k].Fields.ExternalID == external) {
                        phone += CallJson[i]["Fields"].Phone[k].Fields.PhoneDescription + ": <a style='color:white;' href='callto:" + CallJson[i]["Fields"].Phone[k].Fields.PhoneNumber + "'>" + CallJson[i]["Fields"].Phone[k].Fields.PhoneNumber + "</a><br>";
                    }
                }
                /*if (CallJson.length > 2) {
                    var CallWidth = (Schedules.offsetWidth-20) / CallJson.length;
                    var callLeft = i * CallWidth;
                    call.style.left = ((Schedules.offsetLeft + 10) + callLeft) + "px";
                    call.style.width = CallWidth + "px";
                } else {
                    call.style.left = (Schedules.offsetLeft + 10) + "px";
                    call.style.width = 61.5 + "%";
                }*/
                if (CallJson.length > 1) {
                    var countOfCall = 0;
                    var CurrentCallisFirst = 0;
                    var jtoOffsetLeft = [];
                    var jtoOffsetwidth = [];
                    for (var j = 0; j < CallJson.length; j++) {

                        callOne = dates.convert(CallJson[j]["Fields"]["StartTime"]);
                        callTwo = dates.convert(CallJson[j]["Fields"]["EndTime"]);
                        var startTimeToday = dates.convert(CallJson[i]["Fields"]["StartTime"]);
                        var tempdate1 =dates.convert(Dated);
                        var CurrentStartTime = new Date(tempdate1.getTime() + startTimeToday.getHours());
                        var endTimeToday = dates.convert(CallJson[i]["Fields"]["EndTime"]);
                        var tempdate1 = dates.convert(Dated);
                        var CurrentEndTime = new Date(tempdate1.getTime() + endTimeToday.getHours());
                        var checkStart = dates.inRange(CurrentStartTime, callOne, callTwo);
                        var checkEnd = dates.inRange(CurrentEndTime, callOne, callOne);
                        if (checkStart == true || checkEnd == true) {
                            countOfCall++;
                            if (j > i) {
                                CurrentCallisFirst++;
                            }
                        }
                    }
                    if (countOfCall > 0) {
                        var CallWidth = (Schedules.offsetWidth - 20) / CallJson.length;
                        call.style.width = CallWidth + "px";
                        var getAllCalls = call.parentElement.querySelectorAll(".call2", ".call");

                        var callLeft = i * CallWidth;
                        call.style.left = ((Schedules.offsetLeft + 10) + callLeft) + "px";

                    } else {
                        if (CallWidth > 0) {
                            call.style.width = CallWidth + "px";
                            var callLeft = i * CallWidth;
                            call.style.left = ((Schedules.offsetLeft + 10) + callLeft) + "px";
                        }
                    }
                } else {
                    var CallWidth = (Schedules.offsetWidth - 20);
                    call.style.width = CallWidth + "px";
                }
                var callInfo = GHVHS.DOM.create({ "Type": "div", "Class": "callInfo", "Id": "callInfo", "Parent": call });

                var CallName = GHVHS.DOM.create({ "Type": "div","Style":"font-size:160%;", "Class": "CallData", "Id": "CallName", "Parent": callInfo });
                CallName.innerHTML = personName;
                if (Access) {
                    if (Access == "True") {
                        var editIcon = GHVHS.DOM.create({ "Type": "img", "Class": "iconEditOnCall", "Src": "/img/editIconOnCall.png", "Id": CallJson[i]["Fields"].ItemID, "Parent": CallName });
                        editIcon.onclick = function () {
                            var id = this.id;
                            OnCallDeskTop.DrawSlideUpEditForm(CallJson, id);
                        }
                        var deleteIcon = GHVHS.DOM.create({ "Type": "img", "Class": "iconEditOnCall", "Src": "/img/deleteOnCall.png", "Id": CallJson[i]["Fields"].ItemID, "Parent": CallName });
                        deleteIcon.onclick = function () {
                            var id = this.id;
                            OnCallDeskTop.DrawDeleteButton(id);
                        }

                    }
                }

                var callDept = GHVHS.DOM.create({ "Type": "div", "Style": "font-size:110%;", "Class": "CallData", "Id": "callDept", "Parent": callInfo });
                callDept.innerHTML = Title + "<br>" + DeptDescription;

                var callDate = GHVHS.DOM.create({ "Type": "div", "Class": "CallData", "Id": "callDate", "Parent": callInfo });
                callDate.innerHTML = Dated;

                

                var callTime = GHVHS.DOM.create({ "Type": "div", "Class": "CallData", "Style": "font-size:130%;", "Id": "callTime", "Parent": callInfo });
                callTime.innerHTML = startTimeLabel + "<br> <span style='padding-left:1.6%;font-size:130%;'> - </span><br>" + endTimeLabel;

                var callInfoComment = GHVHS.DOM.create({ "Type": "div", "Class": "callInfoComment", "Id": "callInfoComment", "Parent": call });
                callInfoComment.innerHTML += CallJson[i]["Fields"]["Comments"];

            }
        }

    },
    DrawDeleteButton:function(id){
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        canvas2.onclick = function (e) {
            if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                document.getElementById('canvas').removeChild(this);
                var broswer = GHVHS.DOM.getBrowserType();
            }
        }
        
        loader = GHVHS.DOM.create({ "Type": "div", "Class": "loader", "Id": "loader", "Parent": canvas2 });
        ConfirmRemoveContainer = GHVHS.DOM.create({ "Type": "div", "Parent": loader, "Class": "ConfirmRemoveContainer" });
        ConfirmRemoveContainer.style.width = (canvas.offsetWidth * 0.3) - 20 + "px";
        ConfirmRemoveContainer.style.left = "34%";
        ConfirmRemove = GHVHS.DOM.create({ "Type": "div", "Parent": ConfirmRemoveContainer, "Content": "Are you sure you want to delete this time from the schedule ?", "Class": "ConfirmRemove" });

        ConfirmRemove.style.lineHeight = "2em";
        Confirm = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": id, "Parent": ConfirmRemove, "Content": "Confirm" });
        Confirm.style.marginBottom = "5px";
        Confirm.onclick = function () {
            GHVHS.DOM.DrawSmallLoader2();
            function redrawOnDelete(json) {
                if (json.data == "true") {
                    window.location.href = window.location.href;
                } else {
                    OnCallDeskTop.drawErrorMsg("An Error Occured!");
                }
            }
            GHVHS.DOM.send({ "URL": "/OnCall/DeleteCallTime/" + id, "Callback": redrawOnDelete, "CallbackParams": [] });
        }

        Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": "Cancel", "Parent": ConfirmRemove, "Content": "Cancel" });
    },
    CalculateDate: function (Date, OffSet) {
        var Current = dates.convert(Date);
        Current.setDate(Current.getDate() + OffSet);
        return dates.getFormattedDate(Current);
    },
    DrawDateContainer:function(elem, Dated){
        var dateContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dateContainer", "Id": "dateContainer", "Parent": elem });
        var leftDateArrow = GHVHS.DOM.create({ "Type": "img", "Src": "/img/downwhite.png", "Class": "leftDateArrow", "Id": "leftDateArrow", "Parent": dateContainer });
        leftDateArrow.onclick = function () {
            var newDate = OnCallDeskTop.CalculateDate(Dated, -1);
            if (window.location.href.indexOf("?date") >= 0) {
                var urlParts = window.location.href.split("?date");
                window.location.href = urlParts[0] + "?date=" + newDate;
            } else if (window.location.href.indexOf("&date") >= 0) {
                var urlParts = window.location.href.split("&");
                window.location.href = urlParts[0] + "&date=" + newDate;
            } else {
                window.location.href = window.location.href + "?date=" + newDate;
            }
        }
        var dateTimeContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dateTimeContainer", "Id": "dateTimeContainer", "Parent": dateContainer });
        var dateElement = GHVHS.DOM.create({ "Type": "div", "Class": "dateElement", "Content": Dated, "Id": "dateElement", "Parent": dateTimeContainer });
        var calander = GHVHS.DOM.create({ "Type": "img", "Src": "/img/cal.png", "Class": "calander", "Id": "OnCallCal", "Parent": dateTimeContainer });
        calander.onclick = function () {
            GHVHS.DOM.drawCalander("", "", this);
        }
        var rightDateArrow = GHVHS.DOM.create({ "Type": "img", "Src": "/img/downwhite.png", "Class": "rightDateArrow", "Id": "rightDateArrow", "Parent": dateContainer });
        rightDateArrow.onclick = function () {
            var newDate = OnCallDeskTop.CalculateDate(Dated, 1);
            if (window.location.href.indexOf("?date") >= 0) {
                var urlParts = window.location.href.split("?date");
                window.location.href = urlParts[0] + "?date=" + newDate;
            } else if (window.location.href.indexOf("&date") >= 0) {
                var urlParts = window.location.href.split("&");
                window.location.href = urlParts[0] + "&date=" + newDate;
            } else {
                window.location.href = window.location.href + "?date=" + newDate;
            }

        }
    },
    

    DrawMonth: function (Groups, Data, Days, Month, Year, Entity, Department, UserName, id, Access, Admin) {
        var getmain = document.getElementById("MainContent");
        var getHeader = document.getElementById("header");
        for (var i = 0; i < Groups.length; i++) {
            if (Groups[i]["Fields"]["GroupID"] == id) {
                selectedGroup = Groups[i];
            }
        }
        getmain.style.marginTop = (getHeader.offsetHeight + 20) + "px";
        var OnCallContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallContainer", "Id": "OnCallContainer", "Style": "margin-top:0%;", "Parent": document.getElementById('MainContent') });
        var TopBar = RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": OnCallContainer });
        OnCallDeskTop.drawSideMenu("", OnCallContainer, Access, id, Admin, selectedGroup);
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
       
        var TOnCall = GHVHS.DOM.create({ "Type": "div", "Class": "TOnCall", "Id": "TOnCall", "Content": "On Call Monthly", "Parent": TopBar });
        var getUser = UserName.replace("GHVHS", "");
        var WelUser = GHVHS.DOM.create({ "Type": "div", "Class": "WelUser", "Id": "WelUser", "Content": "Welcome: " + getUser, "Parent": TopBar });
       
        OnCallDeskTop.drawLeftContainer(Groups, selectedGroup, OnCallContainer, [Data.OnCall, Data.Person, Data.Phone], "N");
        var LeftContainer = GHVHS.DOM.create({ "Type": "div", "Class": "LeftContainer", "Id": "LeftContainer", "Parent": OnCallContainer });
        OnCallDeskTop.Groups = Groups;
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthShorts = monthNames;
        var monthName = monthNames[Number(Month)];
        var monthShort = monthShorts[Number(Month)];
        var main = document.getElementById("MainContent");
        //OnCallDeskTop.DrawTopBar(LeftContainer, monthName, monthShort, Month, Year, Entity, Department);
        OnCallDeskTop.drawCalender(LeftContainer, Data, Days, Month, Year);
    },
    drawCalender: function (Elem, Data, Days, Month, Year) {
        var MonthCalander = GHVHS.DOM.create({ "Type": "div", "Class": "MonthCalander", "Id": "MonthCalander", "Parent": Elem });
        MonthCalander.onmouseover = function (e) {
            if (e.target.className != "ScheduleForDay"){
                var all = this.querySelectorAll(".ScheduleForDay");
                for (var i = 0; i < all.length; i++) {
                    all[i].style.backgroundColor = "white";
                }
                if (OnCallDeskTop.CurrentSelected) {
                    var getSelectedDocument = document.getElementById(OnCallDeskTop.CurrentSelected + "row");
                    var getAll = getSelectedDocument.parentElement.querySelectorAll("." + getSelectedDocument.className);
                    for (var j = 0; j < getAll.length; j++) {
                        getAll[j].style.backgroundColor = "white";
                    }
                }
            }
        }
        var DaysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var WeekDaysContainer = GHVHS.DOM.create({ "Type": "div", "Class": "WeekDaysContainer", "Id": "WeekDaysContainer", "Parent": MonthCalander });
        for (var i = 0; i < DaysOfTheWeek.length; i++) {
            DayName = GHVHS.DOM.create({ "Type": "div", "Class": "DayName", "Id": i + "", "Parent": WeekDaysContainer });
            DayName.innerHTML = DaysOfTheWeek[i];
        }
        var DaysOfTheMonth = GHVHS.DOM.create({ "Type": "div", "Class": "DaysOfTheMonth", "Id": "DaysOfTheMonth", "Parent": MonthCalander });
        var d = new Date(Year, Month-1, 1);
        var n = d.getDay();
        if (n > 0) {
            monthToCheck = Month - 1;
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
        for (var i = 0; i < Days; i++) {
            SingleMonthDay = GHVHS.DOM.create({ "Type": "div", "Class": "SingleMonthDay", "Id": "SingleMonthDay", "Parent": MonthCalander });
            SingleMonthDay.id = Month + "/" + (i + 1) + "/" + Year;
            DayLabel = GHVHS.DOM.create({ "Type": "div", "Class": "DayLabel", "Id": "DayLabel", "Parent": SingleMonthDay });
            DayLabel.innerHTML = (i+1) + "";
            
            for (var j = 0; j < Data.OnCall.length; j++) {
                start = Data.OnCall[j].Fields.StartTime;
                end = Data.OnCall[j].Fields.EndTime;
                currentDate2 = Month + "/" + (i + 1) + "/" + Year + " 0:00:01 AM";
                currentDate1 = Month + "/" + (i + 1) + "/" + Year + " 11:59:59 PM"
                callOne = dates.convert(start);
                callTwo = dates.convert(end);

                var Today = dates.convert(currentDate1);
                var startTimeLabel = "";
                var endTimeLabel = "";
                var startHour = callOne.getHours();
                var EndHour = callTwo.getHours();
                var check1 = dates.convert(dates.getFormattedDate(Today));
                var check2 = dates.convert(dates.getFormattedDate(callTwo));
                var check3 = dates.convert(dates.getFormattedDate(callOne));
                var compareEnd = dates.compare(check2, check1);
                var compareStart = dates.compare(check3, check1);
                if (compareEnd == 1) {
                    endTimeLabel = "12 am";
                } else {
                    if (EndHour > 12) {
                        endTimeLabel = EndHour - 12 + " pm";
                    } else {
                        endTimeLabel = EndHour  + " am";
                    }
                }
                if (compareStart == -1) {
                    startTimeLabel = "12 am";
                    var checks = SingleMonthDay.querySelectorAll(".ScheduleForDay");
                    if (checks) {
                        if (checks.length > 0) {
                            startHour = callOne.getHours();
                        }
                    }
                } else {
                    startHour = callOne.getHours();
                    if (startHour > 12) {
                        startTimeLabel = startHour - 12 + " pm";
                    } else {
                        startTimeLabel = startHour + " am";
                    }
                    
                } 

                
                endTimeLabel = endTimeLabel.replace(" ", ":00");
                startTimeLabel = startTimeLabel.replace(" ", ":00");
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
                    ScheduleForDay.innerHTML = personName + "<br>" + startTimeLabel +
                        " - " +endTimeLabel;
                    ScheduleForDay.id = Data.OnCall[j].Fields.ExternalID;

                    ScheduleForDay.onmouseover = function () {
                        var all = this.parentElement.parentElement.parentElement.querySelectorAll(".ScheduleForDay");
                        for (var i = 0; i < all.length; i++ ){
                            all[i].style.backgroundColor = "white";
                        }
                        this.style.backgroundColor = "silver";
                        OnCallDeskTop.CurrentSelected = this.id;
                        var getSelectedDocument = document.getElementById(this.id + "row");
                        getSelectedDocument.style.backgroundColor = "silver";
                        var getAll = getSelectedDocument.parentElement.querySelectorAll("." + getSelectedDocument.className);
                        for (var j = 0; j < getAll.length; j++){
                            getAll[j].style.backgroundColor = "white";
                        }
                        getSelectedDocument.style.backgroundColor = "silver";
                    }
                }
            }
        }
    },
    CurrentSelected:"",
    drawErrorMsg: function ( Message) {
        var cnavas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById("canvas") });
        var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Parent": cnavas2 });
        Error.innerHTML = Message;
        Error.style.top = 200 + "px";
        Error.style.left = (((cnavas2.offsetWidth / 2) - 150)) + "px";
        var ErrorOff = setTimeout(function () {
            document.getElementById("canvas").removeChild(cnavas2);
        }, 2500);
    },
    drawSuccessMsg: function (Message) {
        var cnavas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById("canvas") });
        var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Parent": cnavas2 });
        Error.innerHTML = Message;
        Error.style.color = "#00ff00";
        Error.style.top = 200 + "px";
        Error.style.left = (((cnavas2.offsetWidth / 2) - 150)) + "px";
        var ErrorOff = setTimeout(function () {
            document.getElementById("canvas").removeChild(cnavas2);
        }, 2500);
    },
    DrawHistory: function (UserName, Dated, GroupsJson, Data, SingleGroupJson, id, Page, Label, Admin) {
        var getmain = document.getElementById("MainContent");
        var getHeader = document.getElementById("header");
        getmain.style.marginTop = (getHeader.offsetHeight + 20) + "px";

        var OnCallContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallContainer", "Id": "OnCallContainer", "Parent": document.getElementById('MainContent') });
        var TopBar = RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": OnCallContainer });
        OnCallDeskTop.drawSideMenu("", OnCallContainer, "", id, Admin, SingleGroupJson);
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
        var TOnCall = GHVHS.DOM.create({ "Type": "div", "Class": "TOnCall", "Id": "TOnCall", "Content": "On Call History", "Parent": TopBar });
        var getUser = UserName.replace("GHVHS", "");
        var WelUser = GHVHS.DOM.create({ "Type": "div", "Class": "WelUser", "Id": "WelUser", "Content": "Welcome: " + getUser, "Parent": TopBar });
        OnCallDeskTop.drawLeftContainer(GroupsJson, SingleGroupJson, OnCallContainer, "", "Y");



        var LeftContainer = GHVHS.DOM.create({ "Type": "div", "Class": "LeftContainer", "Id": "LeftContainer", "Parent": OnCallContainer });
       
        var HistoryButtomContainer = GHVHS.DOM.create({ "Type": "div", "Id": "HistoryButtomContainer", "Class": "HistoryButtomContainer", "Parent": LeftContainer });
        var CurrentSiteButtom = GHVHS.DOM.create({ "Type": "a", "Href": "/OnCall/History/" + id, "Id": "HistoryButton", "Class": "SelectedHistoryButton", "Parent": HistoryButtomContainer });
        var textLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textLabel", "Class": "textLabel", "Content": "View Daily History", "Parent": CurrentSiteButtom });
        var CurrentSiteButtom2 = GHVHS.DOM.create({ "Type": "a", "Href": "/OnCall/WeeklyHistory/"+id+"?Date=" + Dated, "Id": "HistoryButton", "Class": "HistoryButton", "Parent": HistoryButtomContainer });
        var textLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textLabel", "Class": "textLabel", "Content": "View Weekly History", "Parent": CurrentSiteButtom2 });
        var CurrentSiteButtom3 = GHVHS.DOM.create({ "Type": "a", "Href": "/OnCall/MonthlyHistory/" + id + "?Date=" + Dated, "Id": "HistoryButton", "Class": "HistoryButton", "Parent": HistoryButtomContainer });
        var textLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textLabel", "Class": "textLabel", "Content": "View Monthly History", "Parent": CurrentSiteButtom3 });
        if (Page == "Week") {
            CurrentSiteButtom2.className = "SelectedHistoryButton";
            CurrentSiteButtom3.className = "HistoryButton";
            CurrentSiteButtom.className = "HistoryButton";
        } else if (Page == "Month") {
            CurrentSiteButtom3.className = "SelectedHistoryButton";
            CurrentSiteButtom2.className = "HistoryButton";
            CurrentSiteButtom.className = "HistoryButton";
        }
        var DateLabel = GHVHS.DOM.create({ "Type": "div", "Id": "DateLabel", "Class": "DateLabel", "Parent": LeftContainer });
        DateLabel.innerHTML = Label;


        var TableContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TableContainerLarger", "Id": "TableContainer", "Parent": LeftContainer });
        var HistoryTable = GHVHS.DOM.create({ "Type": "table", "Class": "HistoryTable", "Id": "HistoryTable", "Parent": TableContainer });

        HistoryHeader = GHVHS.DOM.create({ "Type": "thread", "Class": "HistoryHeader", "Id": "HistoryHeader", "Parent": HistoryTable });
        row = GHVHS.DOM.create({ "Type": "td", "Class": "HistoryTopRow", "Id": "row", "Content": "Name", "Parent": HistoryHeader });
        row = GHVHS.DOM.create({ "Type": "td", "Class": "HistoryTopRow", "Id": "row", "Content": "Start Time", "Parent": HistoryHeader });
        row = GHVHS.DOM.create({ "Type": "td", "Class": "HistoryTopRow", "Id": "row", "Content": "End Time", "Parent": HistoryHeader });
        row = GHVHS.DOM.create({ "Type": "td", "Class": "HistoryTopRow", "Id": "row", "Content": "Event", "Parent": HistoryHeader });
        row = GHVHS.DOM.create({ "Type": "td", "Class": "HistoryTopRow", "Id": "row", "Content": "Comments", "Parent": HistoryHeader });
        row = GHVHS.DOM.create({ "Type": "td", "Class": "HistoryTopRow", "Id": "row", "Content": "Updated By", "Parent": HistoryHeader });
        row = GHVHS.DOM.create({ "Type": "td", "Class": "HistoryTopRow", "Id": "row", "Content": "Updated Date", "Parent": HistoryHeader });
       
        HistoryBody = GHVHS.DOM.create({ "Type": "tbody", "Class": "HistoryBody", "Id": "HistoryBody", "Parent": HistoryTable });
        for (var i = 0; i < Data.length; i++) {
            tr = GHVHS.DOM.create({ "Type": "tr", "Class": "SingleRowHistory", "Id": "TableRow" + i, "Parent": HistoryBody });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "DataColumn", "Id": "row", "Content": Data[i]["Fields"]["FirstName"] + " " + Data[i]["Fields"]["LastName"], "Parent": tr });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "DataColumn", "Id": "row", "Content": Data[i]["Fields"]["StartTime"], "Parent": tr });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "DataColumn", "Id": "row", "Content": Data[i]["Fields"]["EndTime"], "Parent": tr });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "DataColumn", "Id": "row", "Content": Data[i]["Fields"]["Event"], "Parent": tr });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "DataColumn", "Id": "row", "Content": Data[i]["Fields"]["Comments"], "Parent": tr });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "DataColumn", "Id": "row", "Content": Data[i]["Fields"]["UpdateBy"], "Parent": tr });
            row = GHVHS.DOM.create({ "Type": "td", "Class": "DataColumn", "Id": "row", "Content": Data[i]["Fields"]["UpdateDate"], "Parent": tr });

        }
    },
    GroupId: "",
    DrawSlideUpEditForm: function (callJson, id) {
       
        var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById("canvas") });
        var X = GHVHS.DOM.create({ "Type": "img", "Class": "whiteX", "Id": "whiteX", "Src": "/img/xWhite.png", "Parent": canvas2 });
        X.onclick = function () {
            document.getElementById("canvas").removeChild(canvas2);   
        }
        var conainer = GHVHS.DOM.create({ "Type": "div", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var NewEventContainerTitle = GHVHS.DOM.create({ "Type": "div", "Class": "NewEventContainerTitle", "Id": "NewEventContainerTitle", "Parent": conainer });
        NewEventContainerTitle.innerHTML = OnCallDeskTop.SelectedGroup.Fields.GroupName;
        var getSelectedOnCall = [];
        for (var i = 0; i < callJson.length; i++) {
            if (callJson[i].Fields.ItemID == id) {
                getSelectedOnCall = callJson[i];
            }
        }
        var startTime = new Date(getSelectedOnCall.Fields.StartTime);
        var EndTime = new Date(getSelectedOnCall.Fields.EndTime);
        var EndHour = EndTime.getHours();
        var StartHour = startTime.getHours();
        var start = dates.getFormattedDate(startTime);
        var end = dates.getFormattedDate(EndTime);
        var NewEventContainer = GHVHS.DOM.create({ "Type": "div", "Class": "NewEventContainer","Style":"margin-left:0%;width:99.4%;border-radius:5px; height:80%;", "Id": "NewEventContainer", "Parent": conainer });
        OnCallDeskTop.drawUserSearchFilter(NewEventContainer, { "Label": "Name", "DefaultValue": getSelectedOnCall.Fields.FirstName + " " + getSelectedOnCall.Fields.LastName, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Click To Select A User...", "FilterType": "Y" }, OnCallDeskTop.AllPeopleInGroup);
        OnCallDeskTop.drawTimeFieldsAndLabel("Start Time", start, StartHour);
        OnCallDeskTop.drawTimeFieldsAndLabel("End Time", end, EndHour);
        OnCallDeskTop.drawRepeatField(NewEventContainer);
        OnCallDeskTop.drawCommentField(NewEventContainer);
        var save = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButtonLarge", "Id": id, "Style": "margin-left:24%;", "Content": "Save", "Parent": NewEventContainer });
        save.onclick = function () {
            var temp = OnCallDeskTop.VerifyData(this);
            var Data = temp.Data;
            if (Data[0].Name != "false") {
                OnCallDeskTop.UpdateSchedule(Data, OnCallDeskTop.GroupId, this.id);
            }
        }
        var Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButtonLarge", "Id": "Cancel", "Content": "Cancel", "Parent": NewEventContainer });

    }, 
    DrawNewEditView: function (UserName, id, today, startWeek, endWeek, Group, Groups, DefaultTimes, People, Admin) {
        var getmain = document.getElementById("MainContent");
        var getHeader = document.getElementById("header");
        OnCallDeskTop.GroupId = id;
        var currentDate = new Date();
        var currentDate2 = new Date();
        var startTime = new Date( DefaultTimes[0].Fields.StartTime);
        var EndTime = new Date(DefaultTimes[0].Fields.EndTime);
        var EndHour = EndTime.getHours();
        var StartHour = startTime.getHours();
        currentDate2.setDate(currentDate2.getDate() + 1);
        var today = dates.getFormattedDate(currentDate);
        var Tomorrow = dates.getFormattedDate(currentDate2);
        getmain.style.marginTop = (getHeader.offsetHeight + 20) + "px";
        var OnCallContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallContainer", "Id": "OnCallContainer", "Parent": document.getElementById('MainContent') });
        var TopBar = RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": OnCallContainer });
        OnCallDeskTop.drawSideMenu("", OnCallContainer, "", id, Admin, Group);
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

        var TOnCall = GHVHS.DOM.create({ "Type": "div", "Class": "TOnCall", "Id": "TOnCall", "Content": "On Call", "Parent": TopBar });
        var getUser = UserName.replace("GHVHS", "");
        var WelUser = GHVHS.DOM.create({ "Type": "div", "Class": "WelUser", "Id": "WelUser", "Content": "Welcome: " + getUser, "Parent": TopBar });

        var NewEventContainerTitle = GHVHS.DOM.create({ "Type": "div", "Class": "NewEventContainerTitle", "Id": "NewEventContainerTitle", "Parent": OnCallContainer });
        NewEventContainerTitle.innerHTML = Group.Fields.GroupName;

        var NewEventContainer = GHVHS.DOM.create({ "Type": "div", "Class": "NewEventContainer", "Id": "NewEventContainer", "Parent": OnCallContainer });
        OnCallDeskTop.drawUserSearchFilter(NewEventContainer, { "Label": "Name", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Click To Select A User...", "FilterType": "Y" }, People);
        OnCallDeskTop.drawTimeFieldsAndLabel("Start Time", today, StartHour);
        OnCallDeskTop.drawTimeFieldsAndLabel("End Time", Tomorrow, EndHour);
        OnCallDeskTop.drawRepeatField(NewEventContainer);
        OnCallDeskTop.drawCommentField(NewEventContainer);
        var save = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButtonLarge", "Id": "Save", "Style": "margin-left:24%;", "Content": "Save", "Parent": NewEventContainer });
        save.onclick = function () {
            var temp = OnCallDeskTop.VerifyData(this);
            var Data = temp.Data;
            if (Data[0].Name != "false") {
                OnCallDeskTop.AddToSchedule(Data, OnCallDeskTop.GroupId);
            }
        }
        var Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallButtonLarge", "Id": "Cancel", "Content": "Cancel", "Parent": NewEventContainer });
        Cancel.onclick = function () {
            document.getElementById("DailyView").click();
        }
    },
    AddToSchedule:function(Data, id){
        var paramString = "?Group=" + id;
        for (var i = 0; i < Data.length; i++) {
            paramString += "&"+Data[i].Label + "=" + Data[i].Value;
        }
        function redrawSuccess(){
            document.getElementById("DailyView").click();
        }

        GHVHS.DOM.send({ "URL": "/OnCall/CreateOnCallTime" + paramString, "Callback":redrawSuccess, "CallbackParams": [] });

    },
    UpdateSchedule: function (Data, id, itemID) {
        var paramString = "?Group=" + id;
        for (var i = 0; i < Data.length; i++) {
            paramString += "&" + Data[i].Label + "=" + Data[i].Value;
        }
        paramString += "&id=" + itemID;
        function redrawSuccess() {
            document.getElementById("DailyView").click();
        }

        GHVHS.DOM.send({ "URL": "/OnCall/UpdateOnCallTime" + paramString, "Callback": redrawSuccess, "CallbackParams": [] });

    },
    VerifyData:function(Button){
        var getFieldContainers = Button.parentElement.querySelectorAll(".Field");
        var DidNotPass = [];
        var Values = { "Data": [] };
        for (var i = 0; i < getFieldContainers.length; i++){
            if (getFieldContainers[i].id == "Name") {
                var getInputField = getFieldContainers[i].querySelector(".FieldData");
                var getDropOptions = getFieldContainers[i].querySelectorAll(".DropOption");
                if (getInputField) {
                    if (getInputField.id != "Name") {
                        var verified = "N";
                        for (var j = 0; j < getDropOptions.length; j++){
                            if (getDropOptions[j].id == getInputField.id) {
                                verified = "Y";
                            }
                        }
                        if (verified == "Y") {
                            Values.Data.push({ "Label": "Person", "Value": getInputField.id });
                        } else {
                            DidNotPass.push(getInputField);
                        }
                    } else {
                        DidNotPass.push(getInputField);
                    }
                }
            } else if (getFieldContainers[i].id == "Start TimeContainer") {
                var getInputField = getFieldContainers[i].querySelector(".FieldDataCal");
                var getInputField2 = getFieldContainers[i].querySelector(".FieldTimes");
                var Date = "";
                var verified = "N";
                if (getInputField.value) {
                    Date += getInputField.value;
                    verified = "Y";
                } else {
                    DidNotPass.push(getInputField);
                    verified = "N";
                }
                if (getInputField2.value) {
                    Date += " " + getInputField2.value;
                    verified = "Y";
                } else {
                    DidNotPass.push(getInputField2);
                    verified = "N";
                }
                if (verified == "Y") {
                    Values.Data.push({ "Label": "StartTime", "Value": Date });
                } 
            } else if (getFieldContainers[i].id == "End TimeContainer") {
                var getInputField = getFieldContainers[i].querySelector(".FieldDataCal");
                var getInputField2 = getFieldContainers[i].querySelector(".FieldTimes");
                var Date = "";
                var verified = "N";
                if (getInputField.value) {
                    Date += getInputField.value;
                    verified = "Y";
                } else {
                    DidNotPass.push(getInputField);
                    verified = "N";
                }
                if (getInputField2.value) {
                    Date += " " + getInputField2.value;
                    verified = "Y";
                } else {
                    DidNotPass.push(getInputField2);
                    verified = "N";
                }
                if (verified == "Y") {
                    Values.Data.push({ "Label": "EndTime", "Value": Date });
                } 
            } else if (getFieldContainers[i].id == "Repeats") {
                var getInputField = getFieldContainers[i].querySelector(".FieldDataSmall");
                if (getInputField.value == "Daily") {
                    if (document.getElementById("RepeaterContainer")){
                        var subContainer = document.getElementById("RepeaterContainer");
                        var getSubInput1 = getFieldContainers[i].querySelector(".repeatInput");
                        var getSubInput2 = getFieldContainers[i].querySelector(".SmallCallInput");
                        Values.Data.push({ "Label": "RepeatDays", "Value": getSubInput1.value });
                        Values.Data.push({ "Label": "RepeatTil", "Value": getSubInput2.value });
                    }
                }
            }
        }
        var getComments = document.getElementById("commentsPrivate");
        var getComments2 = document.getElementById("commentsPublic");
        if (getComments.value) {
            Values.Data.push({ "Label": "PublicComment", "Value": getComments.value });
        }
        if (getComments2.value) {
            Values.Data.push({ "Label": "PrivateComment", "Value": getComments2.value });
        }
        for (var i = 0; i < getFieldContainers.length; i++) {
            var getFields = getFieldContainers[i].querySelectorAll("input");
            for (var j = 0; j < getFields.length; j++) {
                    getFields[j].style.border = "1px solid silver";
                    getFields[j].style.backgroundColor = "white";
            }
        }
        if (DidNotPass.length > 0) {
            OnCallDeskTop.drawErrorMsg("Please Enter A Value for All Required Fields<br>(Highlighted In Red)");
            for (var i = 0; i < DidNotPass.length; i++) {
                DidNotPass[i].style.border = "1px solid red";
                DidNotPass[i].style.backgroundColor = "#FF6347";
            }
            Values = {"Data":[{"Name":"false"}]};
        }
        return Values;
    },
    drawCommentField: function (NewEventContainer) {
        var CommentsContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CommentsContainer", "Id": "CommentsContainer", "Parent": NewEventContainer });
        var CommentPublicContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CommentPublicContainer", "Id": "CommentPublicContainer", "Parent": CommentsContainer });
        var CommentsLabel = GHVHS.DOM.create({ "Type": "div", "Class": "FieldLabel ", "Id": "FieldLabel ", "Content": "Public Comment", "Style": "width:25%;text-align: left;", "Parent": CommentPublicContainer });
        var commentsPublic = GHVHS.DOM.create({ "Type": "textarea", "Class": "Comments", "Id": "commentsPublic", "Parent": CommentPublicContainer });
        commentsPublic.setAttribute("placeholder", "Enter Comments Here...");

        var CommentPublicContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "CommentPublicContainer", "Style": "margin-left:1%;", "Id": "CommentPublicContainer", "Parent": CommentsContainer });
        var CommentsLabel = GHVHS.DOM.create({ "Type": "div", "Class": "FieldLabel ", "Id": "FieldLabel ", "Content": "Private Comment", "Style": "width:30%;text-align: left;", "Parent": CommentPublicContainer2 });
        var commentsPrivate = GHVHS.DOM.create({ "Type": "textarea", "Class": "Comments", "Id": "commentsPrivate", "Style": "margin-left:4%;", "Parent": CommentPublicContainer2 });
        commentsPrivate.setAttribute("placeholder", "Enter Comments Here...");

    },
    drawRepeatField: function (NewEventContainer) {
        var Field = GHVHS.DOM.create({ "Type": "div", "Class": "Field", "Id": "Repeats", "Parent": NewEventContainer });
        InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "FieldLabel ", "Id": "FieldLabel ", "Content": "Repeats", "Style": "margin-left:6%;margin-top:0.5%;text-align: left;", "Parent": Field });
        var FieldRepeat = GHVHS.DOM.create({ "Type": "input", "Class": "FieldDataSmall", "Id": "Field", "Parent": Field });
        FieldRepeat.value = "Does Not Repeat";
        FieldRepeat.onclick = function () {
            var getDrop = this.parentElement.querySelector(".DropDown");
            if (getDrop) {
                if (getDrop.style.height == "1px") {
                    getDrop.style.top = (this.offsetTop + this.offsetHeight) + "px";
                    getDrop.style.display = "block";
                    setTimeout(function () {
                        getDrop.style.height = "100px";
                    }, 10);
                } else {
                    getDrop.style.height = "1px";
                    setTimeout(function () {
                        getDrop.style.display = "none";
                    }, 500);
                }

            } else {
                DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": this.parentElement });
                DropDown.style.height = "1px";
                setTimeout(function () {
                    DropDown.style.height = "100px";
                }, 10);
                DropDown.style.display = "block";
                DropDown.style.transition = "height 0.4s ease";
                DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                DropDown.style.overflow = "auto";
                DropDown.style.backgroundColor = "white";
                DropDown.style.left = this.offsetLeft + "px";
                DropDown.style.boxShadow = "2px 2px 6px black";
                DropDown.style.width = this.offsetWidth + "px";
                DropDown.style.position = "absolute";
                var options = ["Does Not Repeat", "Daily"];
                for (var i = 0; i < options.length; i++) {
                var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Content": options[i],"Id":options[i], "Parent": DropDown });
                    SingleOption.onclick = function () {
                        var Field = this.parentElement.parentElement.querySelector(".FieldDataSmall");
                        document.getElementById("Save").style.marginTop = "3%";
                        document.getElementById("Cancel").style.marginTop = "3%";
                        if (this.innerHTML == options[0]) {
                            var parent = this.parentElement.parentElement;
                            parent.style.marginBottom = "00px";
                            if (document.getElementById("RepeaterContainer")) {
                                this.parentElement.parentElement.removeChild(document.getElementById("RepeaterContainer"));
                                Field.value = this.innerHTML;
                                var getDrop = this.parentElement;
                                getDrop.style.height = "1px";
                                setTimeout(function () {
                                    getDrop.style.display = "none";
                                }, 500);
                            } else {
                                Field.value = this.innerHTML;
                                var getDrop = this.parentElement;
                                getDrop.style.height = "1px";
                                setTimeout(function () {
                                    getDrop.style.display = "none";
                                }, 500);
                            }
                        } else {
                            var parent = this.parentElement.parentElement;
                            parent.style.marginBottom = "80px";
                            var RepeaterContainer = GHVHS.DOM.create({ "Type": "div", "Class": "RepeaterContainer", "Style":"margin-left:15%;","Id": "RepeaterContainer", "Parent": parent });
                            var DailyRepeaLabel = GHVHS.DOM.create({ "Type": "div", "Class": "DailyRepeaLabel", "Content": "Repeats every: ", "Id": "DailyRepeaLabel", "Parent": RepeaterContainer });
                            var repeatInput = GHVHS.DOM.create({ "Type": "input", "Class": "repeatInput", "Id": "repeatInput", "Parent": RepeaterContainer });
                            repeatInput.value = "1";
                            repeatInput.setAttribute("readonly", "true");
                            var choices = [];
                            for (var j = 1; j < 15; j++) { choices.push(j + ""); }
                            repeatInput.onclick = function () {
                                OnCallDeskTop.drawOnCallDropDown(repeatInput, choices);
                            }
                            var DailyRepeaLabel = GHVHS.DOM.create({ "Type": "div", "Class": "DailyRepeaLabel", "Content": " days until ", "Id": "DailyRepeaLabel", "Parent": RepeaterContainer });
                            var SmallCallInput = GHVHS.DOM.create({ "Type": "input", "Class": "SmallCallInput", "Id": "SmallCallInput", "Parent": RepeaterContainer });
                            var currentDate = new Date();
                            var today = dates.getFormattedDate(currentDate);
                            SmallCallInput.value = today;
                            SmallCallInput.onclick = function () {
                                this.id = "SelectedCal";
                                GHVHS.DOM.drawCalander("", "", this, "input");
                            };
                            document.getElementById("Save").style.marginTop = "0.5%";
                            document.getElementById("Cancel").style.marginTop = "0.5%";
                            Field.value = this.innerHTML;
                            var getDrop = this.parentElement;
                            getDrop.style.height = "1px";
                            setTimeout(function () {
                                getDrop.style.display = "none";
                            }, 500);
                        }
                        
                    }
                }

            }
        }
        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.3%;margin-left: -3%;", "Parent": Field });
        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
        addimg.onclick = function () {
            var filter = this.parentElement.parentElement.querySelectorAll(".FieldDataSmall");
            filter[0].style.border = "1px solid silver";
            filter[0].id = "";
            if (document.getElementById("Does Not Repeat")) {
                document.getElementById("Does Not Repeat").click();
            }
            filter[0].value = "";
                
        }
    },
    drawTimeFieldsAndLabel:function(Label, date, hour){
        var Field = GHVHS.DOM.create({ "Type": "div", "Class": "Field", "Id": Label + "Container", "Parent": NewEventContainer });
        InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "FieldLabel ", "Id": "FieldLabel ", "Content": Label, "Style": "margin-left:6%;margin-top:0.5%;text-align: left;", "Parent": Field });
        var FieldStartDate = GHVHS.DOM.create({ "Type": "input", "Class": "FieldDataCal", "Id": "Field", "Parent": Field });
        FieldStartDate.onclick = function () {
            this.id = "SelectedCal";
            GHVHS.DOM.drawCalander("", "", this, "input");
        };
        FieldStartDate.value = date;
        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.3%;margin-left: -3%;", "Parent": Field });
        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });

        addimg.alt = "Clear";
        addimg.onclick = function () {
            var filter = this.parentElement.parentElement.querySelectorAll(".FieldDataCal");
            filter[0].style.border = "1px solid silver";
            filter[0].id = "";
            filter[0].value = "";
        }
        var times = [];
        for (var i = 0; i < 24; i++) {
            if (i >= 12) {
                if (i > 12) {
                    times.push((i % 12) + ":00 PM");
                } else {
                    times.push("12:00 PM");
                }
            } else {
                if (i > 0) {
                    times.push(i + ":00 AM");
                } else {
                    times.push("12:00 AM");
                }
            }
        }
        var time = "";
        if (hour > 12) {
            time = ( hour%12 ) + ":00 PM";
        }else if (hour == 0){
            time = "12:00 AM";
        }else{
            time = hour+":00 AM";
        }
        var FieldStartTime = GHVHS.DOM.create({ "Type": "input", "Class": "FieldTimes", "Id": Label, "Parent": Field });
        FieldStartTime.value = time;
        FieldStartTime.setAttribute("readonly", "true");
        FieldStartTime.onclick = function () {
            OnCallDeskTop.drawOnCallDropDown(this, times);
        }
        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.3%;margin-left: -3%;", "Parent": Field });
        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
        addimg.alt = "Clear";
        addimg.onclick = function () {
            var filter = this.parentElement.parentElement.querySelectorAll(".FieldTimes");
            filter[0].style.border = "1px solid silver";
            filter[0].id = "";
            filter[0].value = "";
        }

    },
    People:[],
    drawUserSearchFilter: function (fb, fields, People) {
        NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "Field",  "Id": "Field", "Parent": fb });
        InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "FieldLabel ", "Id": "FieldLabel ", "Style": "margin-left:6%;margin-top:0.5%;text-align: left;", "Parent": NameAndInput });
        InputLabel.innerHTML = fields["Label"];
        if (!fb.querySelector(".Filter")) {
            NameAndInput.style.marginTop = "0.5%";
        }
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "FieldData", "Id": "FieldData", "Style": "background-image: url(/img/blackDrop.png);padding-left:5px; box-shadow: 2px 2px 3px black;width: 58%; height: 85%;", "Parent": NameAndInput });
        Filter.setAttribute("autocomplete", "Off");
        Filter.style.width = "58%";
        Filter.id = fields["Label"];
        if (fields["placeHolder"]) {
            Filter.setAttribute("placeholder", fields["placeHolder"]);
        }
        if (fields["DefaultValue"]) {
            Filter.value = fields["DefaultValue"];
        }
        NameAndInput.id = fields["Label"];
        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.3%;margin-left: -3%;", "Parent": NameAndInput });
        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
        addimg.alt = "Clear";
        addimg.onclick = function () {
            var filter = this.parentElement.parentElement.querySelectorAll(".FieldData");
            filter[0].style.border = "1px solid silver";
            filter[0].id = "Name";
            filter[0].value = "";
        }
        OnCallDeskTop.People = People;
        Filter.onclick = function () {
            var getDrop = this.parentElement.querySelector(".DropDown");
            if (getDrop) {
                if (getDrop.style.height == "1px") {
                    getDrop.style.top = (this.offsetTop + this.offsetHeight) + "px";
                    getDrop.style.display = "block";
                    setTimeout(function () {
                        getDrop.style.height = "150px";
                    }, 10);
                } else {
                    getDrop.style.height = "1px";
                    setTimeout(function () {
                        getDrop.style.display = "none";
                    }, 500);
                }

            } else {
                DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": this.parentElement });
                DropDown.style.height = "1px";
                setTimeout(function () {
                    DropDown.style.height = "150px";
                }, 10);
                DropDown.style.display = "block";
                DropDown.style.transition = "height 0.4s ease";
                DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                DropDown.style.overflow = "auto";
                DropDown.style.backgroundColor = "white";
                DropDown.style.left = this.offsetLeft + "px";
                DropDown.style.boxShadow = "2px 2px 6px black";
                DropDown.style.width = this.offsetWidth + "px";
                DropDown.style.position = "absolute";
                var that = this;
                for (var i = 0; i < OnCallDeskTop.People.length; i++) {
                    var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Id": OnCallDeskTop.People[i]["Fields"]["ExternalID"], "Content": OnCallDeskTop.People[i]["Fields"]["FirstName"] + " " + OnCallDeskTop.People[i]["Fields"]["LastName"], "Parent": DropDown });
                    SingleOption.onclick = function () {
                        that.value = this.innerHTML;
                        that.id = this.id;
                        that.click();
                    }
                }
            }

        }
        
           
    },
    getAndSearchusers: function (filter, parent, value, PDR) {
        var DropDown = parent.querySelector(".DropDown");
        if (DropDown) {
            while (DropDown.firstChild) {
                DropDown.removeChild(DropDown.firstChild);
            }

        } else {
            DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": parent });
            DropDown.style.height = "1px";
            DropDown.style.display = "none";
            DropDown.style.transition = "height 0.4s ease";
            DropDown.style.top = (filter.offsetTop + filter.offsetHeight) + "px";
            DropDown.style.overflow = "auto";
            DropDown.style.backgroundColor = "white";
            DropDown.style.left = filter.offsetLeft + "px";
            DropDown.style.boxShadow = "2px 2px 6px black";
            DropDown.style.width = filter.offsetWidth + "px";
            DropDown.style.position = "absolute";
            filter.onclick = function () {
                if (DropDown.style.height == "1px") {
                    DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                    DropDown.style.display = "block";
                    setTimeout(function () {
                        DropDown.style.height = "160px";
                    }, 10);
                } else {
                    DropDown.style.height = "1px";
                    setTimeout(function () {
                        DropDown.style.display = "none";
                    }, 500);
                }
            }
        }
        var firstname = "";
        var lastName = "";
        var splitCheck = [];
        if (value.indexOf(" ") >= 0) {
            splitCheck = value.split(" ");
            var checkValue = splitCheck[splitCheck.length - 1];
            firstname = checkValue[0];
            lastName = checkValue[0];
        } else {
            var firstname = value;
        }

        GHVHS.DOM.send({ "URL": "/OnCall/GetPeople?FirstName=" + firstname + "&LastName=" + lastName, "CallbackParams": [DropDown, filter, PDR], "Callback": OnCallDeskTop.displayUsers });
       

    },
    displayUsers: function(json, p) {
        for (var i = 0; i < json["Data"].length; i++) {
                var data = json["Data"][i]["Fields"];
                var filter = p[1];
                var nameCheck = p[2];
                var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Parent": p[0] });
                SingleOption.innerHTML = data.FirstName + " " + data.LastName;
                SingleOption.id = data.ExternalID;
                SingleOption.onclick = function () {
                    filter.value = this.innerText;
                    filter.id = this.id;
                    filter.style.border = "1px solid silver";
                    this.parentElement.style.height = "1px";
                    var that = this; 
                    setTimeout(function () {
                        that.parentElement.style.display = "none";
                    }, 500);
                }
                JsonValue = data.FirstName + " " + data.LastName;
                tempValue = filter.value;
                var splitCheck = [];
                if (tempValue.indexOf(";") >= 0) {
                    splitCheck = tempValue.split(";");
                    var checkValue = splitCheck[splitCheck.length - 1];
                } else {
                    var checkValue = tempValue;
                }
                var check = checkValue.toLowerCase();
                var check2 = JsonValue.toLowerCase();
                if (check == check2) {
                    SingleOption.click();
                }

            }
    },
    drawOnCallDropDown: function (Elem, options) {

        var getDrop = Elem.parentElement.querySelector(".DropDown");
        if (getDrop) {
            if (getDrop.style.height == "1px") {
                getDrop.style.top = (this.offsetTop + this.offsetHeight) + "px";
                getDrop.style.display = "block";
                setTimeout(function () {
                    getDrop.style.height = "150px";
                }, 10);
            } else {
                getDrop.style.height = "1px";
                setTimeout(function () {
                    getDrop.style.display = "none";
                }, 500);
            }

        } else {
            DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": Elem.parentElement });
            DropDown.style.height = "1px";
            setTimeout(function () {
                DropDown.style.height = "150px";
            }, 10);
            DropDown.style.display = "block";
            DropDown.style.transition = "height 0.4s ease";
            DropDown.style.top = (Elem.offsetTop + Elem.offsetHeight) + "px";
            DropDown.style.overflow = "auto";
            DropDown.style.backgroundColor = "white";
            DropDown.style.left = Elem.offsetLeft + "px";
            DropDown.style.boxShadow = "2px 2px 6px black";
            DropDown.style.width = Elem.offsetWidth + "px";
            DropDown.style.position = "absolute";
            for (var i = 0; i < options.length; i++) {
                var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Content": options[i], "Parent": DropDown });
                SingleOption.onclick = function () {
                    Elem.value = this.innerHTML;
                    Elem.click();
                }
            }
        }
    },
    drawSideMenu: function (Selected, Elem, Access, GroupId, Admin, Group) {
        // backg is the black background when slide menu is slided out on screen
        var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "sidebackground", "Style": "z-index:7000000000000000000000000009;display:none", "Parent": document.getElementById("canvas") });
        SideMenu = GHVHS.DOM.create({ "Type": "div", "Class": "SideMenu", "Id": "SideMenu", "Parent": document.getElementById("canvas") });

        var menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/menu.png", "Style": "margin-right:1%;height:5%;width:10%;margin-left:75%;", "Class": "menu", "Id": "menu", "Parent": SideMenu });
        menu.onclick = function () {
            var getMenu = document.getElementById("SideMenu");
            getMenu.style.left = "-1000px";
            if (document.getElementById("sidebackground").style.display == "block") {
                setTimeout(function () {
                    document.getElementById("sidebackground").style.display = "none";
                }, 10);
            }
        }
       
        var links = [{ "Label": "Daily View", "Link": "/OnCall/Daily/" + GroupId }, { "Label": "Monthly View", "Link": "/OnCall/Month/" + GroupId }, { "Label": "History", "Link": "/OnCall/History/" + GroupId  }]

        if (Access) {
            if (Access == "True") {
                links.push({ "Label": "New Calendar Event", "Link": "/OnCall/NewCalendarEvent/" + GroupId })

            }
        }
        if (Admin) {
            if (Admin == "True") {
                links.push({ "Label": "Manage Group Members" , "Link": "/OnCall/Administration/" + GroupId })

            }
        }

        //loop nav data to know what links are avaiable to user and draw to side menu in UI
        for (var i = 0; i < links.length; i++) {

            SideLinks = GHVHS.DOM.create({ "Type": "a", "Class": "SideLinks", "Id": "SideLinks", "Parent": SideMenu });
            SideLinks.href = links[i]["Link"];
            SideLinks.innerHTML = links[i]["Label"];

        }
        

        var img = GHVHS.DOM.create({ "Type": "img", "Class": "bottomIcon", "Src": "/img/logo.png", "Id": "bottomIcon", "Parent": SideMenu });

    },
    GobalGroupID:"",
    DrawAdminPage: function (UserName, Group, AllGroups, PeopleInGroup, AllPeople, groupId) {
        var OnCallContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallContainer", "Id": "OnCallContainer",  "Parent": document.getElementById('MainContent') });
        var TopBar = RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": OnCallContainer });
        OnCallDeskTop.drawSideMenu("", OnCallContainer, "", groupId, "", Group);
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
        OnCallDeskTop.GobalGroupID = groupId;
        var TOnCall = GHVHS.DOM.create({ "Type": "div", "Class": "TOnCall", "Id": "TOnCall", "Content": "Manage Group Members", "Parent": TopBar });
        var getUser = UserName.replace("GHVHS", "");
        var WelUser = GHVHS.DOM.create({ "Type": "div", "Class": "WelUser", "Id": "WelUser", "Content": "Welcome: " + getUser, "Parent": TopBar });
      

        var TitleAdmin = GHVHS.DOM.create({ "Type": "div", "Class": "TitleAdmin", "Id": "TitleAdmin", "Content": Group.Fields.GroupName, "Parent": OnCallContainer });
        OnCallDeskTop.Groups = AllGroups;
        var ContentCloumn1 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn1", "Id": "ContentCloumn1", "Parent": OnCallContainer });
        OnCallDeskTop.drawColumn(ContentCloumn1, AllPeople, "All People");
        var ArrowContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainer", "Id": "ArrowContainer", "Parent": OnCallContainer });
        OnCallDeskTop.DrawArrows(ArrowContainer);
        var ContentCloumn2 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn1", "Id": "ContentCloumn2", "Parent": OnCallContainer });
        OnCallDeskTop.drawColumn(ContentCloumn2, PeopleInGroup, "People in Group" );
},
    drawColumn: function (Column, Data, Title, Groups ) {
        var masterElem = Column;
        var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle", "Content": "Assignments", "Parent": masterElem });
        CloumnTitle.innerHTML = Title;
        var UsersinRoles = GHVHS.DOM.create({ "Type": "div", "Class": "UsersinRoles", "Id": "UsersinRoles", "Parent": masterElem });
        if (Groups) {
            var columns = ["GroupName", ];
            var dataColumns = ["GroupName"];

        } else {
            var columns = ["FirstName", "LastName", "Type", "Title"];
            var dataColumns = ["FirstName", "LastName", "PeopleType", "Title"];
        }
        var SingleUserInRoleHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUserInRoleHeader", "Id": "SingleUserInRoleHeader", "Parent": UsersinRoles });
        for (var i = 0; i < columns.length; i++) {
            var SingleFieldsHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFieldsHeader", "Id": "SingleFieldsHeader", "Content": columns[i], "Parent": SingleUserInRoleHeader });
            
        }
        
        for (var i = 0; i < Data.length; i++) {
            var SingleUserInRole = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUserInRole", "Id": "SingleUserInRole", "Parent": UsersinRoles });
            SingleUserInRole.onclick = function () {
                var getAll = this.parentElement.querySelectorAll(".SingleUserInRoleSelected");
                for (var j = 0; j < getAll.length; j++){
                    getAll[j].className = "SingleUserInRole";
                }
                this.className = "SingleUserInRoleSelected";
            }
            SingleUserInRole.id =  Data[i]["Fields"]["ExternalID"];
            for (var j = 0; j < dataColumns.length; j++) {
                var SingleFields = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFields", "Id": "SingleFields", "Parent": SingleUserInRole });
                SingleFields.innerHTML = Data[i]["Fields"][dataColumns[j]];
                SingleFields.id = dataColumns[j];
               
            }
            if (Data[i]["Fields"]["MemberID"]) {
                SingleUserInRole.id = Data[i]["Fields"]["MemberID"];
            }
        
        }
    },
DrawArrows:function(parent){
    var ArrowContainer1 = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainerSmall","Style":"margin-top:60%;",  "Id": "ArrowContainer1", "Parent": parent });
    var Arrows1 = GHVHS.DOM.create({ "Type": "img","Src":"/img/whiteDoubleArrows.png", "Class": "Arrows", "Id": "Arrows1", "Parent": ArrowContainer1 });
    ArrowContainer1.onclick = function () {
       
        OnCallDeskTop.CheckAndCreateNewEntry();
        
    }

    var ArrowContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainerSmall", "Id": "ArrowContainer2", "Parent": parent });
    var Arrows2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/whiteDoubleArrows.png", "Class": "Arrows rotate", "Id": "Arrows2", "Parent": ArrowContainer2 });
    ArrowContainer2.onclick = function () {
        OnCallDeskTop.CheckAndDelete();
    }
},
CheckAndDelete: function () {
    var getCorrectColumn = document.getElementById("ContentCloumn2");
    var checkForSelected = getCorrectColumn.querySelector(".SingleUserInRoleSelected");
    if (checkForSelected) {
        var params = "";
        var getFields = checkForSelected.querySelectorAll(".SingleFields");
        params = "?id=" + checkForSelected.id;
        function CheckAndRedrawPage(json) {
            document.getElementById("canvas").removeChild(document.getElementById("FaxTableLoader"));
            if (json.data == "true") {
                OnCallDeskTop.drawSuccessMsg("Person has been removed from On Call Group Members");
                setTimeout(function () {
                    GHVHS.DOM.DrawSmallLoader2();
                    window.location.href = window.location.href;
                }, 3000);
            } else {
                OnCallDeskTop.drawErrorMsg("Something went wrong please try again later");
            }
        }
        GHVHS.DOM.DrawSmallLoader2();
        GHVHS.DOM.send({ "URL": "/OnCall/DeleteMember" + params, "CallbackParams": [], "Callback": CheckAndRedrawPage });
    } else {
        OnCallDeskTop.drawErrorMsg("Please Select a Person To Give Access To");
    }


},
CheckAndCreateNewEntry: function () {
    var getCorrectColumn = document.getElementById("ContentCloumn1");
    var checkForSelected = getCorrectColumn.querySelector(".SingleUserInRoleSelected");
    if (checkForSelected) {
        var params = "";
        var getFields = checkForSelected.querySelectorAll(".SingleFields");
        params = "?id=" + checkForSelected.id;
        params += "&GroupId=" + OnCallDeskTop.GobalGroupID;
        function CheckAndRedrawPage(json) {
            document.getElementById("canvas").removeChild(document.getElementById("FaxTableLoader"));
            if (json.data == "true") {
                OnCallDeskTop.drawSuccessMsg("Person has been added to On Call Group Members");
                setTimeout(function () {
                    GHVHS.DOM.DrawSmallLoader2();
                    window.location.href = window.location.href;
                }, 3000);
                
            } else {
                OnCallDeskTop.drawErrorMsg("Something went wrong please try again later");
            }
        }
        GHVHS.DOM.DrawSmallLoader2();
        GHVHS.DOM.send({ "URL": "/OnCall/AddMember" + params, "CallbackParams": [], "Callback": CheckAndRedrawPage });
    } else {
        OnCallDeskTop.drawErrorMsg("Please Select a Person To Give Access To");
    }


},
GlobalAllPeople:[],
DrawSecuirtyEmployee: function (id, UserName, AllGroups, AllPeople) {
    var OnCallContainer = GHVHS.DOM.create({ "Type": "div", "Class": "OnCallContainer", "Id": "OnCallContainer", "Parent": document.getElementById('MainContent') });
    var TopBar = RightContainer = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": OnCallContainer });
    OnCallDeskTop.drawSideMenu("", OnCallContainer, "", id, "", "");
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
    OnCallDeskTop.GlobalAllPeople = AllPeople;
    OnCallDeskTop.GobalGroupID = id;
    var TOnCall = GHVHS.DOM.create({ "Type": "div", "Class": "TOnCall", "Id": "TOnCall", "Content": "Manage Group Members", "Parent": TopBar });
    var getUser = UserName.replace("GHVHS", "");
    var WelUser = GHVHS.DOM.create({ "Type": "div", "Class": "WelUser", "Id": "WelUser", "Content": "Welcome: " + getUser, "Parent": TopBar });
   
    var filterContainer = GHVHS.DOM.create({ "Type": "div", "Class": "filterContainer", "Id": "filterContainer", "Parent": OnCallContainer });
    
    var filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Parent": filterContainer });
    filter.onclick = function () {
        var option = [];
        for (var i = 0; i < OnCallDeskTop.GlobalAllPeople.length; i++) {
            option.push(OnCallDeskTop.GlobalAllPeople[i]["Fields"]["FirstName"] + " " + OnCallDeskTop.GlobalAllPeople[i]["Fields"]["LastName"]);
        }
        OnCallDeskTop.drawOnCallDropDown(filter, option);
    }
    filter.value = "";
    filter.setAttribute("autocomplete", "Off");
    filter.setAttribute("placeholder", "Search People...");
    var opts = OnCallContainer.querySelectorAll(".DropOption");
    filter.onkeyup = function () {

        for (var i = 0; i < opts.length; i++) {
            if (this.value == "" || this.value == " ") {
                var CompareValue = opts[i].innerHTML.toLowerCase();
                if (OnCallDeskTop.GlobalGropFilter) {
                    if (CompareValue.indexOf(OnCallDeskTop.GlobalGropFilter) >= 0) {
                        opts[i].className = "DropOption";
                    }
                } else {
                    opts[i].className = "DropOption";
                }
            } else {
                var CompareValue = opts[i].innerHTML.toLowerCase();
                var value = this.value.toLowerCase();
                if (OnCallDeskTop.GlobalGropFilter) {
                    if (CompareValue.indexOf(OnCallDeskTop.GlobalGropFilter) >= 0) {
                        if (CompareValue.indexOf(value) >= 0) {
                            opts[i].className = "DropOption";
                        } else {
                            opts[i].className = "hide";
                        }
                    } else {
                        opts[i].className = "hide";
                    }
                } else {
                    if (CompareValue.indexOf(value) >= 0) {
                        opts[i].className = "DropOption";
                    } else {
                        opts[i].className = "hide";
                    }
                }
            }

        }
    }
    var ContentCloumn1 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn1", "Id": "ContentCloumn1", "Parent": OnCallContainer });
    OnCallDeskTop.drawColumn(ContentCloumn1, AllGroups, "Available Groups", "Y");

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
        month = month.length > 1 ? month : month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : day;

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