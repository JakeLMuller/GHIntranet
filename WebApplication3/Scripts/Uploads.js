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
        UploadTitle = GHVHS.DOM.create({ "Type": "div", "Class": "UploadTitle", "Id": "UploadTitle","Style":"box-shadow:unset;", "Content": "Add An Upload", "Parent": UploadForm });
      
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
        UpLoadImageVideo = GHVHS.DOM.create({ "Type": "iframe", "Class": "hide", "Id": "UpLoadImageVideo", "Src": "/img/add-image.png", "Parent": MainInputContainer });
        elmCamera = GHVHS.DOM.create({ "Type": "input", "InputType": "file", "Class": "hide", "Parent": MainInputContainer });
        elmCamera.style.display = "none";
        UpLoadImage.onclick = function (e) {
            elmCamera.click();
        };
        elmCamera.setAttribute("accept", "image/*,video/mp4,video/x-m4v,video/*");
        elmCamera.setAttribute("capture", "camera");
        elmCamera.onchange = function () {
            var imgHolder = document.getElementById('UpLoadImage');
            var file = elmCamera.files[0];
            imgHolder.style.opacity = "1";
            var url = URL.createObjectURL(file);
            if (file.name.indexOf("mp4") >= 0) {
                var iframe = document.getElementById('UpLoadImageVideo');
                iframe.className = "IFrameUpload";
                imgHolder.className = "hide";
                
               
                iframe.src = url;
                formData = new FormData();
                formData.append('file', file);

            } else {
                document.getElementById('UpLoadImageVideo').className = "hide";
                imgHolder.className = "UpLoadImage";
                imgHolder.src = url;
                formData = new FormData();
                formData.append('file', file);
            }
            


        }
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseField", "Id": "MainInputHeader", "Content": "Add Caption", "Parent": UploadForm });
        CapInputContainer = GHVHS.DOM.create({ "Type": "TextArea", "Class": "CapInputContainer ", "Id": "Caption", "Parent": UploadForm });
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseField", "Id": "MainInputHeader", "Content": "Add Location", "Parent": UploadForm });
       
        CapInputContainer = GHVHS.DOM.create({ "Type": "input", "Class": "CapInputContainer Filter", "Id": "location", "Style": "Height:5%; Margin-top:0px;Margin-bottom:0px;", "Parent": UploadForm });
        Post = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Id": "Post", "Style": "width:45%;margin-left:27.5%;margin-top:2%; background-color:rgba(64, 0, 23,0.65);transition:all .25s ease;", "Content": "Post", "Parent": UploadForm });
        Post.onclick = function () {
            Uploader.DrawSmallLoader();
           
                var Caption = document.getElementById("Caption").value;
                var location = document.getElementById("location").value;
                function removeAndGoToIndex(){
                    Uploader.RemoveSmallLoader();
                    window.location.href = "/Uploader/Index";
                }
                GHVHS.DOM.send({ "URL": "/Uploader/CreatePost?Caption=" + Caption + "&location=" + location, "PostData": formData, "Callback": removeAndGoToIndex, "Method": "POST" });
            
           
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
    Display: function (json, username, search) {
        var data = { data: json };
        var jsonData = Uploader.decodeJson(data);
        var masterElem = document.getElementById("MainContent");
        var userNAME = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "userNAME", "Content": username, "Parent": masterElem });
        Plus = GHVHS.DOM.create({ "Type": "img", "Class": "addButton", "Id": "addButton","Style":"position:fixed;", "Src": "/img/Add.png", "Parent": masterElem });
        Plus.onclick = function () {
            window.location.href = "/Uploader/Create";
        }
        document.getElementById("headerPartOneTwo").style.backgroundColor = "rgba(64, 0, 23,0.02)";
        masterElem.style.backgroundColor = "white";
        masterElem.style.marginTop = "-2.4%";
        var headerContainer = GHVHS.DOM.create({ "Type": "div", "Class": "headerContainer", "Id": "headerContainer", "Parent": masterElem });
        var checkforIE = GHVHS.DOM.getBrowserType();
        if (checkforIE == "IE") {
            var headerContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "headerContainer", "Style": "position:unset;float:left;background-color:whitesmoke; border-bottom:1px solid #85274e;", "Id": "headerContainer", "Parent": headerContainer });

        } else {
            var headerContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "headerContainer", "Style": "height:100%;position:unset;float:left;background-color:rgba(64, 0, 23,0.06);", "Id": "headerContainer", "Parent": headerContainer });
        }
        UploadTitle = GHVHS.DOM.create({ "Type": "div", "Class": "UploadTitle", "Id": "UploadTitle", "Content": "View Posts", "Style": "height:auto;background-color:unset;color:rgba(64, 0, 23,0.65);box-shadow:unset;width:15%;margin-left:41%;margin-right:5%;", "Parent": headerContainer2 });
        var ContactsImg2 = GHVHS.DOM.create({ "Type": "img", "Class": "ContactsImg", "Id": "ContactsImg2", "Style": "width:30px;height:30px;margin-top:0.5%;padding:4px 4px 4px 4px;", "Src": "/img/blueSearchIcon.png", "Parent": headerContainer2 });
        ContactsImg2.onclick = function () {
            if (this.className == "ContactsImg") {
                this.className = "ContactsImgSelected";
                var getFilter = document.getElementById("Filter");
                var getSearchButton = document.getElementById("SearcButtonPost");
                getSearchButton.style.display = "block";
                getFilter.style.display = "block";
                setTimeout(function () {
                    getFilter.style.height = "40px";
                    getSearchButton.style.height = "10px";
                }, 10);
            } else {
                this.className = "ContactsImg";
                this.style.width = "30px";
                this.style.marginTop = "0.5%";
                var getFilter = document.getElementById("Filter");
                var getSearchButton = document.getElementById("SearcButtonPost");
                getFilter.style.height = "1px";
                getSearchButton.style.height = "1px";
                setTimeout(function () {
                    getFilter.style.display = "none";
                    getSearchButton.style.display = "none";
                }, 200);
            }
        }
        Uploader.drawFilesSearch(headerContainer2, search);
        if (search) {
            ContactsImg2.click();
            document.getElementById("Filter").value = search;
        }
        var PostButtomContainer = GHVHS.DOM.create({ "Type": "div", "Id": "PostButtomContainer", "Class": "PostButtomContainer", "Parent": headerContainer2 });
        var CurrentPostButtom = GHVHS.DOM.create({ "Type": "a", "Href": "/Uploader/Index/", "Id": "CurrentPostButtom", "Class": "SelectedButtonPost", "Parent": PostButtomContainer });
        var textPostLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textPostLabel", "Class": "textPostLabel", "Content": "All Posts", "Parent": CurrentPostButtom });
        var CurrentPostButtom2 = GHVHS.DOM.create({ "Type": "a", "Href": "/Uploader/Index/?MyPosts=Y", "Id": "textPostLabel", "Class": "CurrentPostButtom", "Parent": PostButtomContainer });
        var textPostLabel = GHVHS.DOM.create({ "Type": "div", "Id": "textPostLabel", "Class": "textPostLabel", "Content": "My Posts", "Parent": CurrentPostButtom2 });
        if (window.location.href.indexOf("MyPost") >= 0) {
            CurrentPostButtom2.className = "SelectedButtonPost";
            CurrentPostButtom.className = "CurrentPostButtom ";
        }
        AllContentHolder = GHVHS.DOM.create({ "Type": "div", "Class": "AllContentHolder", "Id": "AllContentHolder", "Parent": masterElem });
        AllContentHolder.style.marginTop = headerContainer.offsetHeight + "px";
        UploadForm = GHVHS.DOM.create({ "Type": "div", "Class": "AllContent", "Id": "DisplayForm",  "Parent": AllContentHolder });
        for (var i = 0; i < jsonData.length; i++) {
            SinglePost = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePost", "Id": "SinglePost", "Parent": UploadForm });
            SinglePost.id = jsonData[i]["UploadId"] + "";
            SinglePostTitle = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostTitle", "Id": "SinglePostTitle", "Parent": SinglePost });
            TitleLeft = GHVHS.DOM.create({ "Type": "div", "Class": "TitleLeft", "Content": jsonData[i]["Username"], "Id": "TitleLeft", "Parent": SinglePostTitle });
            TitleRight = GHVHS.DOM.create({ "Type": "div", "Class": "TitleRight ", "Content": Uploader.formateSQLDate(jsonData[i]["UploadDateTime"]), "Id": "TitleRight ", "Parent": SinglePostTitle });
            if (jsonData[i]["Filename"].indexOf("mp4") < 0) {
                SinglePostImgContainer = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostImgContainer", "Id": "SinglePostImgContainer", "Parent": SinglePost });
                SinglePostImg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/" + jsonData[i]["Filename"], "Class": "SinglePostImg", "Id": "SinglePostImg", "Parent": SinglePostImgContainer });
            } else{
                SinglePostImgContainer = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostImgContainer", "Id": "SinglePostImgContainer", "Parent": SinglePost });
                UpLoadImageVideo = GHVHS.DOM.create({ "Type": "iframe", "Class": "SinglePostImg", "Id": "UpLoadImageVideo", "Src": "/img/" + jsonData[i]["Filename"], "Parent": SinglePostImgContainer });
                UpLoadImageVideo.style.width = SinglePostImgContainer.offsetWidth + "px";
                UpLoadImageVideo.style.maxWidth = "99%";
                UpLoadImageVideo.style.border = "none";
                UpLoadImageVideo.style.minHeight = "350px";
            }
            SinglePostContent = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostContent", "Id": "SinglePostContent", "Parent": SinglePost });
            SinglePostLocation = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostLocation", "Id": "SinglePostLocation", "Content": "Location: " + jsonData[i]["Location"], "Parent": SinglePostContent });
            SinglePostCaption = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostCaption", "Id": "SinglePostCaption", "Content": jsonData[i]["Caption"], "Parent": SinglePostContent });
            SinglePostLikeComment = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostLikeComment", "Id": "SinglePostLikeComment", "Parent": SinglePost });
            like = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostComment SinglePostlike", "Id": jsonData[i]["UploadId"], "Content": "Likes:" + jsonData[i]["Likes"], "Parent": SinglePostLikeComment });
            like.onclick = function () {
                var getLikes = this.innerHTML.replace("Likes:", "");
                var id = this.parentElement.parentElement.id;
                this.innerHTML = "Likes:" + (Number(getLikes) + 1);
                this.style.backgroundColor = "rgb(0, 102, 153)";
                this.style.color = "white";
                var getid = window.location.href.split("Details/");
                function updated() {
                    return;
                }
                GHVHS.DOM.send({ "URL": "/Api/upDateLikes/?likes=" + (Number(getLikes) + 1) + "&Id=" + id, "Callback": updated, "CallbackParams": [] });
            }
            View = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostComment", "Id": "View", "Content": "View Post", "Parent": SinglePostLikeComment });
            Comment = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePostComment", "Id": "Comment", "Content": "View Comments", "Parent": SinglePostLikeComment });
            View.onclick = function () {
                var getId = this.parentElement.parentElement.id;
                window.location.href = "/Uploader/Details/" + getId;
            }
            Comment.onclick = function () {
                if (this.className.indexOf("selected") < 0) {
                    this.className = "selected";
                    this.innerHTML = "Close Comments";
                    this.style.height = "24px";
                    var getId = this.parentElement.parentElement.id;
                    this.parentElement.parentElement.style.marginBottom = "360px";
                    var getCommentConaineter = this.parentElement.parentElement.querySelector(".SinglePostLikeComment");
                    var getAllButtons = getCommentConaineter.querySelectorAll(".SinglePostComment");
                    for (var q = 0; q < getAllButtons.length; q++) {
                        getAllButtons[q].style.height = "24px";
                        getAllButtons[q].style.border = "1px solid rgba(64, 0, 23,0.08)";

                    }
                    getCommentConaineter.style.height = "350px";
                    
                    function getComments(json, p) {

                        var jsonData2 = Uploader.decodeJson(json);
                        CommentPostContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CommentPostContainer", "Id": "CommentPostContainer", "Parent": p });
                        smallPostcomment = GHVHS.DOM.create({ "Type": "textarea", "Class": "smallPostcomment  text", "Style": "background-image:unset;", "Id": "smallPostcomment", "Parent": CommentPostContainer });
                        smallPostcomment.setAttribute("placeholder", "Enter Comments");
                        SendButtonPost = GHVHS.DOM.create({ "Type": "div", "Class": "SendButtonPost", "Id": "SendButtonPost", "Content": "Post", "Parent": CommentPostContainer });
                        SendButtonPost.onclick = function () {
                                var getComment = this.parentElement.querySelector(".smallPostcomment").value;
                                this.parentElement.querySelector(".smallPostcomment").value = "";
                                var getid = this.parentElement.parentElement.parentElement.id;
                                var getCurrentId = getid;

                                function AddComm(json, p) {
                                    while (p.firstChild) {
                                        p.removeChild(p.firstChild);

                                    }
                                    function redrawComments(json, p) {
                                        var usernamed = document.getElementById("userNAME").innerHTML;
                                        var jsonData2 = Uploader.decodeJson(json.data, "Y");
                                        Uploader.drawComments(jsonData2, p, usernamed);
                                    }
                                    GHVHS.DOM.send({ "URL": "/Api/Comments/?uploaderId=" + getId, "Callback": redrawComments, "CallbackParams": p });
                                }
                                var parent = this.parentElement.parentElement.querySelector(".commentContainers");
                                GHVHS.DOM.send({ "URL": "/Api/Comments/?uploaderId=" + getCurrentId + "&Comments=" + getComment + "&ToUpdate=Y", "Callback": AddComm, "CallbackParams": parent });
                         }

                        if (jsonData2[0]) {
                            commentContainers = GHVHS.DOM.create({ "Type": "div", "Class": "commentContainers", "Id": "commentContainers", "Parent": p });
                            backGroundElement = GHVHS.DOM.create({ "Type": "div", "Class": "backGroundElement", "Id": "backGroundElement", "Parent": commentContainers });
                            Uploader.drawComments(jsonData2, backGroundElement, username);
                        } else {
                            commentContainers = GHVHS.DOM.create({ "Type": "div", "Class": "commentContainers", "Id": "commentContainers", "Parent": p });
                            backGroundElement = GHVHS.DOM.create({ "Type": "div", "Class": "backGroundElement", "Id": "backGroundElement", "Parent": commentContainers });
                        }
                    }
                    GHVHS.DOM.send({ "URL": "/Api/Comments/?uploaderId=" + getId, "Callback": getComments, "CallbackParams": getCommentConaineter });

                } else {
                    this.className = "SinglePostComment";
                    var getId = this.parentElement.parentElement.id;
                    this.parentElement.parentElement.style.marginBottom = "8%";

                    var getCommentConaineter = this.parentElement.parentElement.querySelector(".SinglePostLikeComment");
                    getCommentConaineter.style.height = "44px";
                    var allComments = getCommentConaineter.querySelector(".commentContainers");
                    if (allComments) {
                        getCommentConaineter.removeChild(allComments);
                    }
                    var postComments = getCommentConaineter.querySelector(".CommentPostContainer");
                    getCommentConaineter.removeChild(postComments);
                    var getAllButtons = getCommentConaineter.querySelectorAll(".SinglePostComment");
                    for (var q = 0; q < getAllButtons.length; q++) {
                        getAllButtons[q].style.height = "20px";
                        getAllButtons[q].style.border = "unset";

                    }
                    this.innerHTML = "View Comments";
                }
            }
        }
    },
    drawComments: function (jsonData2, commentContainers, users) {
        for (var i = 0; i < jsonData2.length; i++) {
            singleComment = GHVHS.DOM.create({ "Type": "div", "Class": "singleComment", "Style": "width:80%;margin-left:10%;margin-top:2%;", "Id": "singleComment", "Parent": commentContainers });
            singleComment.id = jsonData2[i]["CommentID"];
            CommentHeader = GHVHS.DOM.create({ "Type": "div", "Class": "CommentHeader", "Id": "CommentHeader", "Parent": singleComment });
            CommentHarderLabel = GHVHS.DOM.create({ "Type": "div", "Class": "CommentHarderLabel", "Id": "CommentHarderLabel", "Parent": CommentHeader });
            CommentHarderLabel.innerHTML = "Comment By: " + jsonData2[i]["Username"] + " on " + Uploader.formateSQLDate(jsonData2[i]["Date"]);
            CommentHarderLabel.style.fontSize = "13px";
            CommentHarderLabel.style.width = "50%";
            if (users == jsonData2[i]["Username"]) {
                drawCommentIcons = GHVHS.DOM.create({ "Type": "div", "Class": "drawCommentIcons", "Id": "drawCommentIcons", "Parent": CommentHeader });
                drawCommentIcons.style.width = "20%";
                editIcon = GHVHS.DOM.create({ "Type": "img", "Class": "CommentIcon", "Id": "editIcon", "Src": "/img/edit.png", "Parent": drawCommentIcons });
                editIcon.onclick = function () {
                    var id = this.parentElement.parentElement.parentElement.id;
                    var getMessage = this.parentElement.parentElement.parentElement.querySelectorAll(".CommentMidDrift");
                    Uploader.EditMessage(id, getMessage[0].innerHTML);
                }
                deleteIcon = GHVHS.DOM.create({ "Type": "img", "Class": "CommentIcon", "Id": "deleteIcon", "Src": "/img/RedX.png", "Parent": drawCommentIcons });
                deleteIcon.onclick = function () {
                    var id = this.parentElement.parentElement.parentElement.id;
                    Uploader.DrawConfirmButton(id);
                }
                if (document.getElementById("MainContent").offsetWidth < 1500) {
                    drawCommentIcons.style.width = "25%";
                    drawCommentIcons.style.marginLeft = "15%";

                }
            }
            if (document.getElementById("MainContent").offsetWidth < 1500) {
                CommentHarderLabel.style.fontSize = "16px";

            }
            CommentMidDrift = GHVHS.DOM.create({ "Type": "div", "Class": "CommentMidDrift", "Id": "CommentMidDrift", "Parent": singleComment });
            CommentMidDrift.innerHTML = "" + jsonData2[i]["Comment"];

        }
    },
    SingleView: function (json, username) {
        var data = { data: json };
        var jsonData = Uploader.decodeJson(data);
        var masterElem = document.getElementById("MainContent");
       
        document.getElementById("headerPartOneTwo").style.backgroundColor = "rgba(64, 0, 23,0.06)";
        masterElem.style.marginTop = "-1.2%";
        document.getElementById("canvas").style.backgroundColor = "rgba(64, 0, 23,0.06)";
        UploadTitle = GHVHS.DOM.create({ "Type": "div", "Class": "UploadTitle", "Id": "UploadTitle",  "Style": "width:60%;margin-left:20%;", "Parent": masterElem });
        Title = GHVHS.DOM.create({ "Type": "div","Content":"View Post","Style": "width:60%;margin-left:20%;float:left;", "Parent": UploadTitle });
        if (username == jsonData[0]["Username"]) {
            var editImage = GHVHS.DOM.create({ "Type": "img", "Src": " /img/dots.png", "Id": "editImage", "Class": "editImage", "Parent": UploadTitle });
            Uploader.drawConvoDropdowns(editImage, UploadTitle, [{"Label":"Edit Post"}, {"Label":"Delete Post"}], "75px", "100px");
        }
        UploadForm = GHVHS.DOM.create({ "Type": "div", "Class": "UploadForm", "Id": "UploadForm", "Parent": masterElem });
        UploadForm.style.marginTop = "0%";
        if (document.getElementById('MainContent').offsetWidth > 1500) {
            BackButton = GHVHS.DOM.create({ "Type": "div", "Class": "BackButton", "Id": "BackButton", "Parent": document.getElementById('MainContent') });
            BackButton.style.position = "absolute";
            BackButton.style.left = "20%";
            BackButton.style.top = "4%";
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "lodingImg", "Src": "/img/backArrowTrans.png", "Style": "Height:20px;", "Parent": BackButton });
            BackButton.innerHTML += "Back To All Uploads";
            BackButton.onclick = function () {
                window.location.href = "/Uploader/Index";
            }
        }
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "MainInputHeader", "Id": "MainInputHeader","Style":"height:auto;padding-bottom:0.8%;", "Content": "Uploaded On: " + Uploader.formateSQLDate(jsonData[0]["UploadDateTime"]), "Parent": UploadForm });
        MainInputHeader.innerHTML += "<br> Uploaded By: " + jsonData[0]["Username"];
        MainInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "MainInputContainer", "Id": "MainInputContainer", "Style": "height:60%;", "Parent": UploadForm });
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseFieldView", "Id": "MainInputHeader", "Content": "Location:",  "Parent": UploadForm });
        CapInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CapInputContainerView", "Id": "location", "Content": jsonData[0]["Location"], "Style": "Height:5%; Margin-top:0px;Margin-bottom:0px;", "Parent": UploadForm });
        if (jsonData[0]["Filename"].indexOf("mp4") < 0){
           UpLoadImage = GHVHS.DOM.create({ "Type": "img", "Class": "UpLoadImageView", "Id": "UpLoadImage", "Src": "/img/" + jsonData[0]["Filename"] + "", "Style": "height:100%;", "Parent": MainInputContainer });
        }else{
            UpLoadImageVideo = GHVHS.DOM.create({ "Type": "iframe", "Class": "UpLoadImageView", "Id": "UpLoadImageVideo", "Src": "/img/" + jsonData[0]["Filename"], "Parent": MainInputContainer });
            UpLoadImageVideo.style.width = MainInputContainer.offsetWidth + "px";
            UpLoadImageVideo.style.maxWidth = "100%";
            UpLoadImageVideo.style.border = "none";
            UpLoadImageVideo.style.marginTop = "0px";
            UpLoadImageVideo.style.maxHeight = "99%";
            UpLoadImageVideo.style.border = "none";
            UpLoadImageVideo.style.height = MainInputContainer.offsetHeight + "px";
        }
        MainInputHeader = GHVHS.DOM.create({ "Type": "div", "Class": "ReverseFieldView", "Id": "MainInputHeader", "Content": "Caption:", "Parent": UploadForm });
        CapInputContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CapInputContainerView ", "Id": "Caption", "Content": jsonData[0]["Caption"], "Parent": UploadForm });
        
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
                    singleComment.id = jsonData2[i]["CommentID"];
                    CommentHeader = GHVHS.DOM.create({ "Type": "div", "Class": "CommentHeader", "Id": "CommentHeader", "Parent": singleComment });
                    CommentHarderLabel = GHVHS.DOM.create({ "Type": "div", "Class": "CommentHarderLabel", "Id": "CommentHarderLabel", "Parent": CommentHeader });
                    CommentHarderLabel.innerHTML = "Comment By: " + jsonData2[i]["Username"] + " on " + Uploader.formateSQLDate(jsonData2[i]["Date"]);
                    if (username == jsonData2[i]["Username"]) {
                        drawCommentIcons = GHVHS.DOM.create({ "Type": "div", "Class": "drawCommentIcons", "Id": "drawCommentIcons", "Parent": CommentHeader });
                        editIcon = GHVHS.DOM.create({ "Type": "img", "Class": "CommentIcon", "Id": "editIcon", "Src": "/img/edit.png", "Parent": drawCommentIcons });
                        editIcon.onclick = function () {
                            var id = this.parentElement.parentElement.parentElement.id;
                            var getMessage = this.parentElement.parentElement.parentElement.querySelectorAll(".CommentMidDrift");
                            Uploader.EditMessage(id, getMessage[0].innerHTML);
                        }
                        deleteIcon = GHVHS.DOM.create({ "Type": "img", "Class": "CommentIcon", "Id": "deleteIcon", "Src": "/img/RedX.png", "Parent": drawCommentIcons });
                        deleteIcon.onclick = function () {
                            var id  = this.parentElement.parentElement.parentElement.id;
                            Uploader.DrawConfirmButton(id);
                        }
                        if (document.getElementById("MainContent").offsetWidth < 1500) {
                            drawCommentIcons.style.width = "25%";
                            drawCommentIcons.style.marginLeft = "15%";

                        }
                    }
                    if (document.getElementById("MainContent").offsetWidth < 1500) {
                        CommentHarderLabel.style.fontSize = "16px";
                        
                    }
                    CommentMidDrift = GHVHS.DOM.create({ "Type": "div", "Class": "CommentMidDrift", "Id": "CommentMidDrift", "Parent": singleComment });
                    CommentMidDrift.innerHTML = "" + jsonData2[i]["Comment"];
                  
                }
            }
        }
        GHVHS.DOM.send({ "URL": "/Api/Comments/?uploaderId=" + jsonData[0]["UploadId"], "Callback": getComments, "CallbackParams": [] });
        singleComment = GHVHS.DOM.create({ "Type": "div", "Class": "singleComment", "Id": "singleComment2", "Style": "min-height:0px;height: 0px; display:none; ", "Parent": CommentConatiner });
        CommentMidDrift = GHVHS.DOM.create({ "Type": "TextArea", "Class": "CommentMidDrift text", "Id": "CommentMidDriftUp", "Style": "width: 100%;height: 60%;  background-Image:none; margin-bottom:2%; ", "Parent": singleComment });
        CommentMidDrift.setAttribute("placeholder", "Comment");
        CommentFooter = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "CommentFooter","Parent": singleComment });
        Post = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Id": "Post", "Style": "width:30%; padding-bottom:3%;background-color:rgb(63, 80, 104);", "Content": "Post Comment", "Parent": singleComment });
        if (document.getElementById("MainContent").offsetWidth < 1500) {
            Post.style.paddingBottom = "5%";
        }
        Post.onclick = function () {
            var getComment = document.getElementById("CommentMidDriftUp").value;
            var getid = window.location.href.split("Details/");
            var getCurrentId = getid[1];
            function AddComm() {
                window.location.href = window.location.href;
            }
            GHVHS.DOM.send({ "URL": "/Api/Comments/?uploaderId=" + getCurrentId + "&Comments=" + getComment + "&ToUpdate=Y", "Callback": AddComm, "CallbackParams": [] });
        }
    },
    drawFilesSearch: function (optionElem, search) {
        if (search){
            PreviousSearch = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "PreviousSearch" , "Content": search, "Parent": optionElem });
        }
        SearcButtonPost = GHVHS.DOM.create({ "Type": "div", "Class": "SearcButtonPost", "Id": "SearcButtonPost", "Style": "display:none;transition: height .25s ease; display:none; height:1px; ", "Content": "Search", "Parent": optionElem });
        SearcButtonPost.onclick = function () {
            var currentLink = window.location.href;
            var getFilter = document.getElementById("Filter");
            var PreviousSearchValue = document.getElementById("PreviousSearch");
            if (!PreviousSearchValue){
                if (currentLink.indexOf("?") >= 0) {
                    currentLink += "&Search=" + getFilter.value;
                } else {
                    currentLink += "?Search=" + getFilter.value;
                }
            } else {
                currentLink =  currentLink.replace("Search=" + PreviousSearchValue.innerHTML, "Search=" + getFilter.value);
            }
            window.location.href = currentLink;
        }
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "transition: height .25s ease; display:none; height:1px;text-align:center;margin-top:0.1%;margin-bottom:0.5%;margin-left:22.5%;Width:55%;", "Parent": optionElem });
        Filter.setAttribute("placeholder", "Type To Search....");
        Filter.setAttribute("autocomplete", "Off");
        Filter.onfocus = function () {

            this.style.boxShadow = "2px 2px 6px grey";
        }
        Filter.onblur = function () {
            this.style.boxShadow = "0px 0px 0px grey";
        }
       
        Filter.onkeyup = function () {
            var getClearbutt = document.getElementById("Clearbutton");
            if (this.value != "") {
                this.style.boxShadow = "2px 2px 6px grey";
                if (!getClearbutt) {
                    GHVHS.DOM.drawClearButton(this);
                }
            } else {
                if (getClearbutt) {
                    getClearbutt.click();
                }
            }
           

        }
    },

    DrawConfirmButton: function ( ID, PostOrComment) {
        
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        canvas2.onclick = function (e) {
            if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                document.getElementById('canvas').removeChild(this);
            }
        }
        canvas2.style.height = "330%";
        loader = GHVHS.DOM.create({ "Type": "div", "Class": "loader", "Id": "loader", "Parent": canvas2 });
        ConfirmRemoveContainer = GHVHS.DOM.create({ "Type": "div", "Parent": loader, "Class": "ConfirmRemoveContainer" });
        ConfirmRemoveContainer.style.width = (canvas.offsetWidth * 0.3) - 20 + "px";
        ConfirmRemoveContainer.style.left = "34%";
        ConfirmRemove = GHVHS.DOM.create({ "Type": "div", "Parent": ConfirmRemoveContainer, "Content": "Are you sure you want to remove this Comment?", "Class": "ConfirmRemove" });
        ConfirmRemove.style.lineHeight = "2em";
        Confirm = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": "Confirm", "Parent": ConfirmRemove, "Content": "Confirm" });
        if (PostOrComment) {
            ConfirmRemove.innerText = "Are you sure you want to remove this post?";
            Confirm = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": "Confirm", "Parent": ConfirmRemove, "Content": "Confirm" });
            Confirm.onclick = function () {
                GHVHS.DOM.DrawSmallLoader2();
                function redrawPage() {
                    window.location.href = "/Uploader/Index";
                }
                GHVHS.DOM.send({ "URL": "/Uploader/UpdateUpload/?UploadId=" + ID + "&ScriptAs=Delete", "Callback": redrawPage, "CallbackParams": [] });
            }
           
        } else {
            Confirm.onclick = function () {
                GHVHS.DOM.DrawSmallLoader2();
                function redrawPage() {
                    window.location.href = window.location.href;
                }
                GHVHS.DOM.send({ "URL": "/Api/Comments/?Cid=" + ID + "&ToUpdate=Delete", "Callback": redrawPage, "CallbackParams": [] });
            }
        }
        Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Parent": ConfirmRemove, "Content": "Cancel" });
        Cancel.style.marginTop = "5px";
    },
    EditMessage: function (messageId, comment, PostOrComment) {
        
        var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Edit Comment", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            if (document.getElementById("ViewFile")) {
                document.getElementById("ViewFile").style.display = "unset";
            }
            canvas2.parentElement.removeChild(canvas2);

        }
        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        if (PostOrComment) {
            EventLable.innerHTML = "Edit Post";
            var messageArea2 = GHVHS.DOM.create({ "Type": "input", "Class": "messageArea", "Id": "location","Style":"height:10%;", "Parent": FrameBody });
            messageArea2.value = PostOrComment;
        }
        var messageArea = GHVHS.DOM.create({ "Type": "textarea", "Class": "messageArea", "Id": "messageArea", "Parent": FrameBody });
        var theValue = comment;
        var value = theValue.split("<div");
        messageArea.value = value[0];
        var sendButton = GHVHS.DOM.create({ "Type": "div", "Class": "sendButton", "Id": "sendButton", "Content": "Save", "Parent": FrameBody });
        if (!PostOrComment) {
            sendButton.onclick = function () {
                function UpdatedList(json) {
                    window.location.href = window.location.href;
                }
                var temp1 = GHVHS.DOM.send({ "URL": "/Api/Comments/?Cid=" + messageId + "&Comments=" + messageArea.value + "&ToUpdate=Update", "Callback": UpdatedList, "CallbackParams": [] });

            }
        } else {
            sendButton.onclick = function () {
                function UpdatedList(json) {
                    window.location.href = window.location.href;
                }
                var loco = messageArea2.value;
                var caption = document.getElementById("messageArea").value;
                var temp1 = GHVHS.DOM.send({ "URL": "/Uploader/UpdateUpload/?UploadId=" + messageId + "&Caption=" + caption + "&Location=" + loco + "&ScriptAs=Update", "Callback": UpdatedList, "CallbackParams": [] });

            }
        }
    },
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
        DropDown.style.left = (filter.offsetLeft - 25) + "px";
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
            if (list[i]["Label"] == "Edit Post"){
                SingleOption.onclick = function () {
                    document.getElementById("editImage").click();
                    var getID = window.location.href.split("Details/");
                    var getCaption = document.getElementById("Caption").innerHTML;
                    var getLocation = document.getElementById("location").innerHTML;
                    Uploader.EditMessage(getID[1], getCaption, getLocation);
                }
            } else if (list[i]["Label"] == "Delete Post") {
                SingleOption.onclick = function () {
                    document.getElementById("editImage").click();
                    var getID = window.location.href.split("Details/");
                    Uploader.DrawConfirmButton(getID[1], "Y");
                }
            }
        }
    },
};