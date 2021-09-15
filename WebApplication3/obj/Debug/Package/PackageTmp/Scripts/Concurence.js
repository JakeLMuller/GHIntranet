var Concurence = {
    DrawConcurs: function (Username, FullName, Title, route, Columns,  ViewOnly, Approved) {
        
        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu(Title, Elem, ViewOnly);
        Pnp.FullName = FullName;
        Pnp.GobalColumns = Columns;
        Pnp.DrawTopBar(Username, Elem, Title, ViewOnly);
        var ConcurenceButtomContainer = GHVHS.DOM.create({ "Type": "div", "Id": "ConcurenceButtomContainer", "Class": "ConcurenceButtomContainer", "Parent": Elem });
        var CurrentSiteButtom = GHVHS.DOM.create({ "Type": "a", "Href": "/PnP/Concurrences", "Id": "CurrentSiteButtom", "Class": "Selected", "Parent": ConcurenceButtomContainer });
        var textLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textLabel", "Class": "textLabel", "Content": "View Active", "Parent": CurrentSiteButtom });
        var CurrentSiteButtom3 = GHVHS.DOM.create({ "Type": "a", "Href": "/PnP/Concurrences?view=Approval", "Id": "CurrentSiteButtom", "Class": "CurrentSiteButtom", "Parent": ConcurenceButtomContainer });
        var textLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textLabel", "Class": "textLabel", "Content": "View Approvals", "Parent": CurrentSiteButtom3 });
        var CurrentSiteButtom2 = GHVHS.DOM.create({ "Type": "a", "Href": "/PnP/Concurrences?view=Completed", "Id": "CurrentSiteButtom", "Class": "CurrentSiteButtom", "Parent": ConcurenceButtomContainer });
        var textLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textLabel", "Class": "textLabel", "Content": "View Completed", "Parent": CurrentSiteButtom2 });
        if (Approved) {
            if (Approved == "Approval") {
                CurrentSiteButtom3.className = "Selected";
                CurrentSiteButtom2.className = "CurrentSiteButtom";
                CurrentSiteButtom.className = "CurrentSiteButtom ";
            } else {
                CurrentSiteButtom2.className = "Selected";
                CurrentSiteButtom.className = "CurrentSiteButtom ";
            }
           
        }
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "transition: margin-left .25s,height .25s;text-align:center;margin-left:26%;height:5%;Width:45%;margin-bottom:0px;", "Parent": Elem });
        Filter.setAttribute("placeholder", "Search For Documents....");
        Filter.setAttribute("autocomplete", "Off");
        Filter.style.marginTop = "1%";
        Filter.style.marginBottom = "1%";
        
        Filter.onkeyup = function () {
            var list = window.location.href.split("PnP/");
            Pnp.searchPage(list[1], this, ViewOnly);
        }
        
        Filter.onclick = function () {
            var list = window.location.href.split("PnP/");
            Pnp.searchPage(list[1], this, ViewOnly);
           
        }
        var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Style": "margin-left:1%;Width:98%;transition: margin-top .25s;box-shadow:2px 2px 4px grey; height:80%;", "Id": "FilesWidget", "Parent": Elem });
        var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader","Style":"height:auto;", "Parent": EventWidget });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Id": "EventLable", "Class": "EventLable", "Content": "Concurrences", "Parent": EventHeader });
        Pnp.drawAddButtonAndLabel(EventHeader);
        var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody", "Style": "height:auto;overflow:auto;", "Parent": EventWidget });
        var EventBody2 = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody2", "Style": "overflow:auto;", "Parent": EventWidget });
        SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDocRow", "Id": i + "", "Parent": EventBody });
        for (var i = 0; i < Columns.length; i++) {
            var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDataField", "Id": "status", "Style": "height:10%;", "Parent": SingleTableElem });
            DocStat.style.width = (98 / (Columns.length)) + "%";
            if (document.getElementById("canvas").offsetWidth < 1500){
                DocStat.style.width = (96 / (Columns.length)) + "%";
            }
            DocStat.innerHTML = Columns[i];
            DocStat.style.fontWeight = "bold";
        }
        GHVHS.DOM.DrawSmallLoader2();
        EventHeader.className = "hide";
        if (EventHeader.className != "hide") {
            EventBody2.style.height = (((EventWidget.offsetHeight - EventBody.offsetHeight) - EventHeader.offsetHeight) - 60) + "px";
        } else {
            EventBody2.style.height = ((EventWidget.offsetHeight - EventBody.offsetHeight)) + "px";
        }
       
        var ConcurID = "";
           
        var status = "Active";
        if (Approved) {
            status = "Completed";
        }
        var d = new Date();
        var n = d.getTime();
        var fullNameSplit = FullName.split(", ");
        if (Approved == "Approval") {
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getApprover?Dummy=" + n, "Callback": Concurence.DrawDocuments, "CallbackParams": [EventBody2, Columns, "", Approved] });
        } else {
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getConcurences?username=" + Pnp.UserName+ "&status=" + status + "&Dummy=" + n, "Callback": Concurence.DrawDocuments, "CallbackParams": [EventBody2, Columns, "", ConcurID] });
        }
        
           
    },
    DrawDocuments: function (json, p) {
        var loader = document.getElementById("FaxTableLoader");
        if (loader) {
            loader.parentElement.removeChild(loader);
        }
        var Columns = p[1];
        var route = p[2];
        var concurrID = p[3];
        var ViewOnly = p[4];
        var data = json["Items"];
        if (json["Items"] != "False") {
            if (data.length < 7) {
                var getEvent = document.getElementById("FilesWidget").style.height = "auto";
                var getcolumns = document.getElementById("FilesBody");
                document.getElementById("FilesBody2").style.height = (data.length * 85) + "px";
            }
            Pnp.GlobalDocuments = data;
        }
        if (json["Items"].length > 0) {
            
            for (var i = 0; i < data.length; i++) {
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDataRow", "Id": data[i]["Data"]["Id"] + "", "Parent": p[0] });
                SingleTableElem.style.height = "auto";
                SingleTableElem.style.maxHeight = "65px";
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "DocID", "Content": data[i]["Data"]["DocId"], "Parent": SingleTableElem });
                for (var j = 0; j < Columns.length; j++) {
                    var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDataField", "Id": "status", "Parent": SingleTableElem });
                    DocStat.style.width = (SingleTableElem.offsetWidth * ((98 / (Columns.length)) / 100)) + "px";
                    DocStat.style.minWidth = (SingleTableElem.offsetWidth * ((98 / (Columns.length)) / 100)) + "px";
                    if (document.getElementById("canvas").offsetWidth < 1500) {
                        DocStat.style.width = (SingleTableElem.offsetWidth * ((96 / (Columns.length)) / 100)) + "px";
                        DocStat.style.minWidth = (SingleTableElem.offsetWidth * ((96 / (Columns.length)) / 100)) + "px";
                        DocStat.style.fontSize = "70%";
                    }
                    DocStat.style.minHeight = SingleTableElem.offsetHeight + "px";
                    if (Columns[j] == "Approve") {
                        DocStat.id = Columns[j];
                        DocStat.id = "Approve";
                        var Approve = GHVHS.DOM.create({ "Type": "div", "Class": "buttonCon", "Id": "ApproveBut", "Style": "background-color:#00B200; border:2px solid #026440;", "Content": "Concur", "Parent": DocStat });
                        Approve.onclick = function () {
                            var parent = this.parentElement.parentElement;
                            Concurence.slideUpApprove(parent);

                        }

                    } else if (Columns[j] == "Final Approve") {
                        DocStat.id = Columns[j];
                        DocStat.id = "Approve";
                        if (data[i]["Data"]["Status"] != "Complete") {
                            var Approve = GHVHS.DOM.create({ "Type": "div", "Class": "buttonCon", "Id": "ApproveBut", "Style": "background-color:#00B200; border:2px solid #026440;", "Content": "Approve", "Parent": DocStat });
                            Approve.id = data[i]["Data"]["ApproverID"];
                            Approve.onclick = function () {
                                var parent = this.parentElement.parentElement;
                                Concurence.slideUpFinialApprove(parent, "", this.id);

                            }
                        } else {
                            DocStat.innerHTML = "Already Approved";
                        }
                    } else if (Columns[j] == "View Policy") {
                        DocStat.style.paddingTop = "15px";
                        DocStat.style.paddingBottom = "15px";
                        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data[i]["Data"]["DocId"], "Src": "/img/View.png", "Style": "Height:30px;", "Parent": DocStat });
                        lodingImg.onclick = function () {
                            GHVHS.DOM.drawslideUpIframe("/PnP/Policy/" + this.id );
                        }

                
                     } else if (Columns[j] == "Rejection") {
                        DocStat.id = Columns[j];
                        DocStat.id = "Reject";
                        if (data[i]["Data"]["Status"] != "Rejected") {
                            var Rejection = GHVHS.DOM.create({ "Type": "div", "Class": "buttonCon", "Id": "RejectionBut", "Style": "background-color:#B20000; border:2px solid #8b0000;", "Content": "Reject", "Parent": DocStat });
                            Rejection.id = data[i]["Data"]["ApproverID"];
                            Rejection.onclick = function () {
                                var parent = this.parentElement.parentElement;
                                Concurence.slideUpFinialApprove(parent, "Reject", this.id);

                            }
                        } else {
                            DocStat.innerHTML = "Already Rejected";
                        }
                    } else if (Columns[j] == "View Discussion") {
                        DocStat.style.paddingTop = "15px";
                        DocStat.style.paddingBottom = "15px";
                        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data[i]["Data"]["DocId"], "Src": "/img/messagePic.png", "Style": "Height:30px;", "Parent": DocStat });
                        lodingImg.onclick = function () {
                            GHVHS.DOM.drawslideUpIframe("/PnP/PolicesDiscussion/"+this.id + "c");
                        }
                    } else if (Columns[j] == "View Policy") {
                        DocStat.style.paddingTop = "15px";
                        DocStat.style.paddingBottom = "15px";
                        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data[i]["Data"]["DocId"], "Src": "/img/view.png", "Style": "Height:30px;", "Parent": DocStat });
                        lodingImg.onclick = function () {
                            GHVHS.DOM.drawslideUpIframe("/PnP/Policy/" + this.id );
                        }
                    } else if (Columns[j] == "Assigned To") {
                        DocStat.id = "AssignTo";
                        DocStat.innerHTML = data[i]["Data"]["username"];
                        if (!data[i]["Data"]["username"]) {
                            DocStat.innerHTML = data[i]["Data"]["UserName"];
                        }
                    } else if (Columns[j] == "View Approval Status") {
                        DocStat.style.paddingTop = "15px";
                        DocStat.style.paddingBottom = "15px";
                        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data[i]["Data"]["Title"] + "||" + data[i]["Data"]["DocId"], "Src": "/img/approvalstatus.png", "Style": "Height:30px;", "Parent": DocStat });
                        lodingImg.onclick = function () {
                            var getInfo = this.id.split("||");

                            Concurence.drawSlideUpApprovals("", getInfo[0], getInfo[1]);
                        }
                    } else if (Columns[j] == "Reject") {
                        if (data[i]["Data"]["Status"] != "Rejected") {
                            DocStat.id = Columns[j];
                            DocStat.id = "Reject";
                            var Reject = GHVHS.DOM.create({ "Type": "div", "Class": "buttonCon", "Id": "RejectBut", "Content": "Reject", "Style": "background-color:#B20000; border:2px solid #8b0000;", "Parent": DocStat });
                            Reject.onclick = function () {
                                var parent = this.parentElement.parentElement;
                                Concurence.slideUpReject(parent);
                            }
                        } else {
                            DocStat.id = Columns[j];
                            DocStat.innerHTML = "Currently Rejected";
                        }

                    } else if (Columns[j] == "AllConcurrers") {
                        DocStat.id = Columns[j];
                        DocStat.className = "SingleDataField ActionText"
                        var dataSingle = data[i]["Data"]["AllConcurrers"];
                        if (dataSingle.indexOf(";") >= 0) {
                            for (var q = 0; q < dataSingle.indexOf(";") ; q++) {
                                dataSingle = dataSingle.replace(";", "<br>");
                            }
                            DocStat.innerHTML = dataSingle;

                            DocStat.id = data[i]["Data"]["Title"] + "||" + data[i]["Data"]["DocId"];
                            DocStat.onclick = function (e) {
                                var dataToUse = this.id.split("||");
                                var parent = this.parentElement.parentElement;
                                Concurence.SlideUpConcurrerenceStatus(parent, dataToUse[0], dataToUse[1]);
                            }
                            DocStat.onmouseover = function () {
                                var hoverObj = document.getElementById("hoverOver" + this.parentElement.id);
                                if (!hoverObj) {
                                    this.style.overflow = "auto";
                                    var hoverOver = GHVHS.DOM.create({ "Type": "div", "Class": "hoverOver", "Id": "hoverOver" + this.parentElement.id, "Parent": this });
                                    hoverOver.style.height = this.parentElement.offsetHeight + "px";
                                    hoverOver.style.width = this.offsetWidth + "px";
                                    hoverOver.style.top = this.parentElement.offsetTop + "px";
                                    hoverOver.style.left = this.offsetLeft + "px";
                                    var textElement = GHVHS.DOM.create({ "Type": "div", "Class": "textElement", "Id": "textElement", "Content": "Click to View Status", "Parent": hoverOver });

                                }
                            }
                            SingleTableElem.onmouseout = function (e) {
                                var that = this;
                                var hoverObj = document.getElementById("hoverOver" + this.id);
                                if (hoverObj) {
                                    if (e.target.id != "hoverOver" + this.id && e.target.id != hoverObj.parentElement.id && e.target.id != "textElement") {
                                        hoverObj.style.height = "1px";
                                        setTimeout(function () {
                                            hoverObj.parentElement.removeChild(hoverObj);
                                        }, 200);
                                    }
                                }
                            }
                        }
                    } else {
                        if (data[i]["Data"][Columns[j]]) {
                            if (data[i]["Data"][Columns[j]] != null) {
                                DocStat.innerHTML += data[i]["Data"][Columns[j]];
                            } else {
                                DocStat.innerHTML += " ";
                            }
                        }
                    }
                }
            }
        } else {
            var getEvent = document.getElementById("FilesWidget").style.height = "auto";
            var getcolumns = document.getElementById("FilesBody");
            document.getElementById("FilesBody2").style.height = "250px";
            message = GHVHS.DOM.create({ "Type": "div", "Class": "message", "Id": "message", "Parent": p[0] });
            message.innerHTML = "0 results found. <br> Click refresh icon to refresh page."
            refesh = GHVHS.DOM.create({ "Type": "img", "Class": "refreshIcon", "Id": "refreshIcon", "Src": "/img/refresh.png", "Parent": p[0] });
            refesh.onclick = function () {
                window.location.href = window.location.href;
            }
        }
    },
    drawSlideUpApprovals: function (parent, Title, id) {
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        Title = Title.replace("Please Approve", "");
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": Title + "'s Approval Status", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            XCancel.parentElement.parentElement.parentElement.parentElement.removeChild(XCancel.parentElement.parentElement.parentElement);
        }

        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        GHVHS.DOM.DrawSmallLoader2(FrameBody);
        function drawApproverStatus(json, p) {
            GHVHS.DOM.RemoveSmallLoader2(p);
            var StatusApprovedTable = GHVHS.DOM.create({ "Type": "div", "Class": "StatusApprovedTable", "Style": "Width:90%;margin-left:5%;", "Id": "StatusApprovedTable", "Parent": p });
            var data = json["Items"];
            colums = ["Username", "PercentComplete", "Status"]
            SingleTableElem1 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Style": "height:4.5%;", "Id": "Cloumns", "Parent": StatusApprovedTable });
            for (var k = 0; k < colums.length; k++) {
                Status = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Style": "width:20%;", "Content": colums[k], "Parent": SingleTableElem1 });
                if (colums[k] == "PercentComplete") {
                    Status.style.width = "38%";
                } else if (colums[k] == "Status") {
                    Status.style.width = "40%";
                }
            }
            for (var k = 0; k < data.length; k++) {
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": data[k]["Data"]["Id"] + "", "Parent": StatusApprovedTable });
                SingleTableElem.style.height = "25%";
                ApName = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:20%;margin-right:0%;", "Content": data[k]["Data"]["UserName"], "Parent": SingleTableElem });
                Comments = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:39%;margin-right:0%;font-size:100%;", "Parent": SingleTableElem });
               
                Comments.innerHTML = data[k]["Data"]["PercentComplete"];
               
                Status = GHVHS.DOM.create({ "Type": "div", "Class": "NotStartedStatus", "Style": "width:40%;", "Content": data[k]["Data"]["Status"], "Parent": SingleTableElem });
                if (data[k]["Data"]["Status"] == "Not Started") {
                    Status.className = "NotStartedStatus";
                } else if (data[k]["Data"]["Status"] == "Complete") {
                    Status.className = "CompletedStatus";
                } else if (data[k]["Data"]["Status"] == "Rejected") {
                    Status.className = "CompletedStatus";
                    Status.style.backgroundColor = "#B20000";
                }

            }
        }
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getApprover?DocId=" + id + "&Dummy=" + n, "Callback": drawApproverStatus, "CallbackParams": FrameBody });
    },
    SlideUpConcurrerenceStatus:function(parent, Title, id){
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": Title+ "'s Concurrerence Status", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            XCancel.parentElement.parentElement.parentElement.parentElement.removeChild(XCancel.parentElement.parentElement.parentElement);
        }
       
        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        GHVHS.DOM.DrawSmallLoader2(FrameBody);
        function drawApproverStatus(json, p) {
            GHVHS.DOM.RemoveSmallLoader2(p);
            var StatusApprovedTable = GHVHS.DOM.create({ "Type": "div", "Class": "StatusApprovedTable","Style":"Width:90%;margin-left:5%;", "Id": "StatusApprovedTable", "Parent": p });
            var data = json["Items"];
            colums = ["Username",  "Comments", "Status"]
            SingleTableElem1 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem","Style":"height:4.5%;", "Id":"Cloumns", "Parent": StatusApprovedTable });
            for (var k = 0; k < colums.length; k++) {
                Status = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Style": "width:20%;", "Content": colums[k], "Parent": SingleTableElem1 });
                if (colums[k] == "Comments") {
                    Status.style.width = "38%";
                } else if (colums[k] == "Status") {
                    Status.style.width = "40%";
                }
            }
            for (var k = 0; k < data.length; k++) {
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": data[k]["Data"]["Id"] + "", "Parent": StatusApprovedTable });
                SingleTableElem.style.height = "25%";
                ApName = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:20%;margin-right:0%;", "Content": data[k]["Data"]["username"], "Parent": SingleTableElem });
                Comments = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:39%;margin-right:0%;font-size:100%;", "Parent": SingleTableElem });
                if (data[k]["Data"]["ApproveComments"]) {
                    Comments.innerHTML = data[k]["Data"]["ApproveComments"];
                }
                else if (data[k]["Data"]["RejectionReason"]) {
                    Comments.innerHTML = data[k]["Data"]["RejectionReason"];
                }
                Status = GHVHS.DOM.create({ "Type": "div", "Class": "NotStartedStatus", "Style": "width:40%;", "Content": data[k]["Data"]["Status"], "Parent": SingleTableElem });
                if (data[k]["Data"]["Status"] == "Not Started") {
                    Status.className = "NotStartedStatus";
                } else if (data[k]["Data"]["Status"] == "Completed") {
                    Status.className = "CompletedStatus";
                } else if (data[k]["Data"]["Status"] == "Rejected") {
                    Status.className = "CompletedStatus";
                    Status.style.backgroundColor = "#B20000";
                }
                
            }
        }
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getConcurences?DocId=" + id+"&Dummy=" + n, "Callback": drawApproverStatus, "CallbackParams": FrameBody });
        //var temp = GHVHS.DOM.send({ "URL": "/PnP/ConcurenceLookUp?list=Workflow%20Tasks&filter=" + FilterData, "Callback": drawApproverStatus, "CallbackParams": FrameBody });
    },
    slideUpReject: function (parent) {
        Concurence.slideUpApprove(parent, "Y");
    },
    currentApprovalScreen:"",
    slideUpFinialApprove: function (parent, Reject, ApproverID) {
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Final Approval Of Policy", "Parent": FrameHeader });
        if (Reject) {
            EventLable.innerHTML = "Reject Document";
        }
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            XCancel.parentElement.parentElement.parentElement.parentElement.removeChild(XCancel.parentElement.parentElement.parentElement);
        }
        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        var rightFrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "rightFrameBody", "Id": "rightFrameBody","Style":"width: 80%;margin-left:10%;", "Parent": FrameBody });
        framed.style.height = "98%";
        framed.style.width = "80%";
        framed.style.left = "10%";
        FrameBody.style.height = "85%";
        FrameBody.style.marginTop = "-1%";
        FrameBody.style.overflowY = "auto";
        framed.style.top = "1%";
        ViewFile = GHVHS.DOM.create({ "Type": "iframe", "Class": "ViewFile", "Id": "ViewFile", "Style": "border: none;border-radius: 5px;box-shadow: 2px 2px 6px grey;", "Parent": rightFrameBody });

        var loding = GHVHS.DOM.create({ "Type": "div", "Class": "loding", "Id": "loding", "Style": "background-color:rgba(0, 0, 0, 0.85);", "Parent": rightFrameBody });
        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "lodingImg", "Id": "lodingImg", "Src": "/img/loadingDoc.gif", "Style": "width:25%; margin-left:37.5%;background-color:rgba(0, 0, 0, 0);;", "Parent": loding });
        loding.style.height = ViewFile.offsetHeight + 10 + "px";
        loding.style.width = ViewFile.offsetWidth + "px";
        loding.style.marginLeft = ((ViewFile.offsetLeft - loding.offsetLeft)) + "px";
        function displayPDF(json, p) {
            Concurence.currentApprovalScreen = json["Items"][0]["Data"]["DocId"];
            p.src = "/Pnp/Policy/"+json["Items"][0]["Data"]["DocId"];
            document.getElementById("loding").parentElement.removeChild(document.getElementById("loding"));
        }
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getApprover?ApproverID=" + ApproverID + "&Dummy=" + n, "Callback": displayPDF, "CallbackParams": ViewFile });
        var frameFooter = GHVHS.DOM.create({ "Type": "div", "Class": "frameFooter", "Id": "frameFooter", "Parent": framed });

        if (!Reject) {
            var ApproveButton = GHVHS.DOM.create({ "Type": "div", "Class": "apButton ApproveButton", "Id": ApproverID , "Content": "Approve", "Parent": frameFooter });
            ApproveButton.onclick = function () {
                Concurence.FinalApprove(this.id, "Approve");
            }
        } else {
            var RejectButton = GHVHS.DOM.create({ "Type": "div", "Class": "apButton RejectButton", "Id": ApproverID, "Content": "Reject", "Parent": frameFooter });
            RejectButton.onclick = function () {
                Concurence.FinalApprove(this.id, "Rejected");
            }
        }
        var CancelButton = GHVHS.DOM.create({ "Type": "div", "Class": "apButton CancelButton", "Id": "CancelButton", "Content": "Cancel", "Parent": frameFooter });
        CancelButton.onclick = function () {
            document.getElementById("XCancel").click();
        }
    
    },
    FinalApprove:function(id, status){
        GHVHS.DOM.DrawSmallLoader2();
        function redrawPage() {
            window.location.href = window.location.href;
        }
        var d = new Date();
        var n = d.getTime();
        if (status == "Approve") {
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/UpdateApproval?ApproverID=" + id + "&status=" + status + "&Dummy=" + n, "Callback": Concurence.showSuccesAndToApprovePage, "CallbackParams": id });
        } else {
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/UpdateApproval?ApproverID=" + id + "&status=" + status + "&Dummy=" + n, "Callback": redrawPage, "CallbackParams": [] });
        }
    },
    showSuccesAndToApprovePage: function (json,p) {
        if (json["results"] != "true") {
            document.getElementById("canvas").removeChild(document.getElementById("canvas2"));
            document.getElementById("canvas").removeChild(document.getElementById("FaxTableLoader"));
            Concurence.drawSlideUpApprovals("", "Success, your Approval has been a approved", Concurence.currentApprovalScreen);

        } else {
            document.getElementById("canvas").removeChild(document.getElementById("canvas2"));
            document.getElementById("canvas").removeChild(document.getElementById("FaxTableLoader"));
            canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
            var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });

            var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
            var SuccessImg = GHVHS.DOM.create({ "Type": "img", "Class": "SuccessImg", "Id": "SuccessImg", "Src": "/img/ApprovedFinal.jpg", "Parent": FrameBody });
            var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
            var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:center;width:100%;padding-top: 1%;Font-size:150%;", "Id": "EventLable", "Content": "Document Approved And Added To Approved Policies. Redirecting to Approved Policies.", "Parent": FrameHeader });
            var loadingImage = GHVHS.DOM.create({ "Type": "img", "Src": "/img/searchLoader.gif", "Style": "height:15%;width:9%;float:left;margin-left:45.5%;", "Parent": framed });
            setTimeout(function () {
                window.location.href = "/Pnp/ApprovedPolicies";
            }, 2500);
        }
    },
    slideUpApprove:function(parent, Reject){
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Approve Document", "Parent": FrameHeader });
        if (Reject) {
            EventLable.innerHTML = "Reject Document";
        }
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            XCancel.parentElement.parentElement.parentElement.parentElement.removeChild(XCancel.parentElement.parentElement.parentElement);
        }
        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        var leftFrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "leftFrameBody", "Id": "leftFrameBody", "Parent": FrameBody });
        var rightFrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "rightFrameBody", "Id": "rightFrameBody", "Parent": FrameBody });
        framed.style.height = "98%";
        framed.style.width = "80%";
        framed.style.left = "10%";
        FrameBody.style.height = "85%";
        FrameBody.style.marginTop = "-1%";
        FrameBody.style.overflowY = "auto";
        framed.style.top = "1%";
        ViewFile = GHVHS.DOM.create({ "Type": "iframe", "Class": "ViewFile", "Id": "ViewFile","Style":"border: none;border-radius: 5px;box-shadow: 2px 2px 6px grey;", "Parent": rightFrameBody });

        var loding = GHVHS.DOM.create({ "Type": "div", "Class": "loding", "Id": "loding", "Style": "background-color:rgba(0, 0, 0, 0.85);", "Parent": rightFrameBody });
        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "lodingImg", "Id": "lodingImg", "Src": "/img/loadingDoc.gif", "Style": "width:25%; margin-left:37.5%;background-color:rgba(0, 0, 0, 0);;", "Parent": loding });
        loding.style.height = ViewFile.offsetHeight+10 + "px";
        loding.style.width = ViewFile.offsetWidth + "px";
        loding.style.marginLeft = ((ViewFile.offsetLeft - loding.offsetLeft)) + "px";
        function drawSlideUp(json, p) {

            var columns = ["Title", "Status", "Assigned To", "StartDate", "DueDate", "AllConcurrers"];
            if (Reject) {
                columns.push("RejectionReason");
            } else {
                columns.push("ApproveComments");
            }
            var getSingleConcurrence = json["Items"][0]["Data"];

            function setIframeContent(json, p) {
                Pnp.GlobalDraftPolicies = json;
                var ViewFile = document.getElementById("ViewFile");
                if (json["Items"].length == 1) {
                    ViewFile.src = json["Items"][0]["Fields"]["PDFFilePath"];

                }
                var temp = document.getElementById("loding");
                var rightFrameBody = document.getElementById("rightFrameBody");
                rightFrameBody.removeChild(temp);
            }
            var d = new Date();
            var n = d.getTime();
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicies?Id=" + getSingleConcurrence["DocId"] + "&Dummy=" + n, "Callback": setIframeContent, "CallbackParams": FrameBody });
            for (var m = 0; m < columns.length; m++) {
                NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:4.5%;", "Id": "NameAndInput", "Parent": leftFrameBody });
                NameAndInput.id = columns[m];
                InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:5%;", "Parent": NameAndInput });
                InputLabel.innerHTML = columns[m];
                if (columns[m] == "RejectionReason" || columns[m] == "ApproveComments") {
                    NameAndInput.style.height = "18%";
                    Filter = GHVHS.DOM.create({ "Type": "textarea", "Class": "Filter", "Id": columns[m], "Style": "background-image:none ; background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                    if (getSingleConcurrence[columns[m]]) {
                        Filter.value = getSingleConcurrence[columns[m]];
                    }
                    Filter.setAttribute("placeholder", "Enter Comments...");
                    Filter.style.boxShadow = "grey 2px 2px 3px";
                    Filter.style.width = "53%";
                    var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.8%;margin-left: -3%;position: relative;", "Parent": NameAndInput });
                    var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:70%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
                    addimg.alt = "Clear";
                    addimg.onclick = function () {
                        var filter = this.parentElement.parentElement.querySelectorAll(".Filter");
                        filter[0].value = "";
                    }
                } else if (columns[m] == "AllConcurrers") {
                    NameAndInput.style.height = "8%";
                    Filter = GHVHS.DOM.create({ "Type": "textarea", "Class": "Filter", "Id": columns[m], "Style": "background-image: url(/img/ViewOnly.png); background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                    if (getSingleConcurrence[columns[m]]) {
                        Filter.value = getSingleConcurrence[columns[m]];
                    }
                    Filter.style.boxShadow = "grey 2px 2px 3px";
                    Filter.style.width = "53%";
                    Filter.style.paddingTop = "0.5%";
                    Filter.style.paddingLeft = "0.5%";
                    Filter.setAttribute("readonly", "true");
                } else {
                    if (columns[m] == "Title") {
                        var Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter ap", "Id": columns[m], "Style": "background-image: url(/img/ViewOnly.png); background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                        Filter.setAttribute("readonly", "true");
                        Filter.style.width = "53%";
                        Filter.value = getSingleConcurrence[columns[m]];
                    } else if (columns[m] == "Status") {
                        var Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter ap", "Id": columns[m], "Style": "background-image: url(/img/ViewOnly.png); background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                        Filter.setAttribute("readonly", "true");
                        Filter.style.width = "53%";
                        Filter.value = getSingleConcurrence[columns[m]];
                    } else if (columns[m] == "Assigned To") {
                        var Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter ap", "Id": columns[m], "Style": "background-image: url(/img/ViewOnly.png); background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                        Filter.setAttribute("readonly", "true");
                        Filter.style.width = "53%";
                        Filter.value = Pnp.FullName;
                        Filter.value = getSingleConcurrence["username"];
                        Filter.setAttribute("readonly", "true");
                        Filter.style.backgroundImage = "url(/img/ViewOnly.png)";
                    } else if (columns[m].indexOf("Date") >= 0) {
                        var Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter ap", "Id": columns[m], "Style": "background-image: url(/img/ViewOnly.png); background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                        Filter.style.width = "53%";
                        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.8%;margin-left: -3%;position: relative;", "Parent": NameAndInput });
                        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:70%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
                        addimg.alt = "Clear";
                        addimg.onclick = function () {
                            var filter = this.parentElement.parentElement.querySelectorAll(".Filter");
                            filter[0].value = "";
                        }
                        if (getSingleConcurrence[columns[m]]) {
                            Filter.value = getSingleConcurrence[columns[m]];
                        }
                        Filter.setAttribute("placeholder", "Click To Select Date...");
                        Filter.setAttribute("autocomplete", "Off");
                        Filter.style.backgroundImage = "url(/img/cal.jpg)";
                        Filter.style.cursor = "pointer";
                        Filter.onclick = function () {
                            this.id = "SelectedCal";
                            GHVHS.DOM.drawCalander("", "", this);
                            setTimeout(function () {
                                document.getElementById("main").style.zIndex = "900000000000000000000";
                            }, 10);
                        };
                    } else {
                        var Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter ap", "Id": columns[m], "Style": "background-image: url(/img/edit.png); background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                        Filter.style.width = "53%";
                        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.8%;margin-left: -3%;position: relative;", "Parent": NameAndInput });
                        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:70%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
                        addimg.alt = "Clear";
                        addimg.onclick = function () {
                            var filter = this.parentElement.parentElement.querySelectorAll(".Filter");
                            filter[0].value = "";
                        }
                        if (getSingleConcurrence[columns[m]]) {
                            Filter.value = getSingleConcurrence[columns[m]];
                        }
                    }
                    Filter.style.boxShadow = "grey 2px 2px 3px";
                    Filter.style.paddingLeft = "0.5%";
                }
            }
            var frameFooter = GHVHS.DOM.create({ "Type": "div", "Class": "frameFooter", "Id": "frameFooter", "Parent": framed });

            if (!Reject) {
                var ApproveButton = GHVHS.DOM.create({ "Type": "div", "Class": "apButton ApproveButton", "Id": "ApproveButton", "Content": "Concur", "Parent": frameFooter });
                ApproveButton.onclick = function () {
                    Concurence.EditWorkFlow(getSingleConcurrence, framed, "Approve", columns);
                }
            } else {
                var RejectButton = GHVHS.DOM.create({ "Type": "div", "Class": "apButton RejectButton", "Id": "RejectButton", "Content": "Reject", "Parent": frameFooter });
                RejectButton.onclick = function () {
                    Concurence.EditWorkFlow(getSingleConcurrence, framed, "Reject", columns);
                }
            }
            var SaveButton = GHVHS.DOM.create({ "Type": "div", "Class": "apButton SaveButton", "Id": "SaveButton", "Content": "Save", "Parent": frameFooter });
            SaveButton.onclick = function () {
                Concurence.EditWorkFlow(getSingleConcurrence, framed, "Save", columns);
            }
            var CancelButton = GHVHS.DOM.create({ "Type": "div", "Class": "apButton CancelButton", "Id": "CancelButton", "Content": "Cancel", "Parent": frameFooter });
            CancelButton.onclick = function () {
                document.getElementById("XCancel").click();
            }
        }
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getConcurences?Id=" + parent.id + "&Dummy=" + n, "Callback": drawSlideUp, "CallbackParams": FrameBody });
    },
    EditWorkFlow: function (data, Element, Variation, dataColumns, approvers) {
        GHVHS.DOM.DrawSmallLoader2();
        var thisId = data["ID"]; 
        var getAllEditData = Element.querySelectorAll(".NameAndInput");
        var params = "";
        params += "?Id=" + data["Id"];
        for (var i = 0; i < getAllEditData.length; i++) {
            var subParam = "";
            var filter = getAllEditData[i].querySelectorAll(".Filter");
            var theValue = filter[0].value;
            if (!theValue){
                theValue = filter[0].innerHTML;
            }
            else if (dataColumns[i] == "Status") {
                if (Variation == "Approve") {
                    subParam = "&" + dataColumns[i] + "=Completed";
                } else if (Variation == "Reject") {
                    subParam = "&" + dataColumns[i] + "=Rejected";
                } else {
                    subParam = "&" + dataColumns[i] + "=Started";
                }
            } else if (dataColumns[i] == "Assigned To") {
                subParam = "&username=" + theValue;
            }else {
                subParam = "&" + dataColumns[i] + "=" + theValue;
            }
            
            params += subParam;
        }
        function UpdatedWorkFlow() {
            window.location.href = window.location.href;
        }
        
        if (Variation == "Approve") {
            function toUpdate(json, p) {
                var params = p[0];
                var data = p[1];
                var toApprovePolicies = "";
                var jsonData = json["Items"];
                for (var q = 0; q < jsonData.length; q++) {
                    if (jsonData.length > 1) {
                        if (jsonData[q]["Id"] != data["Id"]) {
                            if (jsonData[q]["Status"] != "Completed") {
                                toApprovePolicies = "Y";
                            }
                        }
                    } 
                }
                if (toApprovePolicies != "Y") {
                    var id = data["DocId"];
                    var paramsCopied = "?DocId=" + data["DocId"];
                   
                    function checkAndCompleteWorkFlow(json, p) {
                        GHVHS.DOM.send({ "URL": "/Pnp/UpdateConcurences" + p, "CallbackParams": [], "Callback": UpdatedWorkFlow, });
                    }
                    GHVHS.DOM.send({ "URL": "/Pnp/AddApprover"+ paramsCopied, "CallbackParams": params, "Callback": checkAndCompleteWorkFlow, });
                        
                    
                } else {
                    GHVHS.DOM.send({ "URL": "/Pnp/UpdateConcurences" + params, "CallbackParams": [], "Callback": UpdatedWorkFlow, });
                }
            }
            var d = new Date();
            var n = d.getTime();
            var temp1 = GHVHS.DOM.send({ "URL": "/Pnp/UpdateConcurences" + params, "CallbackParams": [], "Callback": UpdatedWorkFlow, });
            //var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getConcurences?DocId=" + data["DocId"]+"&Dummy="+n, "Callback": toUpdate, "CallbackParams": [params, data] });
             
        }else {
            GHVHS.DOM.send({ "URL": "/Pnp/UpdateConcurences" + params, "CallbackParams": [], "Callback": UpdatedWorkFlow, });
        }
    },
};