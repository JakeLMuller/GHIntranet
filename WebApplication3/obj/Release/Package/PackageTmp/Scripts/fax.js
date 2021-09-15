
var Fax = {
    ParseAllFax:function(json,headerTitle){
        var splitjs = json.split("||");
        var jsonData = { "data": [] };
        for (var i = 0; i < splitjs.length; i++) {
            var toAppend = splitjs[i].split(":");
            var row = [] ;
            
            jsonData.data.push({ 1: toAppend[0], 2: toAppend[1], 3: toAppend[2], 4: toAppend[3], 5: toAppend[4], 6: toAppend[5], "LogOn": toAppend[6] })
                
            
            
           
        }
        
        Fax.DrawAllFax(JSON.stringify(jsonData.data), "All Faxes:/Fax/Infusion/All", headerTitle, "All", "1",
                  "Fax Appication||New||Queued||UnScheduled||Scheduled||App", "1||2||3||4||5||LogOn", "All");
          
    },
    decodeJson:function(json,SubLevel){
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
    formateSQLDate:function(date){
        var dateTime = date.split("T");

        var date = dateTime[0];
        var splitDate = date.split("-");
        var newDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
        var time = dateTime[1];
        var splitTime = time.split(":");
        var pmAM = "";
        var HourToUse = "";
        var newTime = "";
        if (Number(splitTime[0]) > 12) {
            pmAM = "PM";
            HourToUse = (Number(splitTime[0]) - 12) + "";
        } else {
            pmAM = "AM";
            HourToUse = (Number(splitTime[0])) + "";
        }
        newTime = HourToUse + ":" + splitTime[1] + " " + pmAM;
        return  newDate + "   " + newTime;
    },
    DrawAllFax: function (Json, Tabs, T, T2, page,TableName,RowNames,path, route, ViewOnly) {
        var tabsObj = [];
        var temptab = Tabs.split("||");
        for (var i = 0; i < temptab.length; i++) {
            var anotherTemp = temptab[i].split(":");
            var TabLink = anotherTemp[1];
            if (ViewOnly == "Y") {
                TabLink= TabLink.replace(route + "/", route + "/View");
            }
            tabsObj.push({ "Label": anotherTemp[0], "Link": TabLink });
        }
        if (ViewOnly == "Y") {
           path =  path.replace("View", "");
        }
        var obj = JSON.parse(Json);
        var json = obj;
        FaxHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxHeader", "Id": "FaxHeader", "Content": T2 + " Faxes", "Parent": document.getElementById('MainContent') });
        FaxMidDrift = GHVHS.DOM.create({ "Type": "div", "Class": "FaxMidDrift", "Id": "FaxMidDrift", "Parent": document.getElementById('MainContent') });

        SearchAndPage = GHVHS.DOM.create({ "Type": "div", "Class": "SearchAndPage", "Id": "SearchAndPage", "Parent": document.getElementById('MainContent') });
        SearchAndPageLabal = GHVHS.DOM.create({ "Type": "div", "Class": "SearchAndPageLabal", "Content": "Seach For Received Date between:", "Id": "SearchAndPageLabal", "Parent": SearchAndPage });
        
        
        PagingContaier = GHVHS.DOM.create({ "Type": "div", "Class": "PagingContaier ", "Id": "PagingContaier", "Parent": SearchAndPage });
        if (path == "Queued" || path == "AllFaxes" || path == "UnScheduledFaxes" || path == "ScheduledFaxes") {
            SearchAndPageLabal.innerHTML = "Search";
            SearchAndPageLabal.style.width = "50%";
        } else if (path == "All") {
            SearchAndPageLabal.innerHTML = "";
            setTimeout(function () {
                var x = SearchAndPage.querySelectorAll("div");
                for (var i = 0; i < x.length; i++) {
                    if (x[i].className != "SearchAndPageLabal" && x[i].className != "FaxTableHeader2" && x[i].className != "status") {
                        x[i].className = "hide";
                    } else if (x[i].className == "FaxTableHeader2") {
                        x[i].style.height = "40%";
                    }
                }
            }, 100);
            SearchAndPage.style.height = "11%";
            
            SearchAndPageLabal.style.width = "50%";
            PagingContaier.className = "hide";
        }

        if (path != "All") {
            BackButton = GHVHS.DOM.create({ "Type": "div", "Class": "BackButton", "Id": "BackButton", "Parent": document.getElementById('canvas') });
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/backArrowTrans.png", "Style": "Height:20px;", "Parent": BackButton });
            BackButton.innerHTML += "Back To My Apps";
            BackButton.onclick = function () {
                window.location.href = "/Home/MyAppications"
            }
        }
        PagingLeftArrow = GHVHS.DOM.create({ "Type": "img", "Class": "PagingLeftArrow", "Id": "PagingLeftArrow", "Src": "/img/BlueArrow.png", "Parent": PagingContaier });
        PagingLeftArrow.onclick = function () {
            if (page != "1") {
                if (window.location.href.indexOf("Page=") > 0) {
                    var href = window.location.href.replace("Page=" + page, "Page=" + (Number(page) - 1));
                    window.location.href = href;
                } else {
                    window.location.href = window.location.href+"?Page=" + (Number(page) - 1);
                }

            } else {
                if (window.location.href.indexOf("Page=") > 0) {
                    var href = window.location.href.replace("Page=" + page, "Page=1");
                    window.location.href = href;
                } else {
                    window.location.href = window.location.href+"?Page=1";
                }
            }

        }

        if (page != "1" && page != "2") {
            if (json.length > 0) {
                var PageNumberEnd = Number(page) + 3;
                var startNumber = (Number(page) - 2);
            } else {
                var PageNumberEnd = Number(page) + 1;
                var startNumber = (Number(page) - 4);
            }

        } else if (page == "2") {
            var PageNumberEnd = 6;
            var startNumber = 1;
        } else {
            var PageNumberEnd = 6;
            var startNumber = 1;
        }

        for (var i = startNumber; i < PageNumberEnd; i++) {
            if (page == i) {
                SinglePageLink = GHVHS.DOM.create({ "Type": "a", "Class": "SinglePageLinkCurrentPage", "Id": "SinglePageLink", "Content": i + "", "Parent": PagingContaier });

            } else {
                SinglePageLink = GHVHS.DOM.create({ "Type": "a", "Class": "SinglePageLink", "Id": "SinglePageLink", "Content": i + "", "Parent": PagingContaier });
            }
            var href = "";
            if (window.location.href.indexOf("Page=") > 0) {
                href = window.location.href.replace("Page=" + page, "Page=" + i);

            } else {
                href = window.location.href+"?Page=" + i;
            }
            SinglePageLink.href = href;

        }
        PagingRightArrow = GHVHS.DOM.create({ "Type": "img", "Class": "PagingRightArrow", "Id": "PagingRightArrow", "Src": "/img/BlueArrow.png", "Parent": PagingContaier });
        PagingRightArrow.onclick = function () {

            if (window.location.href.indexOf("Page=") > 0) {
                var href = window.location.href.replace("Page=" + page, "Page=" + (Number(page) + 1));
                window.location.href = href;
            } else {
                window.location.href = window.location.href+"?Page=" + (Number(page) + 1);
            }



        }
        var SearchFormViewer = GHVHS.DOM.create({ "Type": "div", "Class": "SearchFormViewer ", "Id": "SearchFormViewer", "Parent": SearchAndPage });
        if (path == "Queued" || path == "AllFaxes" || path == "UnScheduledFaxes" || path == "ScheduledFaxes") {
            Fax.DrawFiltersPerFax({
                "elem": "SearchFormViewer", "Label": ["Last Name", "First Name", "DOB", "Scheduled Date between:","And Date","Service Status","Search", "Clear Search"],
                "FilterElems": ["SearchBox", "SearchBox", "cal", "cal", "cal", "DropDownAPI", "SearchButton", "SearchButton"], "height": "50%", "width": "25%", "DropDownAPI": "/api/Lookup?path=InfusionFaxStatus",
                "RowsToUse": "StatusDescription"
            });
            
        } else {
            Fax.DrawFilterForms({ "elem": SearchFormViewer });
        }
        

        FaxTableHeaderTabs = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableHeaderTabs", "Id": "FaxTableHeaderTabs", "Parent": FaxMidDrift });
        for (var i = 0; i < tabsObj.length; i++) {
            SingleTab = GHVHS.DOM.create({ "Type": "a", "Class": "SingleTab", "Href": tabsObj[i].Link, "Id": "SingleTab", "Parent": FaxTableHeaderTabs });
            var label = tabsObj[i].Label;
            SingleTab.innerHTML = label.replace("Faxes", " Faxes");
            if (tabsObj[i].Label == T) {
                SingleTab.className = "SingleTabSel";
            }
        }
        
        FaxTableHeaderBottomBar = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableHeaderBottomBar", "Id": "FaxTableHeaderBottomBar", "Parent": FaxMidDrift });
        FaxTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableHeader2", "Id": "FaxTableHeader", "Parent": SearchAndPage });
        
        var tbNamesObj = TableName.split("||");
        for (var i = 0; i < tbNamesObj.length; i++) {

            faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Style": "Color:rgb(63, 80, 104)", "Parent": FaxTableHeader });
            if (ViewOnly == "Y" && tbNamesObj[i] == "Edit") {
                faxStat.innerHTML = "View";
            } else {
                faxStat.innerHTML = tbNamesObj[i];
            }
           
            faxStat.style.width = (99/ tbNamesObj.length) + "%";
            faxStat.style.float = "left";
            faxStat.style.textAlign = "center";
        }
      

        FaxTable = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTable", "Id": "FaxTable", "Parent": document.getElementById('MainContent') });
        GHVHS.DOM.GlobalJson = json;
        var lengthJson = json.length;
        var StartLength = 0;
        if (lengthJson > 99) {
            lengthJson = 100;
        }
        var numberPage = Number(page)|0;
        if (window.location.href.indexOf("&") > 0 && numberPage > 1) {

            StartLength = (numberPage * 100) - 100;
            if (json.length > StartLength +100){
                lengthJson = (numberPage * 100);
            } else if (json.length > StartLength ) {
                StartLength = (numberPage * 100) - 100;
                lengthJson = json.length;
            } else {
                StartLength = 0;
                lengthJson = 0;
            }
        }
                
            
            
        
        for (var i = StartLength; i < lengthJson; i++) {
            SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": i + "", "Parent": FaxTable });
            if (path == "All") {
                SingleTableElem.style.height = "15%";
            }
            if (i == 0) {
                SingleTableElem.id = "0";
            }
            
           
            if (i % 2 == 0) {
                SingleTableElem.className = "SingleTableElem";
            } else {
                SingleTableElem.className = "SingleTableElemBlue";
            }
            if (path == "Queued" || path == "AllFaxes" || path == "UnScheduledFaxes" || path == "ScheduledFaxes") {
                SingleTableElem.style.background = "white";
                SingleTableElem.onclick = function () {
                    var idtoUse = GHVHS.DOM.GlobalJson[this.id]["FaxPtDetailID"];
                    if (ViewOnly == "Y") {
                        var linktoIframe = "/PTFax/View" + route + "/" + idtoUse;
                    } else {
                        var linktoIframe = "/PTFax/" + route + "/" + idtoUse;
                    }
                    
                    GHVHS.DOM.GlobalNumberFax = this.id;
                    GHVHS.DOM.drawslideUpIframe(linktoIframe, "", "Y", " /PTFax/" + route + "/" );

                }
            } else if (path == "New"){
                SingleTableElem.onclick = function () {
                    
                    var linktoIframe = "/Fax/"+route+"NewFax/" + GHVHS.DOM.GlobalJson[this.id].FaxID;
                    GHVHS.DOM.GlobalNumberFax = this.id;
                    GHVHS.DOM.drawslideUpIframe(linktoIframe, "", "Y", "/Fax/"+route+"NewFax/");
                    if (ViewOnly == "Y") {
                        setTimeout(function () {
                            var getThis = document.getElementById("ToNewLinkIMG2").parentElement;
                            getThis.parentElement.removeChild(getThis);
                        }, 10);
                    }
                }
            }
            var widthValue = 0;
            var getSplitRowNames = RowNames.split("||");
            for (var j = 0; j < getSplitRowNames.length; j++) {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.style.fontSize = "17px";
                faxStat.style.color = "rgb(63, 80, 104)";
                faxStat.style.width = (99 / tbNamesObj.length) + "%";
                widthValue = (99 / tbNamesObj.length);
                var NameOfRow = getSplitRowNames[j].toLowerCase() +"";
                if (getSplitRowNames[j] == "edit") {
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/edit.png", "Style": "Height:30px;", "Parent": faxStat });
                    if (ViewOnly == "Y") {
                        lodingImg.src = "/img/ViewOnly.png"; "/img/ViewOnly.png";
                    }
                } else if (NameOfRow.indexOf("date") > 0 && NameOfRow.indexOf("|") < 0) {
                    if (json[i][getSplitRowNames[j]].indexOf("nbsp;") <= 0 && json[i][getSplitRowNames[j]].indexOf("T") > 0) {
                        faxStat.innerHTML = Fax.formateSQLDate(json[i][getSplitRowNames[j]]);
                        faxStat.style.fontSize = "15px";
                        faxStat.style.color = "rgb(63, 80, 104)";
                        faxStat.style.fontWeight = "bold";
                    } else {
                        if (json[i][getSplitRowNames[j]].indexOf("nbsp;") > 0) {
                            faxStat.innerHTML = " ";
                        } else {
                            faxStat.innerHTML = json[i][getSplitRowNames[j]];
                        }
                        
                    }
                    
            }   else if (NameOfRow == "ptdob") {
                faxStat.innerHTML = json[i][getSplitRowNames[j]];
                faxStat.style.fontSize = "15px";
                faxStat.style.fontWeight = "bold";
            } else if (NameOfRow == "logon") {
                SearchButton = GHVHS.DOM.create({ "Type": "a", "Class": "SearchButton", "Content": "Go To App", "Id": "SearchButton", "Parent": faxStat });
                SearchButton.innerHTML = "Go To " + json[i][getSplitRowNames[0]];
                SearchButton.style.height = "80%";
                SearchButton.style.textDecoration= "none";
                SearchButton.style.marginLeft = "10%";
                SearchButton.style.width = "80%";
                SearchButton.href = json[i][getSplitRowNames[j]];
            }else if (NameOfRow.indexOf(":") > 0 && NameOfRow.indexOf("|") < 0) {
                    var toSplit = getSplitRowNames[j].split(":");
                    for (var k = 0; k < toSplit.length; k++) {
                        faxStat.innerHTML += json[i][toSplit[k]] + " ";
                        
                    }
                } else if (NameOfRow == "infusion") {
                    faxStat.innerHTML = "Infusion";
                }else if (NameOfRow.indexOf("|") > 0) {
                    var toSplit = getSplitRowNames[j].split("|");
                    var idtoLookUp = "";
                    if ( toSplit[0] == "ToServiceType") {
                        idtoLookUp = "FaxPTDetailID";
                    } else {
                        idtoLookUp = "FaxID";
                    }
                    var valuesSplit = toSplit[1].split(":");
                    var elemsToUpdate = [faxStat];
                    for (var l =0; l < valuesSplit.length-1; l++) {
                        var faxStat2 = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status" + l, "Parent": SingleTableElem });
                        faxStat2.style.fontSize = "17px";
                        faxStat2.style.width = widthValue + "%";
                        elemsToUpdate.push(faxStat2);
                    }
                    function UpdateSub(json, parm) {
                        var values = parm.Elm[0];
                        var Elements = parm.Elm[1];
                        var jsonData = Fax.decodeJson(json);
                        for (var m = 0; m < jsonData.length; m++) {
                            for (var n = 0; n < values.length; n++) {
                                if (values[n].indexOf("Date") > 0) {
                                    if (jsonData[m][values[n]]) {
                                        Elements[n].innerHTML = Fax.formateSQLDate(jsonData[m][values[n]]);
                                        Elements[n].style.fontSize = "15px";
                                    } else {
                                        Elements[n].innerHTML = "";
                                    }
                                    
                                } else {
                                    Elements[n].innerHTML = jsonData[m][values[n]];

                                }
                                
                            }
                        }
                    }
                    parm = [valuesSplit, elemsToUpdate]
                    GHVHS.DOM.send({ "URL": "/Api/Lookup?FN=" + json[i][idtoLookUp] + "&path=" + toSplit[0], "Callback": UpdateSub, "CallbackParams": { Elm: parm } });
                } else {
                    if (json[i][getSplitRowNames[j]] == "null") {
                        faxStat.innerHTML += " ";
                    } else {
                        faxStat.innerHTML += json[i][getSplitRowNames[j]];
                    }
                    
                }
                
            }
            
                
                function getFaxesR2(json, parm) {

                    var jsonData = Fax.decodeJson(json);
                    var elem = parm.Elm[1];
                    var headersToRequest = ["View", "FaxTypeDescription", "UpdateDate"];
                    if (jsonData[0]){
                        for (var i = 0; i < jsonData.length; i++) {
                            elem.style.height = "auto";
                            
                            SingleTableElem3 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElemBlue", "Id": i + "", "Parent": elem });
                            if (i == jsonData.length-1) {
                                SingleTableElem3.style.borderBottom = "none";
                            }
                            
                            SingleTableElem3.id = "/Fax/" + parm.Elm[2] +"NewFax/:" + jsonData[i]["FaxID"];
                           
                            
                            SingleTableElem3.onclick = function () {
                                var linksplit = this.id.split(":");
                                var linktoIframe = linksplit[0]+linksplit[1];
                                

                                GHVHS.DOM.drawslideUpIframe(linktoIframe, "", "Y", linksplit[0]);
                                setTimeout(function () {
                                    document.getElementById("RightArrow").className = "hide";
                                    document.getElementById("LeftArrow").className = "hide";
                                }, 100);
                                if (ViewOnly == "Y") {
                                    setTimeout(function () {
                                        var getThis = document.getElementById("ToNewLinkIMG2").parentElement;
                                        getThis.parentElement.removeChild(getThis);
                                    }, 10);
                                }
                            }
                            for (var j = 0; j < headersToRequest.length; j++) {
                                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem3 });
                                
                                faxStat.style.fontSize = "14px";
                                if (j == 0) {
                                    faxStat.innerHTML = "View";
                                    faxStat.style.color = "rgb(63, 80, 104)";
                                    faxStat.style.marginLeft = "15%";
                                } else {
                                    faxStat.innerHTML = jsonData[i][headersToRequest[j]];
                                    faxStat.style.width = "25%";
                                    faxStat.style.color = "rgb(63, 80, 104)";
                                    faxStat.style.fontWeight = "bold";
                                    
                                }
                            }
                        }
                    } else {
                        elem.parentElement.removeChild(elem);
                    }
                    

                }
             
                    if (path == "AllFaxes" || path == "UnScheduledFaxes" || path == "ScheduledFaxes" || path == "Queued") {
                        SingleTableElem2 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem2", "Id": i + "", "Parent": FaxTable });
                        var parm2 = ["ArchiveDate",SingleTableElem2,route];
                        var id = json[i]["FaxID"];

                        GHVHS.DOM.send({ "URL": "/api/Lookup?path=" + route + "QueueBrowse&FN=" + id, "Callback": getFaxesR2, "CallbackParams": { Elm: parm2 } });
                    }
                     
                
                
                
            
            
            
        }
    },
    GlobalNumberFax: 0,

    DrawNewFax: function (Json, T, t2, edit, ptJson, route,FaxTypes) {
        var obj = JSON.parse(Json);
        if (edit) {
            var objPT = JSON.parse(ptJson);
            var getCorrect = T.replace("Orange Regional Medical Center", "");
            var backLabel = getCorrect.replace("Management", "");
            BackButton = GHVHS.DOM.create({ "Type": "div", "Class": "BackButton", "Id": "BackButton", "Parent": document.getElementById('canvas') });
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/backArrowTrans.png", "Style": "Height:20px;", "Parent": BackButton });
            BackButton.innerHTML += "Back To" + backLabel;
            BackButton.onclick = function () {
                window.location.href = "/Fax/"+route+"/New?Page=1"
            }
        } else {
            var hideFooter = setTimeout(function () {
                document.getElementById("Footer").className = "hide";
            }, 100);
        }

        if (!edit) {
            var deleteAll = document.getElementById("canvas");

            document.getElementById("header").className = "hide";

        }


        FaxNewHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Id": "FaxNewHeader", "Content": T, "Parent": document.getElementById('MainContent') });

        var dateTime = obj[0].ArchiveDate.split("T");
        var date = dateTime[0];
        var splitDate = date.split("-");
        var newDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
        var time = dateTime[1];
        var splitTime = time.split(":");
        var pmAM = "";
        var HourToUse = "";
        var newTime = "";
        if (Number(splitTime[0]) > 12) {
            pmAM = "PM";
            HourToUse = (Number(splitTime[0]) - 12) + "";
        } else {
            pmAM = "AM";
            HourToUse = (Number(splitTime[0])) + "";
        }
        newTime = HourToUse + ":" + splitTime[1] + " " + pmAM;
        var dataT = newDate + "   " + newTime;

        FaxNewHeader2 = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Id": "FaxNewHeader", "Style": "Font-Size: 22px; Color: grey;", "Content": obj[0].CurrentFaxStatus + " " + dataT, "Parent": document.getElementById('MainContent') });
        framedTif = GHVHS.DOM.create({ "Type": "iframe", "Class": "framedTif", "Id": "framedTif", "Parent": document.getElementById('MainContent') });
        var fName = obj[0].FileName;
        var splited = fName.split(".");
        if (!edit) {
            framedTif.style.height = ((document.getElementById("canvas").offsetHeight - (FaxNewHeader2.offsetHeight + FaxNewHeader.offsetHeight)) - 5) + "px";

        } else {
            FaxNewHeader.style.marginTop = "-1%";
            FaxNewHeader2.style.marginBottom = "0.3%";
            framedTif.style.height = "90%";
            framedTif.style.width = "35%";
            framedTif.style.border = "none";
            framedTif.style.boxShadow = "2px 2px 3px #444";
        }

        framedTif.src = "/HelloWorld/Tiff?id=" + splited[0] + "&FaxDepo=" + route;
        if (edit) {
            var masterContainer = document.getElementById('MainContent');
            ServiceAndAtt = GHVHS.DOM.create({ "Type": "div", "Class": "ServiceAndAtt", "Id": "ServiceAndAtt", "Parent": masterContainer });
            SAHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SAHeader", "Id": "SAHeader", "Parent": ServiceAndAtt });
            In = GHVHS.DOM.create({ "Type": "div", "Class": "In", "Id": "In", "Content": "Service", "Parent": SAHeader });
            Services = GHVHS.DOM.create({ "Type": "div", "Class": "Services", "Id": "Services", "Content": "Attachments", "Parent": SAHeader });
            SAbody = GHVHS.DOM.create({ "Type": "div", "Class": "SAbody", "Id": "SAbody", "Parent": ServiceAndAtt });
            var FaxTypelist = JSON.parse(FaxTypes);
            var list = ["Infusion", "H&ampP", "LAB", "Ins. Auth", "Results/Notes"];
            for (var i = 0; i < FaxTypelist.length; i++) {
                SingleCheck = GHVHS.DOM.create({ "Type": "div", "Class": "SingleCheck", "Id": "SingleCheck", "Parent": SAbody });
                
                var CheckBox = GHVHS.DOM.create({ "Type": "div", "Class": "CheckBox", "Id": "CheckBox", "Parent": SingleCheck });
                CheckBox.onclick = function () {
                    if (this.style.backgroundImage.indexOf("/img/checkmark.png") < 0) {
                        this.style.backgroundImage = "url(/img/checkmark.png)";
                        this.style.backgroundRepeat = "no-repeat";
                        this.style.backgroundSize = "cover";
                        this.style.transform = "scale(1.1)";
                        var that = this;
                        var reset = setTimeout(function () {
                            that.style.transform = "scale(1.0)";
                        }, 50);
                    } else {
                        this.style.backgroundImage = null;
                        this.style.backgroundRepeat = "no-repeat";
                        this.style.backgroundSize = "cover";
                        this.style.transform = "scale(1.1)";
                        var that = this;
                        var reset = setTimeout(function () {
                            that.style.transform = "scale(1.0)";
                        }, 50);
                    }

                }
                Label = GHVHS.DOM.create({ "Type": "div", "Class": "Label", "Id": "Label", "Parent": SingleCheck });
                Label.innerHTML = FaxTypelist[i]["FaxTypeDescription"];
            }
            var FieldsName = [];
            var DBNames = []; 
            if (route == "Infusion" || route == "Concierge") {
                FieldsName = ["Selected", "First Name", "Last Name", "DOB", "Serivce", "Dr.", "Status"];
                DBNames = ["img", "PtFirstName", "PtLastName", "PtDOB", "Infusion", "DrID", "CurrentQueueStatus"];
            } if (route == "Cardiac" || route == "Ent") {
                FieldsName = ["Selected", "First Name", "Last Name", "DOB", "Service", "Dr.", "Status"];
                DBNames = ["img", "PtFirstName", "PtLastName", "PtDOB", "Services", "DrID", "CurrentQueueStatus"];
            } else if (route == "OR") {
                FieldsName = ["Selected", "First Name", "Last Name", "DOB", "Services", "Surgery Date","Dr.", "Status"];
                DBNames = ["img", "PtFirstName", "PtLastName", "PtDOB", "Services", "SurgeryDate", "DrID", "CurrentQueueStatus"];
            }
            Fax.DrawFaxTable({
                "json": objPT, "FieldNames": FieldsName,
                "DBNames": DBNames, "img": "/img/select.png", "FilterLabels": ["Last Name", "First Name", "DOB"], "route":route
            });

        }

    },
