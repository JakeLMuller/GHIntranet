var Uploader = {
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
    formateSQLDate: function (date) {
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
        return newDate + "   " + newTime;
    },
    Create: function () {
        var formData;
        var masterElem = document.getElementById("MainContent");
        masterElem.style.backgroundColor = "rgba(64, 0, 23, 0.05)";
        masterElem.style.marginTop = "-1.4%";
        
        UploadForm = GHVHS.DOM.create({ "Type": "div", "Class": "UploadForm", "Id": "UploadForm", "Parent": masterElem });
        UploadTitle = GHVHS.DOM.create({ "Type": "div", "Class": "UploadTitle", "Id": "UploadTitle", "Content": "Add An Upload", "Parent": UploadForm });
        if (document.getElementById('MainContent').offsetWidth > 1500) {
            BackButton = GHVHS.DOM.create({ "Type": "div", "Class": "BackButton", "Id": "BackButton", "Parent": document.getElementById('MainContent') });
            BackButton.style.position = "absolute";
            BackButton.style.left = "1%";
            BackButton.style.top = "15%";
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/backArrowTrans.png", "Style": "Height:20px;", "Parent": BackButton });
            BackButton.innerHTML += "Back To All Uploads";
            BackButton.onclick = function () {
                window.location.href = "/Uploader/Index";
            }
        }
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "MainInputHeader", "Id": "MainInputHeader", "Content": "Click Photo Icon To Add Image", "Parent": UploadForm });
        MainInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "MainInputContainer", "Id": "MainInputContainer", "Parent": UploadForm });
        UpLoadImage = GHVHS.DOM.create({ "Type": "img", "Class": "UpLoadImage", "Id": "UpLoadImage", "Src": "/img/add-image.png", "Parent": MainInputContainer });
        elmCamera = GHVHS.DOM.create({ "Type": "input", "InputType": "file", "Class": "hide", "Parent": MainInputContainer });
        elmCamera.style.display = "none";
        UpLoadImage.onclick = function (e) {
            elmCamera.click();
        };
        elmCamera.setAttribute("accept", "image/*");
        elmCamera.setAttribute("capture", "camera");
        elmCamera.onchange = function () {
            var imgHolder = document.getElementById('UpLoadImage');
            var file = elmCamera.files[0];
            imgHolder.style.opacity = "1";
            var url = URL.createObjectURL(file);
            imgHolder.src = url;
            formData = new FormData();
            formData.append('file', file);


        }
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseField", "Id": "MainInputHeader", "Content": "Add Caption", "Parent": UploadForm });
        CapInputContainer = GHVHS.DOM.create({ "Type": "TextArea", "Class": "CapInputContainer ", "Id": "Caption", "Parent": UploadForm });
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseField", "Id": "MainInputHeader", "Content": "Add Location", "Parent": UploadForm });
       
        CapInputContainer = GHVHS.DOM.create({ "Type": "input", "Class": "CapInputContainer Filter", "Id": "location", "Style": "Height:5%; Margin-top:0px;Margin-bottom:0px;", "Parent": UploadForm });
        Post = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Id": "Post", "Style": "width:40%; background-color:rgb(63, 80, 104);", "Content": "Post", "Parent": UploadForm });
        Post.onclick = function () {
            Uploader.DrawSmallLoader();
            function createPost(json) {
                var jsondata = Uploader.decodeJson(json);
                var Caption = document.getElementById("Caption").value;
                var location = document.getElementById("location").value;
                var Username = document.getElementById("Username").value;
                function removeAndGoToIndex(){
                    Uploader.RemoveSmallLoader();
                    window.location.href = "/Uploader/Index";
                }
                GHVHS.DOM.send({ "URL": "/Uploader/CreatePost?Username=" + Username + "&Caption=" + Caption + "&location=" + location + "&CommentId=" + jsondata[0]["CurrentCommentID"].toString() + "&UploadId=" + jsondata[0]["CurrentUploadID"].toString(), "PostData": formData, "Callback": removeAndGoToIndex, "Method": "POST" });
            }
            GHVHS.DOM.send({ "URL": "/Api/GetIds", "Callback": createPost, "CallbackParams": []});
        };
    },
    DrawSmallLoader: function () {
        if (!document.getElementById("FaxTableLoader")) {
            FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": "Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);", "Parent": document.getElementById('MainContent') });
            FaxTableLoader.style.left = document.getElementById("MainContent").offsetLeft + "px";
            FaxTableLoader.style.top = document.getElementById("MainContent").offsetTop + "px";
            FaxTableLoader.style.width = document.getElementById("MainContent").offsetWidth + "px";
            FaxTableLoader.style.height = (document.getElementById("MainContent").offsetHeight + document.getElementById("MainContent").offsetHeight) + "px";
            var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
            SearchLoader.style.marginLeft = "45%"
        }
    },
    RemoveSmallLoader: function () {

        var loaderElem = document.getElementById("FaxTableLoader");
        document.getElementById('MainContent').removeChild(loaderElem);

    },
    Display: function (json) {
        var data = { data: json };
        var jsonData = Uploader.decodeJson(data);
        var masterElem = document.getElementById("MainContent");
        Plus = GHVHS.DOM.create({ "Type": "img", "Class": "addButton", "Id": "addButton", "Src": "/img/Add.png", "Parent": masterElem });
        Plus.onclick = function () {
            window.location.href = "/Uploader/Create";
        }
        document.getElementById("headerPartOneTwo").style.backgroundColor = "#f5fcff";
        masterElem.style.backgroundColor = "rgb(63, 80, 104)";
        masterElem.style.marginTop = "-1.2%";
        UploadTitle = GHVHS.DOM.create({ "Type": "div", "Class": "UploadTitle", "Id": "UploadTitle", "Content": "View Uploads", "Style": "Background-image:url(/img/view.png);background-color:rgb(63, 80, 104); color:white;", "Parent": masterElem });
        UploadForm = GHVHS.DOM.create({ "Type": "div", "Class": "DisplayForm", "Id": "DisplayForm","Style":"Background-color:rgb(63, 80, 104);", "Parent": masterElem });
        for (var i = 0; i < jsonData.length; i++) {
            SingleUpload = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUpload", "Id": "SingleUpload", "Parent": UploadForm });
            SingleUpload.id = jsonData[i]["UploadId"] + "";
            SingleUpload.onclick = function(){
                GHVHS.DOM.drawslideUpIframe("/Uploader/Details/"+this.id);
            }
            SingleUpload.onmouseover = function () {
                var x = this.querySelectorAll(".SingleUploadInfo");
                x[0].style.display = "block";
            }
            SingleUpload.onmouseout = function () {
                var x = this.querySelectorAll(".SingleUploadInfo");
                x[0].style.display = "none";
            }
            SingleUpload.style.backgroundImage = "url(/img/" + jsonData[i]["Filename"] + ")";
            SingleUploadInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUploadInfo", "Id": "SingleUploadInfo", "Parent": SingleUpload });
            SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top","Style":"Width:40%;", "Content": "Likes: " + jsonData[i]["Likes"], "Parent": SingleUploadInfo });
            SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top", "Style":"Width:60%;","Content": "Uploaded On: " + Uploader.formateSQLDate(jsonData[i]["UploadDateTime"]), "Parent": SingleUploadInfo });
            SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top", "Content": "Uploaded By: " + jsonData[i]["Username"], "Parent": SingleUploadInfo });
            SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top", "Content": "Location: " + jsonData[i]["Location"], "Parent": SingleUploadInfo });
            
            SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "bottom", "Id": "bottom", "Content": jsonData[i]["Caption"], "Parent": SingleUploadInfo });
        }
    },

    SingleView: function (json) {
        var data = { data: json };
        var jsonData = Uploader.decodeJson(data);
        var masterElem = document.getElementById("MainContent");
        document.getElementById("headerPartOneTwo").style.backgroundColor = "#f5fcff";
        masterElem.style.marginTop = "-1.2%";
        document.getElementById("canvas").style.backgroundColor = "rgb(63, 80, 104)";
        UploadTitle = GHVHS.DOM.create({ "Type": "div", "Class": "UploadTitle", "Id": "UploadTitle", "Content": "View Photo", "Style": "margin-top:3%;", "Parent": masterElem });
        UploadForm = GHVHS.DOM.create({ "Type": "div", "Class": "UploadForm", "Id": "UploadForm", "Parent": masterElem });
        if (masterElem.offsetWidth < 1500) {
            UploadTitle.style.backgroundPosition = "68% -70%";
        } else {

        }
        if (document.getElementById('MainContent').offsetWidth > 1500) {
            BackButton = GHVHS.DOM.create({ "Type": "div", "Class": "BackButton", "Id": "BackButton", "Parent": document.getElementById('MainContent') });
            BackButton.style.position = "absolute";
            BackButton.style.left = "16%";
            BackButton.style.top = "5%";
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/backArrowTrans.png", "Style": "Height:20px;", "Parent": BackButton });
            BackButton.innerHTML += "Back To All Uploads";
            BackButton.onclick = function () {
                window.location.href = "/Uploader/Index";
            }
        }
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "MainInputHeader", "Id": "MainInputHeader", "Content": "Uploaded On: " + Uploader.formateSQLDate(jsonData[0]["UploadDateTime"]), "Parent": UploadForm });
        MainInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "MainInputContainer", "Id": "MainInputContainer", "Style": "height:60%;", "Parent": UploadForm });
        UpLoadImage = GHVHS.DOM.create({ "Type": "img", "Class": "UpLoadImage", "Id": "UpLoadImage", "Src": "/img/" + jsonData[0]["Filename"] + "", "Style": "height:100%;","Parent": MainInputContainer });
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseField", "Id": "MainInputHeader", "Content": "Caption:", "Style": "width:20%;", "Parent": UploadForm });
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseField", "Id": "MainInputHeader", "Content": "Location:", "Style": "width:20%;margin-left:13%;", "Parent": UploadForm });
        CapInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CapInputContainer ", "Id": "Caption", "Content": jsonData[0]["Caption"], "Parent": UploadForm });
        CapInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CapInputContainer ", "Id": "location", "Content": jsonData[0]["Location"], "Style": "Text-Align:center;Height:5%; Margin-top:0px;Margin-bottom:0px;", "Parent": UploadForm });
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseField", "Id": "MainInputHeader", "Content": "Username:", "Style": "width:20%;margin-left:8%;", "Parent": UploadForm });
        CapInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CapInputContainer ", "Style": "Text-Align:center;Height:5%; Margin-top:0px;Margin-bottom:0px;", "Content": jsonData[0]["Username"], "Parent": UploadForm });
        UploadForm2 = GHVHS.DOM.create({ "Type": "div", "Class": "UploadForm2", "Id": "UploadForm2", "Parent": masterElem });
        like = GHVHS.DOM.create({ "Type": "div", "Class": "like", "Id": jsonData[0]["UploadId"], "Content": "Likes:" + jsonData[0]["Likes"], "Parent": UploadForm2 });
        if (document.getElementById('MainContent').offsetWidth < 1500) {
            like.style.backgroundPosition = "5% 05%";
        }
        like.onclick = function () {
            var getLikes = jsonData[0]["Likes"];
            this.innerHTML = "Likes:" + (Number(getLikes) + 1);
            this.style.backgroundColor = "rgb(0, 102, 153)";
            this.style.color = "white";
            var getid = window.location.href.split("Details/");
            function updated() {
                return;
            }
            GHVHS.DOM.send({ "URL": "/Api/upDateLikes/?likes=" + (Number(getLikes) + 1) + "&Id=" + getid[1], "Callback": updated, "CallbackParams": [] });
        }
        Comment = GHVHS.DOM.create({ "Type": "div", "Class": "Comment", "Id": "Comment", "Content": "Comment", "Parent": UploadForm2 });
        Comment.onclick = function () {
            var getUploader = document.getElementById("singleComment2");
            if (getUploader.style.height == "0px") {
                var getAllComments = this.parentElement.querySelectorAll("singleComment");
                
                getUploader.style.display = "block";
                setTimeout(function () {
                    getUploader.style.height = "150px";
                    if (getAllComments.length == 0) {
                        getUploader.style.paddingBottom = "7.5%";
                    } else {
                        document.getElementById("first").style.marginTop = "8%";
                    }
                }, 50);
                
                this.style.backgroundColor = "rgb(0, 102, 153)";
                this.style.color = "white";
            } else {
                
                getUploader.style.height = "0px";
                setTimeout(function () {
                    getUploader.style.display = "none";
                    if (document.getElementById("first")) {
                        document.getElementById("first").style.marginTop = "1%";
                    }
                   
                }, 500);
                this.style.backgroundColor = "white";
                this.style.color = "rgb(0, 102, 153)";
            }
        }
        CommentConatiner = GHVHS.DOM.create({ "Type": "div", "Class": "CommentConatiner", "Id": "CommentConatiner", "Parent": UploadForm2 });
        function getComments(json) {
           
            var jsonData2 = Uploader.decodeJson(json);
            if (jsonData2[0]) {
                for (var i = 0; i < jsonData2.length; i++) {
                    singleComment = GHVHS.DOM.create({ "Type": "div", "Class": "singleComment", "Id": "singleComment", "Parent": CommentConatiner });
                    if (i == 0) {
                        
                        singleComment.id = "first";
                    }
                    CommentHeader = GHVHS.DOM.create({ "Type": "div", "Class": "CommentHeader", "Id": "CommentHeader", "Content": "Comment By: " + jsonData2[i]["Username"] +" on "+ Uploader.formateSQLDate(jsonData2[i]["Date"]), "Parent": singleComment });
                    CommentMidDrift = GHVHS.DOM.create({ "Type": "div", "Class": "CommentMidDrift", "Id": "CommentMidDrift", "Parent": singleComment });
                    CommentMidDrift.innerHTML = "" + jsonData2[i]["Comment"];
                  
                }
            }
        }
        GHVHS.DOM.send({ "URL": "/Api/Comments/?Cid=" + jsonData[0]["UploadId"], "Callback": getComments, "CallbackParams": [] });
        singleComment = GHVHS.DOM.create({ "Type": "div", "Class": "singleComment", "Id": "singleComment2", "Style": "min-height:0px;height: 0px; display:none; ", "Parent": CommentConatiner });
        CommentHeader = GHVHS.DOM.create({ "Type": "input", "Class": "CommentHeader2 text", "Id": "CommentHeaderUp", "Style": "width: 100%;height:20%;background-Image:none;   ", "Parent": singleComment });
        CommentHeader.setAttribute("placeholder", "Username");
        CommentMidDrift = GHVHS.DOM.create({ "Type": "TextArea", "Class": "CommentMidDrift text", "Id": "CommentMidDriftUp", "Style": "width: 100%;height: 60%;  background-Image:none; margin-bottom:2%; ", "Parent": singleComment });
        CommentMidDrift.setAttribute("placeholder", "Comment");
        CommentFooter = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "CommentFooter","Parent": singleComment });
        Post = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Id": "Post", "Style": "width:30%; padding-bottom:3%;background-color:rgb(63, 80, 104);", "Content": "Post Comment", "Parent": singleComment });
        if (document.getElementById("MainContent").offsetWidth < 1500) {
            Post.style.paddingBottom = "5%";
        }
        Post.onclick = function () {
            var getComment = document.getElementById("CommentMidDriftUp").value;
            var getUser = document.getElementById("CommentHeaderUp").value;
            var getid = window.location.href.split("Details/");
            var getCurrentId = getid[1];
            function AddComm() {
                window.location.href = window.location.href;
            }
            GHVHS.DOM.send({ "URL": "/Api/Comments/?Cid=" + getCurrentId + "&Comments=" + getComment + "&Username=" + getUser + "&ToUpdate=Y", "Callback": AddComm, "CallbackParams": [] });
        }
    }


};