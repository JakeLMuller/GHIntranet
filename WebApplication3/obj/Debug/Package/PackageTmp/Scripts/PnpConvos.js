var PnpConvos = {
    AllConvos: function (Username, FullName, AllFiles, Id, SubId, orderBy,Search) {
        var route = "PolicesDiscussion";
        var Title = "Policies Discussion";
        var ParentElement = document.getElementById("MainContent");
        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": ParentElement });
        Pnp.drawSideMenu(Title, Elem, AllFiles);
        Pnp.FullName = FullName;
        Pnp.DrawTopBar(Username, Elem, Title);
        ContentContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ContentContainer", "Id": "ContentContainer", "Parent": Elem });
        CCHeader = GHVHS.DOM.create({ "Type": "div", "Class": "CCHeader", "Id": "CCHeader", "Parent": ContentContainer });
        CCFiller = GHVHS.DOM.create({ "Type": "div", "Class": "CCFiller", "Id": "CCFiller", "Content": "My Discussions", "Parent": CCHeader });
        CCImageContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CCImageContainer", "Id": "CCImageContainer", "Parent": CCHeader });
        menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/dots.png", "Class": "menuImage", "Id": "menuImage", "Parent": CCImageContainer });
        PnpConvos.drawConvoDropdowns(menu, CCImageContainer, [ { "Label": "Order by Date ^" }, { "Label": "Order by Date" }, { "Label": "Order Messages A-Z" }, { "Label": "Order Messages Z-A" }, { "Label": "Order Default" }], "100px", "200px");
        refresh = GHVHS.DOM.create({ "Type": "img", "Src": "/img/refresh.png", "Class": "menuImage", "Id": "menuImage", "Parent": CCImageContainer });
        refresh.onclick = function () {
            window.location.href = window.location.href;
        }
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "transition: margin-left .25s,height .25s;text-align:center;margin-left:8%;height:30%;Width:80%;margin-bottom:0px;margin-top:1%;", "Parent": CCHeader });
        Filter.setAttribute("placeholder", "Search Discussions....");
        Filter.onkeyup = function () {
            var list = window.location.href.split("PnP/");
            PnpConvos.searchPage(list[1], this);
        }
        CCBody = GHVHS.DOM.create({ "Type": "div", "Class": "CCBody", "Id": "CCBody", "Parent": ContentContainer });
        CCBody.onscroll = function () {
            var getAllDropParents = this.querySelectorAll(".ImgContainer");
            for (var i = 0; i < getAllDropParents.length; i++) {
                var getDrop = getAllDropParents[i].querySelectorAll(".DropDown ");
                if (getDrop[0]) {
                    if (getDrop[0].style.display != "none") {
                        getDrop[0].style.display = "none";
                        getDrop[0].style.height = "1px";
                    }
                }

            }
        }
        var order = "Date%20Desc";
        if (orderBy) {
            order = orderBy;
        }
        if (Search) {
            Filter.value = Search;
            order += "&Body=" + Search;
            order += "&PeopleInConvo=" + Search;
            order += "&Title=" + Search;
        }
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicesDiscussions?Dummy=" + n + "&orderBy=" + order + "&PeopleInConvo=" + Username, "Callback": PnpConvos.DrawAllConvos, "CallbackParams": [CCBody] });
    },
    DrawAllConvos: function (json,p) {
        var parentElement = p[0];
        var data = JSON.parse(json["Items"]);
        for (var i = 0; i < data.length; i++){
            var SingleConvo = GHVHS.DOM.create({ "Type": "div", "Class": "SingleConvo", "Id": data[i]["ConvoId"], "Parent": parentElement });
            SingleConvo.onclick = function (e) {
                if (e.target.id != "ImgContainer" && e.target.id != "ViewIcon" && e.target.id != "DropOption" && e.target.id != "") {
                    window.location.href = "/PnP/PolicesDiscussion/" + this.id;
                }
            }
            var ImgContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ImgContainer", "Id": "ImgContainer", "Parent": SingleConvo });
            var ViewIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/textIcon.png", "Class": "ViewIcon", "Id": "ViewIcon", "Parent": ImgContainer });
            PnpConvos.drawConvoDropdowns(ViewIcon, ImgContainer, [ { "Label": "Delete Convo" } ], "80px", "200px");
            var infoContainer = GHVHS.DOM.create({ "Type": "div", "Class": "infoContainer", "Id": "infoContainer", "Parent": SingleConvo });
            var infoTitle = GHVHS.DOM.create({ "Type": "div", "Class": "infoTitle", "Id": "infoTitle", "Content": data[i]["Title"], "Parent": infoContainer });
            var infoBody = GHVHS.DOM.create({ "Type": "div", "Class": "infoBody", "Id": "infoBody", "Content": data[i]["Body"], "Parent": infoContainer });
            var dateContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dateContainer", "Id": "dateContainer", "Parent": SingleConvo });
            var getDate = GHVHS.DOM.formateSQLDate(data[i]["Date"]);
            var dateInfo = GHVHS.DOM.create({ "Type": "div", "Class": "dateInfo", "Id": "dateInfo", "Content": getDate, "Parent": dateContainer });
            var ImgContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "ImgContainer","Style":"width:14%;", "Parent": SingleConvo });
            var Carrot = GHVHS.DOM.create({ "Type": "img", "Src": "/img/greyCarrot.png", "Class": "Carrot", "Id": "Carrot", "Parent": ImgContainer2 });
            var BottomInfo = GHVHS.DOM.create({ "Type": "div", "Class": "BottomInfo", "Parent": SingleConvo });
            BottomInfo.innerHTML = "People In Discussion: " + data[i]["PeopleInConvo"];
        }
    },
    SingleConvo: function (Username, FullName, AllFiles, Id, SubId,orderBy, Search) {
        function SingleConvoGotten(json, p) {
            var Elem = document.getElementById("Elem");
            var route = "PolicesDiscussion";
            var Title = "Policies Discussion";
            var data = json["Items"];
            Pnp.drawSideMenu(Title, Elem, AllFiles);
            Pnp.FullName = FullName;
            Pnp.DrawTopBar(Username, Elem, Title);
            
            BackButton = GHVHS.DOM.create({ "Type": "div", "Class": "PnpBackButton", "Id": "BackButton", "Parent": Elem });
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/backArrowTrans.png", "Style": "Height:20px;", "Parent": BackButton });
            BackButton.innerHTML += "Back My Discussions";
            BackButton.onclick = function () {
                window.location.href = "/PnP/PolicesDiscussion";
            }
            
            ContentContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ContentContainer", "Id": "ContentContainer", "Parent": Elem });
            CCHeader = GHVHS.DOM.create({ "Type": "div", "Class": "CCHeader", "Id": "CCHeader", "Parent": ContentContainer });
            CCFiller = GHVHS.DOM.create({ "Type": "div", "Class": "CCFiller", "Id": "CCFiller", "Parent": CCHeader });
            CCFiller.innerHTML= data[2];
            PnpConvos.ConvoId = data[1];
            CCImageContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CCImageContainer", "Id": "CCImageContainer", "Parent": CCHeader });
            menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/dots.png", "Class": "menuImage", "Id": "menuImage", "Parent": CCImageContainer });
            PnpConvos.drawConvoDropdowns(menu, CCImageContainer, [{ "Label": "Order by Date ^" }, { "Label": "Order by Date" }, { "Label": "Order Messages A-Z" }, { "Label": "Order Messages Z-A" }, { "Label": "Order Default" }, { "Label": "View Document" }], "150px", "200px");
            if (document.getElementById("canvas").offsetWidth <= 1500) {
                PnpConvos.drawConvoDropdowns(menu, CCImageContainer, [{ "Label": "Order by Date ^" }, { "Label": "Order by Date" }, { "Label": "Order Messages A-Z" }, { "Label": "Order Messages Z-A" }, { "Label": "Order Default" }], "150px", "200px");

            }
            refresh = GHVHS.DOM.create({ "Type": "img", "Src": "/img/refresh.png", "Class": "menuImage", "Id": "menuImage", "Parent": CCImageContainer });
            refresh.onclick = function () {
                window.location.href = window.location.href;
            }
            Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "transition: margin-left .25s,height .25s;text-align:center;margin-left:8%;height:30%;Width:80%;margin-bottom:0px;margin-top:1%;", "Parent": CCHeader });
            Filter.setAttribute("placeholder", "Search Discussions....");
            Filter.onkeyup = function () {
                var list = window.location.href.split("PnP/");
                PnpConvos.searchPage(list[1], this);
            }
            CCBody = GHVHS.DOM.create({ "Type": "div", "Class": "CCBody", "Id": "CCBody", "Style": "height:65%;", "Parent": ContentContainer });
            CCBody.onscroll = function () {
                var getAllDropParents = this.querySelectorAll(".DropDown");
                for (var i = 0; i < getAllDropParents.length; i++) {
                    if (getAllDropParents[i]) {
                        if (getAllDropParents[i].style.display != "none") {
                            getAllDropParents[i].style.display = "none";
                            getAllDropParents[i].style.height = "1px";
                        }
                    }

                }
            }
            var order = "Date%20Desc";
            if (orderBy) {
                order = orderBy;
            }
            if (Search) {
                Filter.value = Search;
                order += "&Body=" + Search;
            }
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicesMessages?ConvoId=" + Id + "&orderBy="+order+"&Dummy=" + n, "Callback": PnpConvos.DrawMessages, "CallbackParams": [CCBody, Username, data] });
        }
        var ParentElement = document.getElementById("MainContent");
        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": ParentElement });
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicesDiscussions?ConvoId=" + Id + "&Dummy=" + n, "Callback": SingleConvoGotten, "CallbackParams": [Username, FullName, AllFiles, Id, SubId, orderBy, Search] });
    },
    CurrentMsgId:0,
    DrawMessages: function (json, p) {
        var parentElement = p[0];
        var userName = p[1];
        var convoData = p[2];
        if (json["Items"].length > 0){
            var data = JSON.parse(json["Items"]);
            for (var i = 0; i < data.length; i++) {
                if (data[i]["SingleUser"] != userName) {
                    var singleMessageLeft = GHVHS.DOM.create({ "Type": "div", "Class": "singleMessageLeft", "Id": data[i]["ConvoId"] + "||" + data[i]["MessageId"], "Parent": parentElement });
                    var messageIconContainer = GHVHS.DOM.create({ "Type": "div", "Class": "messageIconContainer", "Parent": singleMessageLeft });
                    var MessageIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/textIcon.png", "Class": "MessageIcon", "Id": "MessageIcon", "Parent": messageIconContainer });
                    //PnpConvos.drawConvoDropdowns(MessageIcon, MessageIcon.parentElement.parentElement, [{ "Label": "Edit", "function": [] }, { "Label": "Delete", "function": PnpConvos.DrawConfirmButton }]);
                    var personLabel = GHVHS.DOM.create({ "Type": "div", "Class": "personLabel", "Id": "personLabel", "Content": data[i]["SingleUser"], "Parent": messageIconContainer });
                    var messageContainerLeft = GHVHS.DOM.create({ "Type": "div", "Class": "messageContainerLeft", "Id": "messageContainerLeft", "Content": data[i]["Body"], "Parent": singleMessageLeft });
                    if (data[i]["Body"].length > 150) {
                        messageContainerLeft.style.height = "auto";
                        messageContainerLeft.style.borderRadius = "10px";
                        if (document.getElementById("canvas").offsetWidth < 1500){
                            singleMessageLeft.style.marginBottom = "15%";
                        } else {
                            singleMessageLeft.style.marginBottom = "4%";
                        }

                    }
                    var getDate = GHVHS.DOM.formateSQLDate(data[i]["Date"]);
                    var dateContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dateContainer2", "Id": "dateContainer",  "Content": getDate, "Parent": messageContainerLeft });
                    var FillerMessage = GHVHS.DOM.create({ "Type": "div", "Class": "FillerMessage", "Id": "FillerMessage", "Parent": singleMessageLeft });
               
                } else {
               
                    var singleMessageRight = GHVHS.DOM.create({ "Type": "div", "Class": "singleMessageLeft", "Id": data[i]["ConvoId"] + "||" + data[i]["MessageId"], "Parent": parentElement });
                    var FillerMessage = GHVHS.DOM.create({ "Type": "div", "Class": "FillerMessage", "Id": "FillerMessage", "Parent": singleMessageRight });
                    var messageContainerRight = GHVHS.DOM.create({ "Type": "div", "Class": "messageContainerRight", "Id": "messageContainerRight", "Content": data[i]["Body"], "Parent": singleMessageRight });
                    if (data[i]["Body"].length > 150) {
                        messageContainerRight.style.height = "auto";
                        messageContainerRight.style.borderRadius = "10px";
                        if (document.getElementById("canvas").offsetWidth < 1500) {
                            singleMessageRight.style.marginBottom = "15%";
                        } else {
                            singleMessageRight.style.marginBottom = "4%";
                        }
                    }
                    var getDate = GHVHS.DOM.formateSQLDate(data[i]["Date"]);
                    var dateContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dateContainer2", "Id": "dateContainer", "Content": getDate,  "Parent": messageContainerRight });
                    var messageIconContainer = GHVHS.DOM.create({ "Type": "div", "Class": "messageIconContainer", "Parent": singleMessageRight });
                    var MessageIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/textIcon.png", "Class": "MessageIconUser", "Id": "MessageIcon", "Parent": messageIconContainer });
                    PnpConvos.drawConvoDropdowns(MessageIcon, MessageIcon.parentElement.parentElement, [{ "Label": "Edit", "function": [] }, { "Label": "Delete", "function": PnpConvos.DrawConfirmButton }]);
                    var personLabel = GHVHS.DOM.create({ "Type": "div", "Class": "personLabel", "Id": "personLabel", "Content": data[i]["SingleUser"], "Parent": messageIconContainer });
               
                }
                if (data[i]["MessageId"]){
                    var tempNumber = Number(data[i]["MessageId"]);
                    if (tempNumber > PnpConvos.CurrentMsgId) {
                        PnpConvos.CurrentMsgId = tempNumber;
                    }
                }
           
            }
        }
        CCFooter = GHVHS.DOM.create({ "Type": "div", "Class": "CCFooter", "Id": "CCFooter", "Parent": parentElement.parentElement });
        var messageIconContainer = GHVHS.DOM.create({ "Type": "div", "Class": "messageIconContainer", "Style": "margin-top:1%;margin-left:2%;", "Parent": CCFooter });
        var MessageIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/textIcon.png", "Class": "MessageIcon", "Id": "MessageIcon", "Parent": messageIconContainer });
        var personLabel = GHVHS.DOM.create({ "Type": "div", "Class": "personLabel", "Id": "personLabel", "Content": userName, "Parent": messageIconContainer });
        var messageArea = GHVHS.DOM.create({ "Type": "textarea", "Class": "messageArea", "Id": "messageArea", "Parent": CCFooter });
        var sendButton = GHVHS.DOM.create({ "Type": "div", "Class": "sendButton", "Id": "sendButton", "Content": "Post", "Parent": CCFooter });
        sendButton.onclick = function () {
            var message = document.getElementById("messageArea").value;
            var Numbered = Number(PnpConvos.CurrentMsgId) + 1;
            function UpdatedList(json) {
                window.location.href = window.location.href;
            }
            var messageValue = message;
            messageValue = messageValue.replace("'", "");
            messageValue = messageValue.replace("?", "");
            messageValue = messageValue.replace("?", "");
            messageValue = messageValue.replace("?", "");
            messageValue = messageValue.replace("&", "");
            messageValue = messageValue.replace("&", "");
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicesMessages?ConvoId=" + convoData[1] + "&MessageId=" + Numbered + "&Body=" + messageValue + "&SingleUser=" + userName + "&ScriptAs=Create", "Callback": UpdatedList, "CallbackParams": [] });
        }
    },
    ConvoId:"",
    drawConvoDropdowns: function (filter, parent, list, height, width) {
        if (!height) {
            height = "70px";
        }
        var DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": parent });
        var heighEle = GHVHS.DOM.create({ "Type": "div", "Class": "hide ", "Id": "heighEle", "Content": height, "Parent": DropDown });
        DropDown.style.height = "1px";
        DropDown.style.display = "none";
        DropDown.style.transition = "height 0.4s ease";
        DropDown.style.top = (filter.offsetTop + filter.offsetHeight) + "px";
        DropDown.style.overflow = "auto";
        DropDown.style.backgroundColor = "white";
        DropDown.style.left = (filter.offsetLeft-25) + "px";
        DropDown.style.boxShadow = "2px 2px 5px grey";
        DropDown.style.width = (filter.offsetWidth + 50) + "px";
        if (width) {
            DropDown.style.width = width;
        }
       
        DropDown.style.position = "absolute";
        filter.onclick = function () {
            var DropDown = this.parentElement.parentElement.querySelectorAll(".DropDown");
            var heightElem = DropDown[0].querySelectorAll(".hide");
            DropDown[0].style.top = ((filter.offsetTop + filter.offsetHeight) - this.parentElement.parentElement.parentElement.scrollTop) + "px";
            if (DropDown[0].style.height == "1px") {
                DropDown[0].style.display = "block";
                setTimeout(function () {
                    DropDown[0].style.height = heightElem[0].innerText;
                }, 10);
            } else {
                DropDown[0].style.height = "1px";
                setTimeout(function () {
                    DropDown[0].style.display = "none";
                }, 500);
            }
        }
        
           
        for (var i = 0; i < list.length; i++) {
            var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Parent": DropDown });
            SingleOption.innerHTML = list[i]["Label"];
            if (list[i]["Label"] == "Delete") {
               
                SingleOption.onclick = function () {
                    var getIds = this.parentElement.parentElement.id;
                    var splitIds = getIds.split("||");
                    PnpConvos.DrawConfirmButton(filter, splitIds[1], "", "getPolicesMessages?ConvoId=" + splitIds[0] + "&ScriptAs=Delete&MessageId=" + splitIds[1],"Y");
                }
            } else if (list[i]["Label"] == "My Discussions") {
                SingleOption.onclick = function () {
                    var name = document.getElementById("user").innerText;
                    var splitUName = name.split("Welcome: ");
                    PnpConvos.returnOrderByURL("?Search=" + splitUName[1], "Search");
                }
            } else if (list[i]["Label"] == "Edit") {
                SingleOption.onclick = function () {
                    var getParent = this.parentElement.parentElement;
                    var splitIds = getParent.id.split("||");
                    PnpConvos.EditMessage(getParent, splitIds[1], splitIds[0]);
                }
            } else if (list[i]["Label"] == "View Document") {
                SingleOption.onclick = function () {
                    var splitIds = window.location.href.split("PolicesDiscussion/");
                    if (splitIds[1].indexOf("?")>=0) {
                        var suburl = splitIds[1].split("?");
                        var thisId = suburl[0].replace("c", "");
                    }else {
                        var thisId = splitIds[1].replace("c", "");
                    }
                    var linktoIframe = "/PnP/Policy/" + thisId;

                    GHVHS.DOM.drawslideUpIframe(linktoIframe, "", "");
                }
            } else if (list[i]["Label"] == "Order by Date ^") {
                SingleOption.onclick = function () {
                    PnpConvos.returnOrderByURL("?orderBy=Date Asc");
                }
            } else if (list[i]["Label"] == "Order by Date") {
                SingleOption.onclick = function () {
                    PnpConvos.returnOrderByURL("?orderBy=Date Desc");
                }
            } else if (list[i]["Label"] == "Order Messages A-Z") {
                SingleOption.onclick = function () {
                    PnpConvos.returnOrderByURL("?orderBy=Body Asc");
                }
            }
            else if (list[i]["Label"] == "Order Messages Z-A") {
                SingleOption.onclick = function () {
                    PnpConvos.returnOrderByURL("?orderBy=Body Desc");
                    
                }
            }
            else if (list[i]["Label"] == "Order Default") {
                SingleOption.onclick = function () {
                    PnpConvos.returnOrderByURL("?orderBy=Date Desc");
                }
            } else if (list[i]["Label"] == "Delete Convo") {

                SingleOption.onclick = function () {
                    var getIds = this.parentElement.parentElement.parentElement.id;
                    PnpConvos.DrawConfirmButton(filter, getIds, "", "DeletePolicesDiscussionAndAllMessages?ConvoId=" + getIds + "&ScriptAs=Delete", "Y");
                }
            } else if (list[i]["Label"] == "Add People To Convo") {
                SingleOption.onclick() = function () {
                    var getIds = this.parentElement.parentElement.parentElement.id;
                    PnpConvos.SlideUpPeopleInConvos(getIds);
                }
            }

            
           
               
        }
        
        
    },
    SlideUpPeopleInConvos:function(id){
        Pnp.getAllUsers();
        var getUser = element.querySelectorAll(".personLabel");
        var theUsername = getUser[0].innerText;
        var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Edit Message", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            if (document.getElementById("ViewFile")) {
                document.getElementById("ViewFile").style.display = "unset";
            }
            canvas2.parentElement.removeChild(canvas2);

        }
        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        GHVHS.DOM.DrawSmallLoader2(FrameBody);
        function DrawPeopleInConvo(json, p) {
            var frameBody = p;
            var drawPeople = GHVHS.DOM.create({ "Type": "div", "Class": "drawPeople", "Id": "drawPeople", "Parent": FrameHeader });
            var ArrowContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainer", "Id": "ArrowContainer", "Parent": FrameHeader });
            PnpConvos.DrawArrows(ArrowContainer);
            var drawPeopleInConvo = GHVHS.DOM.create({ "Type": "div", "Class": "drawPeople", "Id": "drawPeople", "Parent": FrameHeader });
            var data = JSON.parse(json["Items"]);
            for (var i = 0; i < data.length; i++) {


            }

        }




        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicesDiscussions?Dummy=" + n + "&orderBy=" + order + "&DocId=" + id, "Callback": DrawPeopleInConvo, "CallbackParams": FrameBody });

    },
    DrawArrows:function(parent){
        var ArrowContainer1 = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainerSmall","Style":"margin-top:60%;",  "Id": "ArrowContainer1", "Parent": parent });
        var Arrows1 = GHVHS.DOM.create({ "Type": "img","Src":"/img/whiteDoubleArrows.png", "Class": "Arrows", "Id": "Arrows1", "Parent": ArrowContainer1 });
        ArrowContainer1.onclick = function () {
            if (this.className == "ArrowContainerSmall") {
                Admin.CheckAndCreateNewEntry();
            } else {
                Admin.drawErrorMsg("Please Enter a correct value");
            }
        }

        var ArrowContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainerSmall", "Id": "ArrowContainer2", "Parent": parent });
        var Arrows2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/whiteDoubleArrows.png", "Class": "Arrows rotate", "Id": "Arrows2", "Parent": ArrowContainer2 });
        Arrows2.onclick = function () {
            Admin.CheckAndDelete();
        }
    },
    returnOrderByURL: function (orderBy, keyWord) {
        if (!keyWord) {
            keyWord = "orderBy";
        }
        if (window.location.href.indexOf("?" + keyWord) >= 0) {
            var params = window.location.href.split("?");
            if (window.location.href.indexOf("&") >= 0) {
                var params2 = window.location.href.split("&");
                var addurl = "";
                for (var i = 0; i < params2.length; i++) {
                    if (i < 0) {
                        addurl += "&" + params2[i];
                    }
                }
                window.location.href = params[0] + orderBy + addurl;
            } else {
                window.location.href = params[0] + orderBy;
            }
        } else if (window.location.href.indexOf("&" + keyWord) >= 0) {
            var params = window.location.href.split("&");
            var addurl = "";
            startUrl = "";
            orderBy = orderBy.replace("?", "&");
            for (var i = 0; i < params.length; i++) {
                if (i < 0) {
                    if (params[i].indexOf("&" + keyWord) < 0) {
                        addurl += "&" + params[i];
                    }
                } else {
                    startUrl = params[i];
                }
            }
            window.location.href = startUrl + addurl + orderBy;
        } else {
            window.location.href = window.location.href + orderBy;
        }
    },
    EditMessage: function (element, messageId, convoId) {
        var getMessage = element.querySelectorAll(".messageContainerRight");
        if (!getMessage[0]) {
            getMessage = element.querySelectorAll(".messageContainerLeft");
        }
        var getUser = element.querySelectorAll(".personLabel");
        var theUsername = getUser[0].innerText;
        var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Edit Message", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            if (document.getElementById("ViewFile")) {
                document.getElementById("ViewFile").style.display = "unset";
            }
            canvas2.parentElement.removeChild(canvas2);

        }
        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        var messageArea = GHVHS.DOM.create({ "Type": "textarea", "Class": "messageArea", "Id": "messageArea", "Parent": FrameBody });
        var theValue = getMessage[0].innerHTML;
        var value = theValue.split("<div");
        messageArea.value = value[0];
        var sendButton = GHVHS.DOM.create({ "Type": "div", "Class": "sendButton", "Id": "sendButton", "Content": "Save", "Parent": FrameBody });
        sendButton.onclick = function () {
            function UpdatedList(json) {
                window.location.href = window.location.href;
            }
            var messageValue = messageArea.value;
            messageValue = messageValue.replace("'", "");
            messageValue = messageValue.replace("?", "");
            messageValue = messageValue.replace("?", "");
            messageValue = messageValue.replace("?", "");
            messageValue = messageValue.replace("&", "");
            messageValue = messageValue.replace("&", "");
            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicesMessages?ConvoId=" + convoId + "&MessageId=" + messageId + "&Body=" + messageValue + "&SingleUser=" + theUsername + "&ScriptAs=Update", "Callback": UpdatedList, "CallbackParams": [] });

        }
    },
    DrawConfirmButton: function (Elem, ID, Name, list, IsImg) {
        if (list.indexOf("getPolicesMessages") >= 0){
            var getUser = Elem.parentElement.querySelectorAll(".personLabel");
            var theUsername = getUser[0].innerText;
            list += "&SingleUser=" + theUsername;
        }
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        if (!IsImg) {
            Elem.className = "darkBlueST";
            canvas2.onclick = function (e) {
                if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                    Elem.className = "SingleTableElem";
                    document.getElementById('canvas').removeChild(this);
                }

            }
        } else {
            canvas2.onclick = function (e) {
                if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                    document.getElementById('canvas').removeChild(this);
                }

            }
        }

        loader = GHVHS.DOM.create({ "Type": "div", "Class": "loader", "Id": "loader", "Parent": canvas2 });
        ConfirmRemoveContainer = GHVHS.DOM.create({ "Type": "div", "Parent": loader, "Class": "ConfirmRemoveContainer" });
        ConfirmRemoveContainer.style.width = (canvas.offsetWidth * 0.3) - 20 + "px";
        ConfirmRemoveContainer.style.left = "34%";
        ConfirmRemove = GHVHS.DOM.create({ "Type": "div", "Parent": ConfirmRemoveContainer, "Content": "Are you sure you want to remove this message?", "Class": "ConfirmRemove" });
        ConfirmRemove.style.lineHeight = "2em";
        Confirm = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": "Confirm", "Parent": ConfirmRemove, "Content": "Confirm" });

        Confirm.onclick = function () {
            GHVHS.DOM.DrawSmallLoader2();
            function redrawPage() {
                window.location.href = window.location.href;
            }
            GHVHS.DOM.send({ "URL": "/Pnp/"+list+"&id=" + ID, "Callback": redrawPage, "CallbackParams": [] });
        }

        Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Parent": ConfirmRemove, "Content": "Cancel" });
        Cancel.style.marginTop = "5px";
    },
    searchPage: function (list, search) {
        var searchButton = document.getElementById("searchButtonMain");
        var searchButtonC = document.getElementById("searchButtonClear");
        if (!searchButton) {
            if (search.value != "") {
                searchButtonMain = GHVHS.DOM.create({ "Type": "div", "Class": "searchButtonMain", "Id": "searchButtonMain", "Content": "Search", "Parent": document.getElementById("CCHeader") });
                searchButtonClear = GHVHS.DOM.create({ "Type": "div", "Class": "searchButtonMain", "Id": "searchButtonClear", "Content": "Clear Search", "Parent": document.getElementById("CCHeader") });
                searchButtonMain.style.top = (search.offsetTop + search.offsetHeight + 5) + "px";
                searchButtonMain.style.height = (search.offsetHeight - 19) + "px";
                searchButtonMain.style.left = (search.offsetLeft + (search.offsetWidth * 0.08)) + "px";
                searchButtonClear.style.top = (search.offsetTop + search.offsetHeight + 5) + "px";
                searchButtonClear.style.height = (search.offsetHeight - 19) + "px";
                searchButtonClear.style.width = search.offsetWidth - (search.offsetWidth * 0.6) + "px"
                document.getElementById("CCHeader").style.paddingBottom = (search.offsetHeight + 10) + "px";
                searchButtonMain.style.width = search.offsetWidth - (search.offsetWidth * 0.6) + "px"
                searchButtonClear.style.left = (search.offsetLeft + (search.offsetWidth * 0.12) + searchButtonMain.offsetWidth) + "px";
                searchButtonMain.style.borderRadius = "10px";
                searchButtonClear.style.borderRadius = "10px";
                searchButtonMain.onclick = function () {
                    GHVHS.DOM.DrawSmallLoader2();
                    PnpConvos.returnOrderByURL("?Search="+search.value, "Search");
                }
                searchButtonClear.onclick = function () {
                    GHVHS.DOM.DrawSmallLoader2();
                    search.value = "";
                    search.click();
                    if (window.location.href.indexOf("?Search") >= 0) {
                        var split = window.location.href.split("?");
                        var startValue = "";
                        var addToURL = "";
                        for (var i = 0; i < split.length; i++ ){
                            if (i==0){
                                startValue = split[i];
                            } else if (i > 1) {
                                addToURL += "&"+split[i];
                            }
                        } 
                        window.location.href = startValue + addToURL;
                    } else if (window.location.href.indexOf("&Search") >= 0) {
                        var split = window.location.href.split("&");
                        var startValue = "";
                        var addToURL = "";
                        for (var i = 0; i < split.length; i++) {
                            if (i == 0) {
                                startValue = split[i];
                            } else if (split[i].indexOf("Search") < 0) {
                               addToURL += "&" + split[i];
                            }
                        }
                    } else {
                        window.location.href = window.location.href;
                    }
                  
                }
            }
        } else {
            if (search.value == "") {
                var searchButton = document.getElementById("searchButtonMain");
                var searchButtonC = document.getElementById("searchButtonClear");
                if (searchButton) {
                }
                searchButtonMain.style.paddingTop = "0px";
                searchButtonMain.style.paddingBottom = "0px";
                searchButtonMain.style.height = "0px";
                searchButtonC.style.paddingTop = "0px";
                searchButtonC.style.paddingBottom = "0px";
                searchButtonC.style.height = "0px";
                search.style.marginLeft = "8%";
                search.style.width = "80%";
                document.getElementById("CCHeader").style.paddingBottom = "0%";
                setTimeout(function () {
                    searchButton.parentElement.removeChild(searchButton);
                    searchButtonC.parentElement.removeChild(searchButtonC);
                }, 350);
            }
        }
    },
};