DrawFilterForms: function (p) {
    var SearchBoxView2 = GHVHS.DOM.create({ "Type": "div", "Class": "text ", "Content": "Choose Date", "Id": "hi", "Parent": p.elem });
    SearchBoxView2.style.backgroundImage = "url(/img/cal.jpg)";
    SearchBoxView2.style.backgroundSize = "28px";
    SearchBoxView2.style.width = "30%";
    SearchBoxView2.style.textAlign = "center";
    SearchBoxView2.style.marginLeft = "13.8%";
    SearchBoxView2.style.height = "28%";
    SearchBoxView2.onclick = function () {
        SearchBoxView2.id = "SelectedCal";
        GHVHS.DOM.drawCalander("", 2019, this);
    };
    SearchBoxView2.setAttribute("placeholder", "Choose Date");

    SubSearchLabel = GHVHS.DOM.create({ "Type": "div", "Class": "SubSearchLabel", "Content": " And ", "Id": "SubSearchLabel", "Parent": p.elem });

    var SearchBoxView3 = GHVHS.DOM.create({ "Type": "div", "Class": "text ","Id":"hi" ,"Content": "Choose Date", "Parent": p.elem });
    SearchBoxView3.style.backgroundImage = "url(/img/cal.jpg)";
    SearchBoxView3.style.backgroundSize = "28px";
    SearchBoxView3.style.width = "30%";
    SearchBoxView3.style.textAlign = "center";
    SearchBoxView3.style.height = "28%";
    SearchBoxView3.onclick = function () {
        SearchBoxView3.id = "SelectedCal";
        GHVHS.DOM.drawCalander("", 2019, this);
    };
    var wHref = window.location.href;
    if (wHref.indexOf("&secondDate") > 0) {
        var Value = wHref.split("&secondDate=");
        var temp = Value[1].replace("secondDate=", "");
        var NewSplit = temp.split("-");
        SearchBoxView3.innerHTML = NewSplit[1] + "/" + NewSplit[2] + "/" + NewSplit[0];
    } 
    if (wHref.indexOf("&FirstDate") > 0) {
        var Value = wHref.split("&");
        var NewSplit = Value[1].replace("FirstDate=", "").split("-");
        SearchBoxView2.innerHTML = NewSplit[1] + "/" + NewSplit[2] + "/" + NewSplit[0];


    }
    


    SearchButton = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Content": "Search", "Id": "SearchButton", "Parent": p.elem });
    SearchButton.style.marginLeft = "27.5%";
    SearchButton.onclick = function () {
        var inputs = this.parentElement.querySelectorAll(".text");
        var OkayOrBad = "";
        var Dates = [];
        for (var k = 0; k < inputs.length; k++) {
            if (inputs[k].id == "NotSelectedCal" || inputs[k].id == "hi") {
                if (inputs[k].innerHTML == "Choose Date" || inputs[k].innerHTML == "Please Enter a Value") {
                    inputs[k].style.border = "1px solid red";
                    inputs[k].style.color = "red";
                    inputs[k].innerHTML = "Please Enter a Value";
                } else {
                    inputs[k].style.border = "1px solid silver";
                    inputs[k].style.color = "grey";
                    var theDate = inputs[k].innerHTML;
                    var SplitDate = theDate.split("/");
                    Dates.push(SplitDate[2] + "-" + SplitDate[0] + "-" + SplitDate[1]);

                }
            }
            if (Dates.length == 2) {
                var locationHref = window.location.href;
                if (locationHref.indexOf("?") > 0) {
                    if (locationHref.indexOf("&") > 0) {
                        var nowWeSplit = locationHref.split("&");
                        window.location.href = nowWeSplit[0] + "&FirstDate=" + Dates[0] + "&secondDate=" + Dates[1];
                    } else {
                        window.location.href = window.location.href + "&FirstDate=" + Dates[0] + "&secondDate=" + Dates[1];
                    }
                     
                } else {
                    window.location.href = window.location.href + "?FirstDate=" + Dates[0] + "&secondDate=" + Dates[1];
                }
            }
             
        }
    }
    SearchClearButton = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Content": "Clear Search", "Id": "SearchClearButton", "Parent": p.elem });
    SearchClearButton.style.marginLeft = "5%";
    SearchClearButton.onclick = function () {
        var getHref = window.location.href;
        if (getHref.indexOf("&")> 0 ) {
            var NewHref = getHref.split("&");
            window.location.href = NewHref[0];
        } else {
            window.location.href = getHref;
        }
    }
},
dropData: [],
DrawFiltersPerFax:function(p){
    var masterElem = document.getElementById(p.elem);
    var toDraw = p.FilterElems;
    var labels = p.Label;
    var getURL = window.location.href;
    var splitURL = getURL.split("?");
    var getParams = ["None", "None"];
    if (splitURL[1].indexOf("&") >= 0) {
        getParams =  splitURL[1].split("&");
    }
    
    for (var i = 0; i < toDraw.length; i++) {
        FilterContainer = GHVHS.DOM.create({ "Type": "div", "Class": "FilterContainer ", "Id": "FilterContainer ", "Parent": masterElem });
        if (p.height) {
            FilterContainer.style.height = "auto";
        }
        if (p.width) {
            FilterContainer.style.width = p.width;
        }
        if (toDraw[i] == "cal"){
            var SearchBoxView2 = GHVHS.DOM.create({ "Type": "div", "Class": "Filter ", "Content": labels[i], "Id": "hi", "Parent": FilterContainer });
            if (labels[i] == "DOB") {
                FilterContainer.id = "DOB";
            } else if (labels[i] == "Scheduled Date between:") {
                FilterContainer.id = "date1";
            } else if (labels[i] == "And Date") {
                FilterContainer.id = "date2";
            }
            SearchBoxView2.style.backgroundImage = "url(/img/cal.jpg)";
            SearchBoxView2.style.backgroundSize = "28px";
            for (var j = 0; j < getParams.length; j++){
                if (getParams[j].indexOf("FirstDate") >= 0 && labels[i] == "Scheduled Date between:") {
                    var rawValue = getParams[j].replace("FirstDate=", "");
                    var splitValue = rawValue.split("-");
                    SearchBoxView2.innerHTML = splitValue[1] + "/" + splitValue[2] + "/" + splitValue[0];
                } else if (getParams[j].indexOf("secondDate") >= 0 && labels[i] == "And Date") {
                    var rawValue = getParams[j].replace("FirstDate=", "");
                    var splitValue = rawValue.split("-");
                    SearchBoxView2.innerHTML = splitValue[1] + "/" + splitValue[2] + "/" + splitValue[0];
                } else if (getParams[j].indexOf("DOB") >= 0 && labels[i] == "DOB") {
                    var rawValue = getParams[j].replace("DOB=", "");
                    var splitValue = rawValue.split("-");
                    SearchBoxView2.innerHTML = splitValue[1] + "/" + splitValue[2] + "/" + splitValue[0];
                }
            }
            SearchBoxView2.style.width = "90%";
            SearchBoxView2.style.textAlign = "left";
            SearchBoxView2.style.paddingTop = "1%";
            SearchBoxView2.style.paddingBottom = "1%";
            SearchBoxView2.style.backgroundColor = "white";
            if (p.height) {
                SearchBoxView2.style.height = p.height;
            } else {
                SearchBoxView2.style.height = "80%";
            }
            
            SearchBoxView2.style.color = "grey";
            SearchBoxView2.onclick = function () {
                this.id = "SelectedCal";
                GHVHS.DOM.drawCalander("", 2019, this);
            };
             

        } else if (toDraw[i] == "SearchBox") {
            var SearchBoxView2 = GHVHS.DOM.create({ "Type": "Input", "Class": "Filter", "Content": "Choose Date", "Id": labels[i], "Parent": FilterContainer });
            if (p.height) {
                SearchBoxView2.style.height = p.height;
            }
            if (p.width) {
                SearchBoxView2.style.paddingTop = "1%";
                SearchBoxView2.style.paddingBottom = "1%";
            }
            SearchBoxView2.setAttribute("placeholder", labels[i]);
            for (var j = 0; j < getParams.length; j++) {
                var str = getParams[j].toString();
                if (str.indexOf("FN") >= 0 && labels[i] == "First Name") {
                    SearchBoxView2.value = str.replace("FN=", "");
                } else if (str.indexOf("LN") >= 0 && labels[i] == "Last Name") {
                    SearchBoxView2.value = str.replace("LN=", "");
                }
            }
        } else if (toDraw[i] == "DropDownAPI") {
            var opt = [];
            var SearchBoxView2 = GHVHS.DOM.create({ "Type": "Input", "Class": "Filter", "Content": "Choose Date", "Id": "this.Drop", "Parent": FilterContainer });
            SearchBoxView2.style.backgroundImage = "url(/img/index.png)";
            if (p.height) {
                SearchBoxView2.style.height = p.height;
            }
            if (p.width) {
                SearchBoxView2.style.paddingTop = "1%";
                SearchBoxView2.style.paddingBottom = "1%";
            }
            var tempStr = labels[i];
            function getd(json, d) {
                var jsonData = Fax.decodeJson(json);
                var opt2 = [];
                for (var j = 0; j < jsonData.length; j++) {
                    
                    opt2.push(jsonData[j][p.RowsToUse]);
                    if (p.RowsToUse == "StatusDescription"){
                        
                        Fax.dropData.push({ "StatusDescription": jsonData[j][p.RowsToUse], "StatusID": jsonData[j]["StatusID"] });
                    }
                   
                }
                GHVHS.DOM.CreateDropDown({ "Element": "this.Drop", "dropDownId": "", "Options": opt2, "todraw": "input" });
                
                d.Elm[0].setAttribute("Placeholder", d.Elm[1]);
                for (var j = 0; j < getParams.length; j++) {
                    if (getParams[j].indexOf("ServiceStatus") >= 0 && d.Elm[1] == "Service Status") {
                       
                        for (var z = 0; z < Fax.dropData.length; z++) {
                            if (Fax.dropData[z]["StatusID"] ==  getParams[j].replace("ServiceStatus=", "")) {
                                SearchBoxView2.value = Fax.dropData[z]["StatusDescription"];
                            }
                        }
                    }
                }
            }

            GHVHS.DOM.send({ "URL": p.DropDownAPI, "Callback": getd, "CallbackParams": { Elm: [SearchBoxView2,tempStr ] } });
           
          
        } else if (toDraw[i] == "SearchButton") {
            Search = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": labels[i], "Style": "padding-bottom: 0px;", "Id": "SearchClearButtonSearch", "Parent": FilterContainer });
            
            Search.style.width = "100%";
            Search.style.marginLeftTop = "1.5%";
            FilterContainer.style.height = "60%";
            FilterContainer.style.width = "20%";
            FilterContainer.style.marginLeft = "2%";
             if (p.height) {
                 Search.style.height = p.height;
             }
             if (labels[i] == "Search") {
                 Search.onclick = function () {
                     var addToURL = "";
                     var getDates = [];
                     var getFilters = this.parentElement.parentElement.querySelectorAll(".Filter");
                     for (var i = 0; i < getFilters.length; i++) {
                         if (getFilters[i].id == "SelectedCal" || getFilters[i].id == "NotSelectedCal" || getFilters[i].id == "hi") {
                             if (getFilters[i].innerHTML != "Scheduled Date between:" && getFilters[i].innerHTML != "And Date") {
                                 getDates.push(getFilters[i].innerHTML);

                             }
                         } else {
                             if (getFilters[i].id == "input||8") {
                                 if (getFilters[i].value) {
                                     var statID = "";
                                     for (var j = 0; j < Fax.dropData.length; j++) {
                                         if (Fax.dropData[j]["StatusDescription"] == getFilters[i].value) {
                                             statID = Fax.dropData[j]["StatusID"];
                                         }
                                     }
                                     if (statID != "") {
                                         addToURL += "&ServiceStatus=" + statID;
                                     }

                                 }

                             } else {
                                 if (getFilters[i].value) {
                                     var valueLabel = "";
                                     if (getFilters[i].id == "First Name") {
                                         valueLabel = "FN";
                                     } else if (getFilters[i].id == "Last Name") {
                                         valueLabel = "LN";
                                     } else {
                                         valueLabel = getFilters[i].id;
                                     }
                                     addToURL += "&" + valueLabel + "=" + getFilters[i].value;
                                 }
                             }
                         }

                     }
                     if (document.getElementById("date1").firstChild.innerHTML != "Scheduled Date between:" && document.getElementById("date2").firstChild.innerHTML != "And Date"){
                         getDates = [document.getElementById("date1").firstChild.innerHTML, document.getElementById("date2").firstChild.innerHTML];
                     }
                     
                     if (getDates.length == 2) {
                         var currentDate1 = getDates[0].split("/");
                         var currentDate2 = getDates[1].split("/");
                         var getMonth = (Number(currentDate1[0]) - 1);
                         var getMonth2 = (Number(currentDate2[0]) - 1);
                         if (getMonth2 < 0) {
                             getMonth2 = 0;
                         }
                         if (getMonth < 0) {
                             getMonth = 0;
                         }
                         var d1 = new Date(Number(currentDate1[2]), getMonth, Number(currentDate1[1]));
                         var d2 = new Date(Number(currentDate2[2]), getMonth2, Number(currentDate2[1]));
                         if (d1 < d2) {
                             addToURL += "&FirstDate=" + currentDate1[2] + "-" + currentDate1[0] + "-" + currentDate1[1];
                             addToURL += "&secondDate=" + currentDate2[2] + "-" + currentDate2[0] + "-" + currentDate2[1];
                         } else {
                             addToURL += "&secondDate=" + currentDate1[2] + "-" + currentDate1[0] + "-" + currentDate1[1];
                             addToURL += "&FirstDate=" + currentDate2[2] + "-" + currentDate2[0] + "-" + currentDate2[1];
                         }
                     }
                     if (document.getElementById("DOB").firstChild.innerHTML != "DOB") {
                         var currentDate1 = document.getElementById("DOB").firstChild.innerHTML.split("/");
                         addToURL += "&DOB=" + currentDate1[2] + "-" + currentDate1[0] + "-" + currentDate1[1];
                     }
                     if (addToURL != "") {
                         var urltoUse = window.location.href.split("&");
                         GHVHS.DOM.DrawSmallLoader2();
                         window.location.href = urltoUse[0] + addToURL;
                     }
                 }
                 
             } else {
                 Search.onclick = function () {
                     var getSplitURL = window.location.href.split("&");
                     GHVHS.DOM.DrawSmallLoader2();
                     window.location.href = getSplitURL[0];
                 }
             }
             
             
        }
    }
   

},

DrawSmallLoader:function(){
    if (!document.getElementById("FaxTableLoader")) {
        FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": "Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);", "Parent": document.getElementById('MainContent') });
        FaxTableLoader.style.left = document.getElementById("FaxTable").offsetLeft + "px";
        FaxTableLoader.style.top = document.getElementById("TableFaxFilterContainer").offsetTop + "px";
        FaxTableLoader.style.width = document.getElementById("FaxTable").offsetWidth + "px";
        FaxTableLoader.style.height = (document.getElementById("FaxTable").offsetHeight + document.getElementById("TableFaxFilterContainer").offsetHeight) + "px";
        var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
       
    }
},
RemoveSmallLoader:function(){
     
    var loaderElem = document.getElementById("FaxTableLoader");
    document.getElementById('MainContent').removeChild(loaderElem);
     
},   
DrawFaxTable: function (p) {
    FaxTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SmallFaxHeader", "Id": "FaxTableHeader", "Parent": document.getElementById('MainContent') });
    SearchAndPage = GHVHS.DOM.create({ "Type": "div", "Class": "SearchAndPage", "Id": "TableFaxFilterContainer", "Style":"background-color:white;","Parent": document.getElementById('MainContent') });
    SearchAndPage.style.marginLeft = "0.5%";
    SearchAndPage.style.width = "64%";
    SearchAndPage.style.borderLeft = "1px solid silver";
    SearchAndPage.style.borderRight = "1px solid silver";
    SearchAndPage.style.height = "5%";
    SearchAndPage.style.paddingBottom = "3%";
    Fax.DrawFiltersPerFax({ "elem": "TableFaxFilterContainer", "Label": p.FilterLabels, "FilterElems": ["SearchBox", "SearchBox", "cal"] });
    TempHolder3 = GHVHS.DOM.create({ "Type": "div", "Class": "TempHolder", "Style": "height:100%; Float: Left; Width: 30%;", "Parent": SearchAndPage });
    Fax.drawPagingContainer({ "APIPath": "/Api/GetPT?route=" + p.route, "page": "1", "json": p.json, "DBNames": p.DBNames, "FieldNames": p.FieldNames, "route": p.route, "Elem": TempHolder3 })
    Search = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": "Search", "Id": "SearchClearButtonSearch", "Parent": SearchAndPage });
    Search.style.width = "30%";
    Search.style.height = "40%";
    Search.style.marginTop = "1%";
    Search.onclick = function () {
        var searchValues = [];
        var getValues = this.parentElement.querySelectorAll("input, div");
        for (var i = 0; i < getValues.length; i++) {
            if (getValues[i].className != "SearchButtonSmall") {
                if (getValues[i].className == "Filter") {
                    if (getValues[i].value) {
                        searchValues.push(getValues[i].value);
                    } else {
                        searchValues.push(getValues[i].innerHTML);
                    }
                     
                }
            }
        } 
        Fax.DrawSmallLoader();
         
        if (searchValues.length == 0) {
            GHVHS.DOM.send({ "URL": "/Api/GetPT?route=" + p.route, "Callback": Fax.redrawTableRows, "CallbackParams": { DbNames: p.DBNames, route: p.route, FieldNames: p.FieldNames } });
        }else {
            GHVHS.DOM.send({ "URL": "/Api/GetPT?LN=" + searchValues[0] + "&route=" + p.route + "&FN=" + searchValues[1], "Callback": Fax.redrawTableRows, "CallbackParams": { DbNames: p.DBNames, route: p.route, FieldNames: p.FieldNames } });
        }
         

    }
    SearchClearButton = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": "Clear Search", "Id": "SearchClearButton", "Parent": SearchAndPage });
    SearchClearButton.style.width = "30%";
    SearchClearButton.style.height = "40%";
    SearchClearButton.style.marginTop = "1%";
    SearchClearButton.onclick = function () {
        var getValues = this.parentElement.querySelectorAll("input, div");
        for (var i = 0; i < getValues.length; i++) {
            if (getValues[i].className != "SearchButtonSmall") {
                if (getValues[i].className == "Filter") {
                    getValues[i].value = "";
                    getValues[i].innerHTML = "";

                }
            }
        }
        document.getElementById("SearchClearButtonSearch").click();
    }
    AddNew = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": "Add New", "Id": "SearchClearButton", "Parent": SearchAndPage });
    AddNew.style.width = "30%";
    AddNew.style.height = "40%";
    AddNew.style.marginTop = "1%";
    AddNew.onclick = function () {
        Fax.AddNewPatient({ "Fax": p.route });
    }
    
   
    FaxTable = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTable", "Id": "FaxTable", "Parent": document.getElementById('MainContent') });
    FaxTable.style.marginLeft = "0.5%";
    FaxTable.style.width = "63.9%";
    FaxTable.style.height = "50%";
    var getsa = document.getElementById("ServiceAndAtt");
    var getMain = document.getElementById("MainContent");
    var getFA = document.getElementById("FaxNewHeader");
    FaxTable.style.height = (((getMain.offsetHeight - getsa.offsetHeight) - (getFA.offsetHeight * 2))-185) + "px";
    FaxTable.style.border = "1px solid slategrey";
    FaxTable.style.borderTop = "none";
    var fieldNames = p.FieldNames;
    var localJson = p.json;
    for (var i = 0; i < fieldNames.length; i++) {
        var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status","Style":"Color:white;", "Parent": FaxTableHeader });
       
        faxStat.style.width = (98 / fieldNames.length) + "%";
        faxStat.innerHTML = fieldNames[i];
        faxStat.style.borderRight = "none";
    }
    var DoctorCount = 0;
    for (var i = 0; i < localJson.length; i++) {
        SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": i + "", "Parent": FaxTable });
        SingleTableElem.style.height = "10%";
        if (i == 0) {
            SingleTableElem.id = "0";
        }
        SingleTableElem.onclick = function () {
            if (this.id != "selectedPatient") {
                this.id = "selectedPatient";
                this.parentElement.style.overflowY = "hidden";
                tempOldBackground = GHVHS.DOM.create({ "Type": "div", "Class": "tempOldBackground","Style":"display:none;", "Id": "tempOldBackground", "Parent": this });
                tempOldBackground.innerHTML = this.style.backgroundColor;
                this.style.backgroundColor = "rgba(0, 102, 153, 0.8)";
                
                var getimg = this.querySelectorAll("img");
                for (var i = 0; i < getimg.length; i++) {
                    getimg[i].src = "/img/greenCheck.png";
                }
                var getAllText = this.querySelectorAll(".status");
                for (var i = 0; i < getAllText.length; i++) {
                    getAllText[i].style.color = "white";
                }
            } else {
                this.id = "notselected";
                this.parentElement.style.overflowY = "scroll";
                var getOldBackGround  = this.querySelectorAll(".tempOldBackground");
                if (getOldBackGround.length > 0) {
                    this.style.backgroundColor = getOldBackGround[0].innerHTML;
                    this.removeChild(getOldBackGround[0]); 
                } else {
                    this.style.backgroundColor = "white";
                }
                this.style.transform = "scale(1)";
                 
                var getimg = this.querySelectorAll("img");
                for (var i = 0; i < getimg.length; i++) {
                    getimg[i].src = "/img/select.png";
                }
                var getAllText = this.querySelectorAll(".status");
                for (var i = 0; i < getAllText.length; i++) {
                    getAllText[i].style.color = "rgb(63, 80, 104)";
                }
            }
             

        }
        if (i % 2 == 0) {
            SingleTableElem.style.background = "white";
        } else {
            SingleTableElem.style.background = "#f5fcff";
        }
        for (var j = 0; j < p.DBNames.length ; j++) {
            var singleName = p.DBNames[j];
            if (singleName == "img") {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.style.width = (98 / fieldNames.length) + "%";
                faxStat.onclick = function () {
                    this.parentElement.click(); 
                }; 
                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": p.img, "Style": "Height:30px;", "Parent": faxStat });
                lodingImg.onclick = function () {
                    this.parentElement.click();
                };
            } else if (singleName.indexOf("Date")>0) {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.style.width = (98 / fieldNames.length) + "%";
                faxStat.innerHTML = Fax.formateSQLDate(localJson[i][singleName]);
                faxStat.style.color = "rgb(63, 80, 104)";
                faxStat.style.fontSize = "14px";
                faxStat.style.fontWeight = "bold";
            } else if (singleName == "Infusion") {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.style.width = (98 / fieldNames.length) + "%";
                faxStat.innerHTML = "Infusion";
                faxStat.style.color = "rgb(63, 80, 104)";
                faxStat.style.fontSize = "14px";
                faxStat.style.fontWeight = "bold";
            } else if (singleName == "DrID") {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.id = "updateDr" + DoctorCount;
                faxStat.style.color = "rgb(63, 80, 104)";
                faxStat.style.fontSize = "14px";
                faxStat.style.width = (98 / fieldNames.length) + "%";
                faxStat.style.fontWeight = "bold";
                empty = faxStat;
                function getDoctor(DRjson, e) {
                    var jsonHolder = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "jsonHolder", "Parent": document.getElementById('MainContent') });
                    jsonHolder.innerHTML = DRjson.data;
                    var jsonDrop = JSON.parse(jsonHolder.innerHTML);
                    document.getElementById('MainContent').removeChild(jsonHolder);
                    if (jsonDrop.length >= 1) {
                        e.Elm.innerHTML = jsonDrop[0]["NAME_FULL_FORMATTED"];
                    } else {
                        e.Elm.innerHTML = "Doctor Not On File";
                    }

                }
                var getPath = "";
                if (p.route == "Infusion") {
                    getPath = "Doctor"

                } else if (p.route == "OR") {
                    getPath = "Doctor"
                } else if (p.route == "Cardiac" || p.route == "Ent" ||p.route == "Concierge") {
                    getPath = "Doctor"
                }
                GHVHS.DOM.send({ "URL": "/Api/Lookup?ID=" + localJson[i][singleName] + "&path=" + getPath, "Callback": getDoctor, "CallbackParams": { Elm: empty } });
            } else {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.style.width = (98 / fieldNames.length) + "%";
                faxStat.style.fontSize = "14px";
                faxStat.style.color = "rgb(63, 80, 104)";
                faxStat.style.fontWeight = "bold";

                var data = localJson[i][singleName];
                if (singleName == "PtDOB") {
                    var split = data.split("T");
                    var anotherSplit = split[0].split("-");
                    data = anotherSplit[1] + '/' + anotherSplit[2] + '/' + anotherSplit[0];
                }
                faxStat.innerHTML = data;
            }
            
        }
         
    }
    finishHolder = GHVHS.DOM.create({ "Type": "div", "Class": "finishHolder", "Id": "finishHolder", "Style": "Height:30%;Width: 55%;margin-top:0.2%; float:left;", "Parent": document.getElementById('MainContent') });
    Save = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": "Done", "Id": "SearchClearButton", "Style": "Height:8%;Margin-left:23%;Width:30%;", "Parent": finishHolder });
    Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": "Remove Fax", "Id": "SearchClearButton", "Style": "Height:8%;Margin-left:10%;Width:30%;", "Parent": finishHolder });

},
DrawFormInputs: function(p){
    var masterElem = p.elem;
    for (var i = 0; i < p.label.length; i++){
        var NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Id": "NameAndInput", "Parent": masterElem });
        var InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Parent": NameAndInput });
        InputLabel.innerHTML = p.label[i];
        if (p.inputType[i] == "dropDown"){
            var SearchBoxView = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "drDrop", "Parent": NameAndInput });
            if (p.Values) {
                SearchBoxView.value = p.Values[i];
            }
            SearchBoxView.style.width = "55%";
            SearchBoxView.style.height = "65%";
            var jsonData = p.DropDownData[i];
            var options = [];
            for (var j = 0; j < jsonData.length; j++) {
                options.push(jsonData[j][p.RowsToUse]);
            }
              
            GHVHS.DOM.CreateDropDown({ "Element": "drDrop", "dropDownId": "", "Options": options, "todraw": "input" });
            SearchBoxView.setAttribute("Placeholder", "  Please Choose a Physician");
            SearchBoxView.onkeyup = function () {
                var getDropDown = document.getElementById("DropDown8");
                var opts = getDropDown.querySelectorAll(".DropOption");
                for (var q = 0; q < opts.length; q++) {
                    var value = opts[q].innerHTML.toLowerCase();
                    if (this.value == ""){
                        opts[q].className = "DropOption";

                    } else if (value.indexOf(this.value.toLowerCase()) < 0) {
                        opts[q].style.display = "none";
                    } else {
                        opts[q].style.display = "block";
                    }
                }
            }
        } else {
            var SearchBoxView = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "inp", "Parent": NameAndInput });
            if (p.Values) {
                SearchBoxView.value = p.Values[i];
            }
            SearchBoxView.style.backgroundImage = "url(/img/edit.png)";
            SearchBoxView.style.backgroundSize = "25px";
            SearchBoxView.style.width = "55%";
            SearchBoxView.style.height = "65%";
        }
    }
},
AddNewPatient: function (p) {
    function drawNewPatient(json,p) {
        var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
        canvas2.onclick = function (e) {
            if (e.target.id == "canvas2") {
                document.getElementById("canvas").removeChild(this);
            }
        }
        var framed = GHVHS.DOM.create({ "Type": "div", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        framed.style.backgroundColor = "white";
        var framedHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Content": "New Patient Demographics", "Id": "framedHeader", "Parent": framed });
        framedHeader.style.borderBottom = "1px solid rgb(63, 80, 104)";
        framedHeader.style.height = "4%";
        var framedBody = GHVHS.DOM.create({ "Type": "div", "Class": "framedBody", "Id": "framedBody", "Parent": framed });
        var jsonHolder = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "jsonHolder", "Parent": framed });
        jsonHolder.innerHTML = json.data;
        var jsonDrop = JSON.parse(jsonHolder.innerHTML);
        Fax.DrawFormInputs({
            "elem": framedBody, "inputType": ["standard", "standard", "standard", "dropDown"], "label": ["Last Name:", "First Name:", "Date of Birth:", "*Physician:"],
            "DropDownData": ["", "", "", jsonDrop], "RowsToUse": "NAME_FULL_FORMATTED"
        });
        //var SearchAndPage = GHVHS.DOM.create({ "Type": "div", "Class": "SearchAndPage", "Id": "SearchAndPage", "Parent": framed });
        Save = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": "Save", "Id": "SearchClearButton","Style":"Height:4%;Margin-left:30%;", "Parent": framed });
        Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Content": "Cancel", "Id": "SearchClearButton", "Style": "Height:4%;", "Parent": framed });
        Cancel.onclick = function () {
            document.getElementById("canvas2").click();
        }
    }
     

     
    GHVHS.DOM.send({ "URL": "/api/Lookup?path=Doctor", "Callback": drawNewPatient, "CallbackParams": { Elm: p } });
     
},
redrawTableRows: function (json, p) {

        var jsonHolder = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "jsonHolder", "Parent": document.getElementById('MainContent') });
        jsonHolder.innerHTML = json.data;
        var jsonDrop = JSON.parse(jsonHolder.innerHTML);
        document.getElementById('MainContent').removeChild(jsonHolder);
        var getFax = document.getElementById("FaxTable");
        var getrows = getFax.querySelectorAll(".SingleTableElem");
        for (var i = 0; i < getrows.length ; i++) {
            getFax.removeChild(getrows[i]);
        }
        var localJson = jsonDrop;
        var lengthToUse = 0;
        if (localJson.length > 300) {
            lengthToUse = 300;
        } else {
            lengthToUse = localJson.length;
        }
        for (var i = 0; i < localJson.length ; i++) {
            SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": i + "", "Parent": getFax });
            SingleTableElem.style.height = "10%";
            if (i == 0) {
                SingleTableElem.id = "0";
            }
            SingleTableElem.onclick = function () {
                if (this.id != "selectedPatient") {
                    this.id = "selectedPatient";
                    this.parentElement.style.overflowY = "hidden";
                    tempOldBackground = GHVHS.DOM.create({ "Type": "div", "Class": "tempOldBackground", "Style": "display:none;", "Id": "tempOldBackground", "Parent": this });
                    tempOldBackground.innerHTML = this.style.backgroundColor;
                    this.style.backgroundColor = "rgba(0, 102, 153, 0.8)";

                    var getimg = this.querySelectorAll("img");
                    for (var i = 0; i < getimg.length; i++) {
                        getimg[i].src = "/img/greenCheck.png";
                    }
                    var getAllText = this.querySelectorAll(".status");
                    for (var i = 0; i < getAllText.length; i++) {
                        getAllText[i].style.color = "white";
                    }
                } else {
                    this.id = "notselected";
                    this.parentElement.style.overflowY = "scroll";
                    var getOldBackGround = this.querySelectorAll(".tempOldBackground");
                    if (getOldBackGround.length > 0) {
                        this.style.backgroundColor = getOldBackGround[0].innerHTML;
                        this.removeChild(getOldBackGround[0]);
                    } else {
                        this.style.backgroundColor = "white";
                    }
                    this.style.transform = "scale(1)";

                    var getimg = this.querySelectorAll("img");
                    for (var i = 0; i < getimg.length; i++) {
                        getimg[i].src = "/img/select.png";
                    }
                    var getAllText = this.querySelectorAll(".status");
                    for (var i = 0; i < getAllText.length; i++) {
                        getAllText[i].style.color = "rgb(63, 80, 104)";
                    }
                }


            }
            if (i % 2 == 0) {
                SingleTableElem.style.background = "white";
            } else {
                SingleTableElem.style.background = "#f5fcff";
            }
            var DBnames = p.DbNames;
            var fieldNames = p.FieldNames;
            for (var j = 0; j < DBnames.length; j++) {
                var singleName = DBnames[j];
                if (singleName == "img") {
                    var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                    faxStat.style.width = (98 / fieldNames.length) + "%";
                    faxStat.onclick = function () {
                        this.parentElement.click();
                    };
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src":"/img/select.png", "Style": "Height:30px;", "Parent": faxStat });
                    lodingImg.onclick = function () {
                        this.parentElement.click();
                    };
                }else if (singleName == "Infusion"){
                    var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                    faxStat.style.width = (98 / fieldNames.length) + "%";
                    faxStat.innerHTML = "Infusion";
                    faxStat.style.color = "rgb(63, 80, 104)";
                    faxStat.style.fontSize = "14px";
                    faxStat.style.fontWeight = "bold";
                }else if (singleName.indexOf("Date") > 0 ) {
                    var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                    faxStat.style.width = (98 / fieldNames.length) + "%";
                    faxStat.innerHTML = Fax.formateSQLDate(localJson[i][singleName]);
                    faxStat.style.color = "rgb(63, 80, 104)";
                    faxStat.style.fontSize = "14px";
                    faxStat.style.fontWeight = "bold";
                } else if (singleName == "DrID") {
                    var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                    
                    faxStat.style.color = "rgb(63, 80, 104)";
                    faxStat.style.fontSize = "14px";
                    faxStat.style.width = (98 / fieldNames.length) + "%";
                    faxStat.style.fontWeight = "bold";
                    empty = faxStat;
                    function getDoctor(DRjson, e) {
                        var jsonHolder = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "jsonHolder", "Parent": document.getElementById('MainContent') });
                        jsonHolder.innerHTML = DRjson.data;
                        var jsonDrop = JSON.parse(jsonHolder.innerHTML);
                        document.getElementById('MainContent').removeChild(jsonHolder);
                        if (jsonDrop.length >= 1) {
                            e.Elm.innerHTML = jsonDrop[0]["NAME_FULL_FORMATTED"];
                        }else {
                            e.Elm.innerHTML = "Doctor Not On File";
                        }
                            

                    }
                    var getPath = "";
                    if (p.route == "Infusion") {
                        getPath = "Doctor"

                    } else if (p.route == "OR") {
                        getPath = "Doctor"
                    } else if (p.route == "Cardiac" || p.route == "Ent" || p.route == "Concierge") {
                        getPath = "Doctor"
                    }
                    GHVHS.DOM.send({ "URL": "/Api/Lookup?ID=" + localJson[i][singleName] + "&path=" + getPath, "Callback": getDoctor, "CallbackParams": { Elm: empty } });
                } else {
                    var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                    faxStat.style.width = (98 / fieldNames.length) + "%";
                    faxStat.style.fontSize = "14px";
                    faxStat.style.color = "rgb(63, 80, 104)";
                    faxStat.style.fontWeight = "bold";
                    var data = localJson[i][singleName];
                    if (singleName == "PtDOB") {
                        var split = data.split("T");
                        var anotherSplit = split[0].split("-");
                        data = anotherSplit[1] + '/' + anotherSplit[2] + '/' + anotherSplit[0];
                    }
                    faxStat.innerHTML = data;


                }


            }
        }
        Fax.RemoveSmallLoader();
},
drawPagingContainer: function (p) {
    var MasterElem = p.Elem;
    var flag = p.API;
    var ApiPath = p.APIPath;
    var page = p.page;
    var route = p.route;
    PagingContaier = GHVHS.DOM.create({ "Type": "div", "Class": "PagingContaier ", "Id": "PagingContaier","Style":"height:100%; Width: 100%;", "Parent": MasterElem });
    PagingLeftArrow = GHVHS.DOM.create({ "Type": "img", "Class": "PagingLeftArrow", "Id": "PagingLeftArrow", "Src": "/img/BlueArrow.png", "Parent": PagingContaier });
    PagingLeftArrow.onclick = function () {
        var temp = this.parentElement.querySelectorAll(".SinglePageLinkCurrentPage");
        var currentPage = Number(temp[0].id);
        if (currentPage == 1) {
            return; 
        }else {
            
            document.getElementById((currentPage - 1) + "").click();
        }

    }

    if (page != "1" && page != "2") {
        if (p.json.length > 0) {
            var PageNumberEnd = Number(page) + 3;
            var startNumber = (Number(page) - 2);
        } else {
            var PageNumberEnd = Number(page) + 1;
            var startNumber = (Number(page) - 4);
        }

    } else if (page == "2") {
        var PageNumberEnd = 6;
        var startNumber = 1;
    } else {
        var PageNumberEnd = 11;
        var startNumber = 1;
    }

    for (var i = startNumber; i < PageNumberEnd; i++) {
        if (page == i) {
            SinglePageLink = GHVHS.DOM.create({ "Type": "a", "Class": "SinglePageLinkCurrentPage", "Id": i + "", "Content": i + "", "Parent": PagingContaier });

        } else {
            SinglePageLink = GHVHS.DOM.create({ "Type": "a", "Class": "SinglePageLink", "Id": i + "", "Content": i + "", "Parent": PagingContaier });
        }
       
        SinglePageLink.onclick = function () {
            var tempAPI = "";
            tempAPI = ApiPath + "&Page=" + this.id;
            var temp = this.parentElement.querySelectorAll(".SinglePageLinkCurrentPage");
            temp[0].className = "SinglePageLink";
            this.className = "SinglePageLinkCurrentPage";
            var searchValues = [];
            var getValues = this.parentElement.querySelectorAll("input, div");
            for (var i = 0; i < getValues.length; i++) {
                if (getValues[i].className != "SearchButtonSmall") {
                    if (getValues[i].className == "Filter") {
                        if (getValues[i].value) {
                            searchValues.push(getValues[i].value);
                        } else {
                            searchValues.push(getValues[i].innerHTML);
                        }

                    }
                }
            }
            Fax.DrawSmallLoader();
       
            if (searchValues.length == 0) {
                GHVHS.DOM.send({ "URL": tempAPI, "Callback": Fax.redrawTableRows, "CallbackParams": { DbNames: p.DBNames, route: p.route, FieldNames: p.FieldNames } });
            } else {
                GHVHS.DOM.send({ "URL": tempAPI + "&LN=" + searchValues[0] + "&FN=" + searchValues[1], "Callback": Fax.redrawTableRows, "CallbackParams": { DbNames: p.DBNames, route: p.route, FieldNames: p.FieldNames } });
            }


        }
        

    }
    PagingRightArrow = GHVHS.DOM.create({ "Type": "img", "Class": "PagingRightArrow", "Id": "PagingRightArrow", "Src": "/img/BlueArrow.png", "Parent": PagingContaier });
    PagingRightArrow.onclick = function () {
        var temp = this.parentElement.querySelectorAll(".SinglePageLinkCurrentPage");
        var currentPage = Number(temp[0].id);
            document.getElementById((currentPage + 1) + "").click();
    }
},

PtFaxDetail: function (PtJson, OgService, AllSerives, ServiceJson, route, path, ViewOnly) {
    var masterElem = document.getElementById('MainContent');
    if (masterElem.offsetWidth < 1200) {
        document.getElementById("header").className = "hide";
        var hideFooter = setTimeout(function () {
            document.getElementById("Footer").className = "hide";
        }, 100);
    } else {
        var backLabel = route + " Fax";
        BackButton = GHVHS.DOM.create({ "Type": "div", "Class": "BackButton", "Id": "BackButton", "Parent": document.getElementById('canvas') });
        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/backArrowTrans.png", "Style": "Height:20px;", "Parent": BackButton });
        BackButton.innerHTML += "Back To " + backLabel;
        BackButton.onclick = function () {
            if (route == "OR") {
                window.location.href = "/Fax/" + route + "/AllFaxes?Page=1"
            } else {
                window.location.href = "/Fax/" + route + "/Queued?Page=1";
            }
                
        }
        var hideFooter = setTimeout(function () {
            if (document.getElementById("MainContent").offsetHeight > (document.getElementById("tiffy").offsetHeight +document.getElementById("tiffy").offsetTop )){
                document.getElementById("Footer").style.marginTop = (document.getElementById("MainContent").offsetHeight - (document.getElementById("tiffy").offsetHeight +document.getElementById("tiffy").offsetTop )) + "px";
            }else {
                document.getElementById("Footer").style.marginTop = ((document.getElementById("tiffy").offsetHeight + document.getElementById("tiffy").offsetTop) - document.getElementById("MainContent").offsetHeight + "px");
            }
            
        }, 100);
    }
    FaxTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Id": "FaxTableHeader","Style":"border-bottom: 1px solid; padding-bottom:40px; ", "Parent": masterElem });
    FaxTableHeader.innerHTML = "Orange Regional Medical Center " + route + " Fax Management";
    FaxTableHeader2 = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Style": "    width: 40%; font-size: 20px;margin-left: 30%;margin-top: 1%;height: auto; background-color: white;box-shadow: 2px 2px 4px silver;margin-bottom: 3%;border: 1px solid silver;", "Id": "FaxTableHeader2", "Parent": masterElem });
    FaxTableHeader1 = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Style": "width:100%;font-size:20px; ;height:5%", "Content": "Demographics", "Id": "FaxTableHeader", "Parent": FaxTableHeader2 });
    if (ViewOnly == "N") {
        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/edit.png", "Style": "Height:30px;", "Parent": FaxTableHeader1 });
        lodingImg.onmouseover = function () {
            this.style.transform = "scale(1.1)";
        }
        lodingImg.onmouseout = function () {
            this.style.transform = "scale(1)";
        }
        lodingImg.onclick = function () {
            var tempurl = this.src.split("/img");
            var testURL = "/img" + tempurl[1];
            if (testURL == "/img/edit.png") {
                var getPt = document.getElementById("PtDet");
                var x = getPt.querySelectorAll(".singlePtDet");
                var infoValues = [];
                var infoLabels = [];
                for (var i = 0; i < x.length; i++) {
                    var info = x[i].innerHTML.split(":");
                    infoLabels.push(info[0]);
                    var Value = info[1].replace("</strong>", "");
                    if (info.length > 2) {
                        Value += ":" + info[2];
                    }
                    infoValues.push(Value);

                    x[i].className = "hide";
                }
                this.src = "/img/RedX.png";
                var Check = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "Check", "Src": "/img/greenCheck.png", "Style": "padding-left:10px;Height:27px;", "Parent": this.parentElement });
                Check.onmouseover = function () {
                    this.style.transform = "scale(1.1)";
                }
                Check.onmouseout = function () {
                    this.style.transform = "scale(1)";
                }
                Check.onclick = function () {
                    var dataHolder = document.getElementById("PtDet");
                    var id = this.parentElement.id;
                    Fax.UpdatePt(dataHolder, id);
                }
                var amount = document.getElementById("tiffy").style.top.replace("px", "");
                document.getElementById("tiffy").style.top = (Number(amount) + 100) + "px";
                function jasonData(json, p) {
                    json = JSON.parse(json.data);
                    Fax.GlobalJsonDr =  json;
                    Fax.DrawFormInputs({
                        "elem": getPt, "inputType": ["standard", "standard", "dropDown", "standard"], "label": infoLabels,
                        "Values": infoValues,
                        "DropDownData": ["", "", json, ""], "RowsToUse": "NAME_FULL_FORMATTED"
                    });
                }
                GHVHS.DOM.send({ "URL": "/Api/Lookup?path=Doctor", "Callback": jasonData, "CallbackParams": [] });
            } else {
                this.src = "/img/edit.png";
                this.parentElement.removeChild(document.getElementById("Check"));
                var amount = document.getElementById("tiffy").style.top.replace("px", "");
                document.getElementById("tiffy").style.top = (Number(amount) - 100) + "px";
                var getPt = document.getElementById("PtDet");
                var x = getPt.querySelectorAll(".NameAndInput");
                for (var i = 0; i < x.length; i++) {
                    getPt.removeChild(x[i]);
                }
                var x2 = getPt.querySelectorAll(".hide");
                for (var i = 0; i < x2.length; i++) {
                    x2[i].className = "singlePtDet";
                }

            }
        };
    }
    
    PtDet = GHVHS.DOM.create({ "Type": "div", "Class": "PtDet", "Id": "PtDet","Style":"height:40%; margin-top:1%;margin-left:20%;", "Parent": FaxTableHeader2 });
    var rows = ["PtName", "PtDOB", "getDoc", "ArchiveDate"];
    for (var i = 0; i < 1; i++) {
        var idtoUSe = PtJson[0]["FaxPtDetailID"] + "";
        FaxTableHeader1.id = idtoUSe;
        for (var j = 0; j < rows.length; j++) {
            singlePtDet = GHVHS.DOM.create({ "Type": "div", "Class": "singlePtDet", "Id": "singlePtDet", "Parent": PtDet });
            if (rows[j] == "getDoc") {
                function getDoc(json, p) {
                    json = JSON.parse(json.data);
                    if (json[0]) {
                        p.innerHTML = "<Strong>Doctor:</Strong> " + json[0]["NAME_FULL_FORMATTED"];
                    } else {
                        p.innerHTML = "<Strong>Doctor:</Strong>  Not On File";
                    }
                    
                }
                var data = PtJson[i]["DrID"];
                if (route == "OR") {
                    GHVHS.DOM.send({ "URL": "/Api/Lookup?ID=" + data + "&path=Doctor", "Callback": getDoc, "CallbackParams": singlePtDet });
                } else {
                    GHVHS.DOM.send({ "URL": "/Api/Lookup?ID=" + data + "&path=Doctor", "Callback": getDoc, "CallbackParams": singlePtDet });
                }
                
            } else if (rows[j] == "ArchiveDate" || rows[j] == "PtDOB") {
                singlePtDet.innerHTML = "<Strong>" + rows[j] + ":</Strong> " + Fax.formateSQLDate(PtJson[i][rows[j]]);
            } else if (rows[j] == "PtFirstName") {
                singlePtDet.innerHTML = "<Strong>" + rows[j] + ":</Strong> " + PtJson[i]["PtFirstName"] + " " + PtJson[i]["PtLastName"];
            } else {
                singlePtDet.innerHTML = "<Strong>" + rows[j] + ":</Strong> " + PtJson[i][rows[j]];
            }
        }
        
        
    }
    localFrame = GHVHS.DOM.create({ "Type": "iframe", "Class": "framedTif", "Id": "tiffy", "Style": "position: absolute;right: 5%;top:350px;height: 90%;margin-top:1%;margin-bottom:1%; width: 35%; border: none; box-shadow: rgb(68, 68, 68) 2px 2px 3px;", "Parent": masterElem });


    ServicesObj = GHVHS.DOM.create({ "Type": "div", "Class": "ServiceSmallObj", "Id": "ServiceSmallObj", "Parent": masterElem });
    localFrame.style.top = ServicesObj.offsetTop + "px";
    FaxTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SmallFaxHeader", "Id": "FaxTableHeader", "Parent": ServicesObj });
    FaxTableHeader.style.height = "auto";
    FaxTableHeader.style.width = "100%";
    FaxTableHeader.style.marginTop = "0px";
    FaxTableHeader.style.paddingBottom = "0.5%";
    FaxTableHeader.style.marginLeft = "0px";
    FaxTableHeader.style.borderBottom = "1px solid rgb(63, 80, 104)";
    if (ViewOnly == "N") {
        var headers = ["Edit", "Service", "Status", "Location", "Scheduled Date", "Updated By", "Delete"];
        var rowNames = ["Edit", "ServiceDescription", "StatusDescription", "LocationDescription", "ScheduledDate2", "UpdatedBy", "Delete"];
    } else {
        var headers = [ "Service", "Status", "Location", "Scheduled Date", "Updated By", ];
        var rowNames = [ "ServiceDescription", "StatusDescription", "LocationDescription", "ScheduledDate2", "UpdatedBy"];
    }
    for (var i = 0; i < headers.length; i++) {
        var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Style": "Color:white;", "Parent": FaxTableHeader });
        faxStat.id = headers[i] + "1";
        faxStat.style.width = (98 / headers.length) + "%";
        faxStat.innerHTML = headers[i];
        faxStat.style.borderRight = "none";
    }
    var Valuesedit = [];
    if (OgService[0]) {
        for (var i = 0; i < OgService.length; i++) {
            SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": i + "", "Parent": ServicesObj });
            SingleTableElem.id = OgService[i]["FaxToServiceTypeID"];
            SingleTableElem.style.height = "15%";
            for (var j = 0; j < rowNames.length; j++) {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.style.fontSize = "15px";
                faxStat.style.width = (98 / headers.length) + "%";
                if (rowNames[j] == "Edit") {
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "Status", "Src": "/img/edit.png", "Style": "Height:30px;", "Parent": faxStat });
                    faxStat.id = "Edit";
                    lodingImg.onmouseover = function () {
                        this.style.transform = "scale(1.1)";
                    }
                    lodingImg.onmouseout = function () {
                        this.style.transform = "scale(1)";
                    }
                    lodingImg.onclick = function () {
                        var elem = this.parentElement.parentElement;
                        var toString = this.src.toString();
                        var getURL = toString.split("/img");
                        var compareURl = "/img"+getURL[1];
                        if (compareURl != "/img/greenCheck.png") {
                            Fax.EditSerivce(elem);
                        }else {
                            Fax.saveEdit(elem);
                        }
                        
                    }
                } else if (rowNames[j] == "Delete") {
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/RedX.png", "Style": "Height:30px;", "Parent": faxStat });
                    lodingImg.onmouseover = function () {
                        this.style.transform = "scale(1.1)";
                    }
                    lodingImg.onmouseout = function () {
                        this.style.transform = "scale(1)";
                    }
                    lodingImg.onclick = function () {
                        if (document.getElementById("Delete1").innerHTML == "Delete") {
                            Fax.DrawConfirmButton(this.parentElement.parentElement, "Service");
                        } else {
                            Fax.CancelEdit(this.parentElement.parentElement);
                        }
                        
                    }
                } else if (rowNames[j] == "LocationDescription") {
                    if (OgService[i][rowNames[j]]) {
                        faxStat.innerHTML = OgService[i][rowNames[j]];
                    } else {
                        faxStat.innerHTML = " ";
                        faxStat.style.height = (SingleTableElem.offsetHeight/2) + "px";
                    }
                    faxStat.id = rowNames[j];
                } else {
                    faxStat.innerHTML = OgService[i][rowNames[j]];
                    faxStat.id = rowNames[j];
                }

            }
        }
    }
    ServicesSubObj = GHVHS.DOM.create({ "Type": "div", "Class": "ServicesSubObj", "Id": "ServicesSubObj", "Parent": ServicesObj });
    FaxTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SmallFaxHeader", "Id": "FaxTableHeader", "Parent": ServicesSubObj });
    FaxTableHeader.style.height = "auto";
    FaxTableHeader.style.width = "100%";
    FaxTableHeader.style.marginTop = "0px";
    FaxTableHeader.style.paddingBottom = "0.5%";
    FaxTableHeader.style.marginLeft = "0px";
    FaxTableHeader.style.borderBottom = "1px solid rgb(63, 80, 104)";
    if (ViewOnly == "N") {
        var headers2 = ["Edit", "Doc Type", "Inserted", "Delete"];
        var rowNames2 = ["Edit", "FaxTypeDescription", "UpdateDate", "Delete"];
    } else {
        var headers2 = [ "Doc Type", "Inserted"];
        var rowNames2 = [ "FaxTypeDescription", "UpdateDate"];
    }
    for (var i = 0; i < headers2.length; i++) {
        var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Style": "Color:white;", "Parent": FaxTableHeader });
        faxStat.id = headers2[i] + "2";
        faxStat.style.width = (98 / headers2.length) + "%";
        faxStat.innerHTML = headers2[i];
    }
    if (AllSerives[0]){
        for (var i = 0; i < AllSerives.length; i++) {
            if (i > 0) {
            SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": i + "", "Parent": ServicesSubObj });
            SingleTableElem.id = AllSerives[i]["FaxPTDetailID"];
            SingleTableElem.style.height = "15%";
            for (var j = 0; j < rowNames2.length; j++) {
                var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                faxStat.style.fontSize = "14px";
                faxStat.style.width = (98 / headers2.length) + "%";
                if (rowNames2[j] == "Edit") {
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/edit.png", "Style": "Height:30px;", "Parent": faxStat });
                    faxStat.id = "Edit3";
                    lodingImg.onmouseover = function () {
                        this.style.transform = "scale(1.1)";
                    }
                    lodingImg.onmouseout = function () {
                        this.style.transform = "scale(1)";
                    }
                    lodingImg.onclick = function () {
                        if (document.getElementById("Edit2").innerHTML == "Save") {
                            Fax.SaveDoctypes(this.parentElement.parentElement);
                        } else {
                            Fax.EditDoctypes(this.parentElement.parentElement);
                        }
                        
                    }
                } else if (rowNames2[j] == "Delete") {
                    faxStat.id = "Delete3";
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/RedX.png", "Style": "Height:30px;", "Parent": faxStat });
                    lodingImg.onmouseover = function () {
                        this.style.transform = "scale(1.1)";
                    }
                    lodingImg.onmouseout = function () {
                        this.style.transform = "scale(1)";
                    }
                    lodingImg.onclick = function () {
                        if (document.getElementById("Delete2").innerHTML == "Delete") {
                            Fax.DrawConfirmButton(this.parentElement.parentElement, "DocType");
                        } else {
                            Fax.CancelDocEdit(this.parentElement.parentElement);
                        }
                        
                    }
                }else {
                    faxStat.innerHTML = AllSerives[i][rowNames2[j]];
                    faxStat.id = rowNames2[j] + "3";
                }
            
            }
        }
        }
    }
    
    
    ServiceObj = GHVHS.DOM.create({ "Type": "div", "Class": "ServiceSmallObj", "Id": "ServiceSmallObj", "Parent": masterElem });
    
    
       var headers = ["View","Viewing","Fax Type", "File","Received"];
       var rowNames = ["View", "Viewing", "FaxTypeDescription", "FileName", "ReceivedDate"];
        FaxTableHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SmallFaxHeader", "Id": "FaxTableHeader", "Parent": ServiceObj });
        FaxTableHeader.style.height = "auto";
        FaxTableHeader.style.width = "100%";
        FaxTableHeader.style.marginTop = "0px";
        FaxTableHeader.style.paddingBottom = "0.5%";
        FaxTableHeader.style.marginLeft = "0px";
        FaxTableHeader.style.borderBottom="1px solid rgb(63, 80, 104)";
        for (var i = 0; i < headers.length; i++) {
            var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status","Style":"Color:white;", "Parent": FaxTableHeader });
       
            faxStat.style.width = (98 / headers.length) + "%";
            faxStat.innerHTML = headers[i];
            faxStat.style.borderRight = "none";
        }
        if (ServiceJson[0]) {
            for (var i = 0; i < ServiceJson.length; i++) {
                
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": i + "", "Parent": ServiceObj });
                SingleTableElem.style.height = "15%";
                SingleTableElem.id = ServiceJson[0]["FaxToServiceTypeID"];
                    SingleTableElem.onclick = function () {
                        var x = this.parentElement.querySelectorAll(".SingleTableElem");
                        for (var y = 0; y < x.length; y++) {
                            if (x[y].id == "selectedPatient"){
                                x[y].id = "notselected";

                                var getOldBackGround = x[y].querySelectorAll(".tempOldBackground");
                                if (getOldBackGround.length > 0) {
                                    x[y].style.backgroundColor = getOldBackGround[0].innerHTML;
                                    x[y].removeChild(getOldBackGround[0]);
                                } else {
                                    x[y].style.backgroundColor = "white";
                                }
                                x[y].style.transform = "scale(1)";

                                var getimg = x[y].querySelectorAll("img");
                                for (var i = 0; i < getimg.length; i++) {
                                    if (getimg[i].id != "ViewImg") {
                                        getimg[i].style.height = "0px";
                                    }
                                }
                                var getAllText = x[y].querySelectorAll(".status");
                                for (var i = 0; i < getAllText.length; i++) {
                                    getAllText[i].style.color = "rgb(63, 80, 104)";
                                }
                            }
                        }

                        if (this.id != "selectedPatient") {
                            this.id = "selectedPatient";
                            this.parentElement.style.overflowY = "hidden";
                            tempOldBackground = GHVHS.DOM.create({ "Type": "div", "Class": "tempOldBackground", "Style": "display:none;", "Id": "tempOldBackground", "Parent": this });
                            tempOldBackground.innerHTML = this.style.backgroundColor;
                            this.style.backgroundColor = "rgba(0, 102, 153, 0.8)";

                            var getimg = this.querySelectorAll(".CArrowEdit");
                            for (var i = 0; i < getimg.length; i++) {
                                getimg[i].style.height = "30px";
                            }
                            var getAllText = this.querySelectorAll(".status");
                            for (var i = 0; i < getAllText.length; i++) {
                                if (getAllText[i].innerHTML.indexOf(".TIF") >0){
                                    var path = getAllText[i].innerHTML.split(".");
                                    document.getElementById("tiffy").src = "/HelloWorld/Tiff?id=" + path[0] + "&FaxDepo=" + route;
                                    
                                }
                                    
                                getAllText[i].style.color = "white";
                            }
                        } else {
                            this.id = "notselected";
                            
                            var getOldBackGround = this.querySelectorAll(".tempOldBackground");
                            if (getOldBackGround.length > 0) {
                                this.style.backgroundColor = getOldBackGround[0].innerHTML;
                                this.removeChild(getOldBackGround[0]);
                            } else {
                                this.style.backgroundColor = "white";
                            }
                            this.style.transform = "scale(1)";

                            var getimg = this.querySelectorAll("img");
                            for (var i = 0; i < getimg.length; i++) {
                                if (getimg[i].id != "ViewImg") {
                                    getimg[i].style.height = "0px";
                                }
                                
                            }
                            var getAllText = this.querySelectorAll(".status");
                            for (var i = 0; i < getAllText.length; i++) {
                                getAllText[i].style.color = "rgb(63, 80, 104)";
                            }
                        }
                       

                    }
                    for (var j = 0; j < rowNames.length ; j++) {
                        var singleName = rowNames[j];
                        if (singleName == "Viewing") {
                            var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                            faxStat.style.width = (98 / headers.length) + "%";
                            
                            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/greenCheck.png", "Style": "Height:0px;", "Parent": faxStat });
                            lodingImg.onclick = function () {
                                this.parentElement.click();
                            };
                        } else if (singleName == "Delete") {
                            var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                            faxStat.style.width = (98 / headers.length) + "%";

                            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/RedX.png", "Style": "Height:0px;", "Parent": faxStat });
                            lodingImg.onmouseover = function () {
                                this.style.transform = "scale(1.1)";
                            }
                            lodingImg.onmouseout = function () {
                                this.style.transform = "scale(1)";
                            }
                            
                        } else if (singleName == "View") {
                           
                            var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                            faxStat.style.width = (98 / headers.length) + "%";

                            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "ViewImg", "Src": "/img/ViewOnly.png", "Style": "Height:30px;", "Parent": faxStat });
                            lodingImg.onmouseover = function () {
                                this.style.transform = "scale(1.1)";
                            }
                            lodingImg.onmouseout = function () {
                                this.style.transform = "scale(1)";
                            }

                        } else if (singleName == "FileName") {
                            var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                            faxStat.style.width = (98 / headers.length) + "%";
                            var fN = ServiceJson[i][rowNames[j]].split("tiffs\\");
                            faxStat.innerHTML = ServiceJson[i][rowNames[j]];
                            faxStat.style.color = "rgb(63, 80, 104)";
                            faxStat.style.fontSize = "14px";
                            faxStat.style.fontWeight = "bold"; 
                        } else {
                            var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
                            faxStat.style.width = (98 / headers.length) + "%";
                            faxStat.innerHTML = ServiceJson[i][rowNames[j]];
                            faxStat.style.color = "rgb(63, 80, 104)";
                            faxStat.style.fontSize = "14px";
                            faxStat.style.fontWeight = "bold";
                        }
                    }
                    if (i == 0) {
                        SingleTableElem.click();
                    }
                }
        } else {
            SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": i + "", "Parent": ServiceObj });
            SingleTableElem.style.height = "15%";
            if (i == 0) {
                SingleTableElem.id = "0";
                setTimeout(function (){
                    SingleTableElem.click();
                }, 200); 
            }
            var faxStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Parent": SingleTableElem });
            faxStat.style.width = "100%";
            faxStat.innerHTML =  PtJson[0]["PtFirstName"] + " " + PtJson[0]["PtLastName"] + " currently does not have any faxes.";
            faxStat.style.color = "rgb(63, 80, 104)";
            faxStat.style.fontSize = "15px";
            faxStat.style.fontWeight = "bold";
        }
       
        if (masterElem.offsetWidth < 1200) {
            var Cotainer = document.getElementById("FaxTableHeader2");
            Cotainer.style.width = "70%";
            Cotainer.style.marginLeft = "15%";
            var getAllStats = masterElem.querySelectorAll(".status");
            for (var i = 0; i < getAllStats.length; i++) {
                getAllStats[i].style.fontSize = "13px";
            }
        }
       
},
UpdatePt: function (Elem, Id) {
    GHVHS.DOM.DrawSmallLoader2();
    var getFilters = Elem.querySelectorAll(".NameAndInput");
    var FN = "";
    var LN = "";
    var PtDOB = "";
    var Doctor = ""; 
    var Date = "";
    var urlSplit = window.location.href.split("PTFax/");
    var TempRoute = urlSplit[1].split("/");
    var route = TempRoute[0];
    for (var i = 0; i < getFilters.length; i++) {
        var label = getFilters[i].querySelectorAll(".InputLabel");
        var getFilter = getFilters[i].querySelectorAll(".Filter");
        if (label[0].innerHTML == "PtName") {
           var  ptName = getFilter[0].value;
           var getFNLN = ptName.split(" ");
           FN = getFNLN[0];
           LN = getFNLN[1];
           if (getFNLN.length > 2){
               LN = getFNLN[1] + getFNLN[2];
           }
        } else if (label[0].innerHTML == "PtDOB") {
            PtDOB = getFilter[0].value;
        } else if (label[0].innerHTML == "Doctor") {
            var value = getFilter[0].value;
            for (var j =0; j < Fax.GlobalJsonDr.length; j++){
                if (value == Fax.GlobalJsonDr[j]["NAME_FULL_FORMATTED"] ){
                    Doctor = Fax.GlobalJsonDr[j]["DrID"]
                }
            }
        } else if (label[0].innerHTML == "ArchiveDate") {
            Date = getFilter[0].value;
        }
    }
    function redrawPage() {
        window.location.href = window.location.href;
    }
    GHVHS.DOM.send({ "URL": "/Api/UpdatePTData?FN=" + FN + "&LN=" + LN + "&route=" + route + "&Dr=" + Doctor + "&DOB=" + PtDOB + "&Id=" + Id, "Callback": redrawPage, "CallbackParams": [] });
},
SaveDoctypes: function (Elem) {
    GHVHS.DOM.DrawSmallLoader2();
    var urlSplit = window.location.href.split("PTFax/");
    var TempRoute = urlSplit[1].split("/");
    var route = TempRoute[0];
    var Status = "";
    var location = "";
    var Sched = "";
    var Id = Elem.id;
    for (var i = 0; i < getValues.length; i++) {
        if (getValues[i].id == "Doc Type2") {
            var value = getValues[i].firstChild.value;
            for (var j = 0; j < Fax.globalStatusJson.length; j++) {
                if (value == Fax.globalStatusJson[j]["FaxTypeDescription"]) {
                    Status = Fax.globalStatusJson[j]["FaxTypeID"];
                }
            }

        }
    }
    function redrawPage() {
        window.location.href = window.location.href;
    }
    GHVHS.DOM.send({ "URL": "/Api/DocTypeSerivce?Status=" + Status + "&route=" + route +  "&FaxService=" + Id, "Callback": redrawPage, "CallbackParams": [] });
},
saveEdit: function (Elem) {
    GHVHS.DOM.DrawSmallLoader2();
    var urlSplit = window.location.href.split("PTFax/");
    var TempRoute = urlSplit[1].split("/");
    var route = TempRoute[0];
    var Status = "";
    var location = "";
    var Sched = "";
    var Id = Elem.id;
    var getValues = Elem.querySelectorAll(".status");
    for (var i = 0; i < getValues.length; i++) {
        if (getValues[i].id == "StatusDescription") {           
            var value = getValues[i].firstChild.value;
            for (var j = 0; j < Fax.globalStatusJson.length; j++) {
                if (value == Fax.globalStatusJson[j]["StatusDescription"]) {
                    Status = Fax.globalStatusJson[j]["StatusID"];
                }
            }

        } else if (getValues[i].id == "LocationDescription") {
            var value = getValues[i].firstChild.value;
            for (var j = 0; j < Fax.globalLocationJson.length; j++) {
                if (value == Fax.globalLocationJson[j]["CODE"] || value == Fax.globalLocationJson[j]["DESCRIPTION"]) {
                    location = Fax.globalLocationJson[j]["CODE"];
                }
            }
        } else if (getValues[i].id == "ScheduledDate2") {
            if (getValues[i].firstChild.innerHTML.indexOf("/") > 0) {
                var Sched = getValues[i].firstChild.innerHTML;
            }
            
        }
    }
    function redrawPage() {
        window.location.href = window.location.href;
    }
    GHVHS.DOM.send({ "URL": "/Api/UpdateToService?status=" + Status + "&location=" + location + "&dt=" + Sched + "&route="+route+"&FaxService=" + Id, "Callback": redrawPage, "CallbackParams": [] });

},
globalStatusJson: [],
globalLocationJson: [],
CancelEdit: function (Elem,UpdateOrCancel) {
    document.getElementById("Edit1").innerHTML = "Edit";
    document.getElementById("Delete1").innerHTML = "Delete";
    if (!UpdateOrCancel) {
        UpdateOrCancel = "N";
    }
    var getValues = Elem.querySelectorAll(".status");
    var Values = [];
    var urlSplit = window.location.href.split("PTFax/");
    var TempRoute = urlSplit[1].split("/");
    var route = TempRoute[0];
    for (var i = 0; i < getValues.length; i++) {
        if (getValues[i].id == "Edit") {
            getValues[i].firstChild.src = "/img/edit.png";
        } else if (getValues[i].id == "StatusDescription") {
            if (UpdateOrCancel == "N") {
                for (var j = 0; j < Fax.CurrentEditValues.length; j++) {
                    if (Fax.CurrentEditValues[j]["Label"] == "StatusDescription") {
                        var value = Fax.CurrentEditValues[j]["Value"];
                    }
                }
            } else {
                var value = getValues[i].firstChild.value;
            }
           
            
            getValues[i].removeChild(getValues[i].firstChild);
            getValues[i].innerHTML = value;

        } else if (getValues[i].id == "LocationDescription") {
            if (UpdateOrCancel == "N") {
                for (var j = 0; j < Fax.CurrentEditValues.length; j++) {
                    if (Fax.CurrentEditValues[j]["Label"] == "LocationDescription") {
                        var value = Fax.CurrentEditValues[j]["Value"];
                    }
                }
            } else {
                var value = getValues[i].firstChild.value;
            }
            
            getValues[i].removeChild(getValues[i].firstChild);
            getValues[i].innerHTML = value;
        } else if (getValues[i].id == "ScheduledDate2") {
            if (UpdateOrCancel == "N") {
                for (var j = 0; j < Fax.CurrentEditValues.length; j++) {
                    if (Fax.CurrentEditValues[j]["Label"] == "ScheduledDate2") {
                        var value = Fax.CurrentEditValues[j]["Value"];
                    }
                }
            } else {
                var value = getValues[i].firstChild.innerHTML;
            }
           
            getValues[i].removeChild(getValues[i].firstChild);
            getValues[i].innerHTML = value;

        }
    }
    Fax.CurrentEditValues = [];
    
},
CancelDocEdit: function (Elem, UpdateOrCancel) {
    document.getElementById("Edit2").innerHTML = "Edit";
    document.getElementById("Delete2").innerHTML = "Delete";
    if (!UpdateOrCancel) {
        UpdateOrCancel = "N";
    }
    var getValues = Elem.querySelectorAll(".status");
    var Values = [];
    var urlSplit = window.location.href.split("PTFax/");
    var TempRoute = urlSplit[1].split("/");
    var route = TempRoute[0];
    for (var i = 0; i < getValues.length; i++) {
        if (getValues[i].id == "Edit3") {
            getValues[i].firstChild.src = "/img/edit.png";
        } else if (getValues[i].id == "FaxTypeDescription3") {
            if (UpdateOrCancel == "N") {
                for (var j = 0; j < Fax.CurrentEditValues2.length; j++) {
                    if (Fax.CurrentEditValues2[j]["Label"] == "FaxTypeDescription3") {
                        var value = Fax.CurrentEditValues2[j]["Value"];
                    }
                }
            } else {
                var value = getValues[i].firstChild.value;
            }


            getValues[i].removeChild(getValues[i].firstChild);
            getValues[i].innerHTML = value;

        } 
    }
    Fax.CurrentEditValues2 = [];

},
EditDoctypes:function (Elem){
    document.getElementById("Edit2").innerHTML = "Save";
    document.getElementById("Delete2").innerHTML = "Cancel";
    var getValues = Elem.querySelectorAll(".status");
    var urlSplit = window.location.href.split("PTFax/");
    var TempRoute = urlSplit[1].split("/");
    var route = TempRoute[0];
    for (var i = 0; i < getValues.length; i++) {
        if (getValues[i].id == "Edit3") {
            getValues[i].firstChild.src = "/img/greenCheck.png";
        } else if (getValues[i].id == "FaxTypeDescription3") {
            Fax.CurrentEditValues2.push({ "Label": "FaxTypeDescription3", "Value": getValues[i].innerHTML });
            function drawDrop(json, p) {
                var value = p.innerHTML;
                p.innerHTML = "";
                input1 = GHVHS.DOM.create({ "Type": "input", "Class": "text", "Id": "statusDrop", "Parent": p });

                input1.style.width = "90%";
                input1.style.fontSize = "10px";
                input1.style.height = "20px";
                input1.style.margin = "0px";
                input1.value = value;
                var jsonData = Fax.decodeJson(json);
                Fax.globalServiceJson = jsonData;
                var options = [];
                for (var j = 0; j < jsonData.length; j++) {
                    options.push(jsonData[j]["FaxTypeDescription"]);
                }

                GHVHS.DOM.CreateDropDown({ "Element": "statusDrop", "dropDownId": "", "Options": options, "todraw": "input", "NoClear": "Y", "fontSize": "11" });

                input1.setAttribute("placeholder", "Doc Type");
            }
            GHVHS.DOM.send({ "URL": "/Api/Lookup?path=" + route + "FaxTypes", "Callback": drawDrop, "CallbackParams": getValues[i] });
        }
    }

},
CurrentEditValues2: [],
CurrentEditValues:[],
GlobalJsonDr:[],
globalServiceJson: [],
EditSerivce:function(Elem,Header){
    
    var notToUse = [];
    document.getElementById("Edit1").innerHTML = "Save";
    document.getElementById("Delete1").innerHTML = "Cancel";
    var getValues = Elem.querySelectorAll(".status");
   
    var urlSplit = window.location.href.split("PTFax/");
    var TempRoute = urlSplit[1].split("/");
    var route = TempRoute[0];
    for (var i = 0; i < getValues.length; i++) {
        if (getValues[i].id == "Edit") {
            getValues[i].firstChild.src = "/img/greenCheck.png";
        } else if (getValues[i].id == "StatusDescription") {
            Fax.CurrentEditValues.push({ "Label": "StatusDescription", "Value": getValues[i].innerHTML });
            function drawDrop(json, p) {
                var value = p.innerHTML;
                p.innerHTML = "";
                input1 = GHVHS.DOM.create({ "Type": "input", "Class": "text", "Id": "statusDrop", "Parent": p });
                input1.style.width = "90%";
                input1.style.fontSize = "10px";
                input1.style.height = "20px";
                input1.style.margin = "0px";
                input1.value = value;
                var jsonData = Fax.decodeJson(json);
                var options = [];
                Fax.globalStatusJson = jsonData;
                for (var j = 0; j < jsonData.length; j++) {
                    options.push(jsonData[j]["StatusDescription"]);
                }

                GHVHS.DOM.CreateDropDown({ "Element": "statusDrop", "dropDownId": "", "Options": options, "todraw": "input", "NoClear": "Y", "fontSize": "11" });

                input1.setAttribute("placeholder", "Status");
            }
            GHVHS.DOM.send({ "URL": "/Api/Lookup?path=" + route + "FaxStatus", "Callback": drawDrop, "CallbackParams": getValues[i] });
        } else if (getValues[i].id == "LocationDescription") {
            Fax.CurrentEditValues.push({ "Label": "LocationDescription", "Value": getValues[i].innerHTML });
            function drawDrop(json, p) {
                var value = p.innerHTML;
                p.innerHTML = "";
                input1 = GHVHS.DOM.create({ "Type": "input", "Class": "text", "Id": "statusDrop", "Parent": p });

                input1.style.width = "90%";
                input1.style.fontSize = "10px";
                input1.style.height = "20px";
                input1.style.margin = "0px";
                input1.value = value;
                var jsonData = Fax.decodeJson(json);
                var options = [];
                Fax.globalLocationJson = jsonData;
                for (var j = 0; j < jsonData.length; j++) {
                    options.push(jsonData[j]["CODE"]);
                }

                GHVHS.DOM.CreateDropDown({ "Element": "statusDrop", "dropDownId": "", "Options": options, "todraw": "input", "NoClear": "Y", "fontSize": "11" });

                input1.setAttribute("placeholder", "Locations");
            }
            GHVHS.DOM.send({ "URL": "/Api/Lookup?path=" + route + "FaxLocations", "Callback": drawDrop, "CallbackParams": getValues[i] });
        } else if (getValues[i].id == "ScheduledDate2") {
            Fax.CurrentEditValues.push({ "Label": "ScheduledDate2", "Value": getValues[i].innerHTML });
            var value = getValues[i].innerHTML;
            getValues[i].innerHTML = "";
            var SearchBoxView2 = GHVHS.DOM.create({ "Type": "div", "Class": "text ", "Id": "hi", "Parent": getValues[i] });
            SearchBoxView2.style.backgroundImage = "url(/img/cal.jpg)";
            SearchBoxView2.style.backgroundSize = "28px";
            SearchBoxView2.style.color = "grey";
            SearchBoxView2.style.width = "90%";
            SearchBoxView2.style.fontSize = "10px";
            SearchBoxView2.style.height = "13px";
            SearchBoxView2.style.margin = "0px";
            SearchBoxView2.style.textAlign = "left";
            SearchBoxView2.style.padding = "0%";
            SearchBoxView2.style.paddingBottom = "5px";
            SearchBoxView2.style.paddingTop = "6px";
            SearchBoxView2.innerHTML = value;
            SearchBoxView2.onclick = function () {
                this.id = "SelectedCal";
                GHVHS.DOM.drawCalander("", "", this);
            };
        }
        
    }

},

DrawConfirmButton: function (Elem, ToDelete) {
    Elem.className = "darkBlueST";
    canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById("canvas") });
    canvas2.onclick = function (e) {
        if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
            Elem.className = "SingleTableElem";
            document.getElementById('canvas').removeChild(this);
        }
       
    }
    loader = GHVHS.DOM.create({ "Type": "div", "Class": "loader", "Id": "loader", "Parent": canvas2 });
    ConfirmRemoveContainer = GHVHS.DOM.create({ "Type": "div", "Parent": loader, "Class": "ConfirmRemoveContainer" });
    ConfirmRemoveContainer.style.width = (canvas.offsetWidth * 0.3) - 20 + "px";
    ConfirmRemoveContainer.style.left = "34%";
    ConfirmRemove = GHVHS.DOM.create({ "Type": "div", "Parent": ConfirmRemoveContainer, "Content": "Are you sure you want to remove this Service ?", "Class": "ConfirmRemove" });
    ConfirmRemove.style.lineHeight = "2em";
    Confirm = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": "Confirm", "Parent": ConfirmRemove, "Content": "Confirm" });
    if (ToDelete == "DocType") {
        Confirm.onclick = function () {
        
            var urlSplit = window.location.href.split("PTFax/");
            var TempRoute = urlSplit[1].split("/");
            var route = TempRoute[0];
            GHVHS.DOM.DrawSmallLoader2();
            function redrawPage() {
                window.location.href = window.location.href;
            }
            GHVHS.DOM.send({ "URL": "/Api/DeleteDocType?route=" + route +"&FaxService=" + Id, "Callback": redrawPage, "CallbackParams": [] });
        }
    }else {
        Confirm.onclick = function () {

            var urlSplit = window.location.href.split("PTFax/");
            var TempRoute = urlSplit[1].split("/");
            var route = TempRoute[0];
            GHVHS.DOM.DrawSmallLoader2();
            function redrawPage() {
                window.location.href = window.location.href;
            }
            GHVHS.DOM.send({ "URL": "/Api/DeleteServices?route=" + route + "&FaxService=" + Id, "Callback": redrawPage, "CallbackParams": [] });
        }
    }
    
    Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Parent": ConfirmRemove, "Content": "Cancel" });
    Cancel.style.marginTop = "5px";
}

};

