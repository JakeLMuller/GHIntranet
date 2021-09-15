var app = {
    SignIn: function (signIn, closeMenu,slideUP,Type) {
        if (!Type) {
            
            slideUP.style.top = "5%";
            if (!document.getElementById("slideUPSub")) {
                closeMenu.click();
                var slideUPSub = GHVHS.DOM.create({ "Type": "div", "Class": "slideUPSub", "Id": "slideUPSub", "Parent": slideUP });
            } else {
                var slideUPSub = document.getElementById("slideUPSub");
            }
            
            var TopMenu = GHVHS.DOM.create({ "Type": "div", "Class": "TopMenu", "Id": "TopMenu", "Parent": slideUPSub });
            var Filler = GHVHS.DOM.create({ "Type": "div", "Class": "Filler", "Id": "Filler", "Parent": slideUPSub });
            var close = GHVHS.DOM.create({ "Type": "img", "Src": "/img/xWhite.png", "Style": "", "Class": "right2", "Id": "close", "Parent": slideUPSub });
            close.onclick = function () {
                slideUP.style.top = "120%";
                setTimeout(function () {
                    while (slideUP.firstChild) {
                        slideUP.removeChild(slideUP.firstChild);
                    }
                }, 500);
            }
            var LoginForm = GHVHS.DOM.create({ "Type": "div", "Id": "LoginForm", "Style": "background-color:white;", "Class": "LoginForm", "Parent": slideUPSub });
            var Title = GHVHS.DOM.create({ "Type": "img", "Id": "Title", "Class": "Title", "Src": "/img/GarnetLogo.png", "Style": "color:rgba(64, 0, 23,0.7);height:12%;Width:45%;margin-left:27%;", "Content": "Log In/Sign Up", "Parent": LoginForm });
            app.drawInputs({ "labels": ["Username", "Password"], "Elem": LoginForm, "Flag": "Y" });
            var button = GHVHS.DOM.create({ "Type": "div", "Id": "button", "Class": "button", "Content": "Log In", "Parent": slideUPSub });
            var button2 = GHVHS.DOM.create({ "Type": "div", "Id": "button", "Class": "button", "Content": "Sign Up", "Parent": slideUPSub });
            button2.style.marginTop = "3%";
            button2.onclick = function () {
                while (slideUPSub.firstChild) {
                    slideUPSub.removeChild(slideUPSub.firstChild);
                }
                app.SignIn(signIn, closeMenu, slideUP, "Y");
            }
        } else {
            var slideUPSub = document.getElementById("slideUPSub");
            var TopMenu = GHVHS.DOM.create({ "Type": "div", "Class": "TopMenu", "Id": "TopMenu", "Parent": slideUPSub });
            var Filler = GHVHS.DOM.create({ "Type": "div", "Class": "Filler", "Id": "Filler", "Parent": slideUPSub });
            var close = GHVHS.DOM.create({ "Type": "img", "Src": "/img/xWhite.png", "Style": "", "Class": "right2", "Id": "close", "Parent": slideUPSub });
            close.onclick = function () {
                slideUP.style.top = "120%";
                setTimeout(function () {
                    while (slideUP.firstChild) {
                        slideUP.removeChild(slideUP.firstChild);
                    }
                }, 500);
            }
            var LoginForm = GHVHS.DOM.create({ "Type": "div", "Id": "LoginForm", "Style": "background-color:white;", "Class": "LoginForm", "Parent": slideUPSub });
            app.drawInputs({ "labels": ["Username", "Password", "Confirm Password", "Email", "Confirm Email", "Security Question", "Answer"], "Elem": LoginForm, "Flag": "Small"});
            var button = GHVHS.DOM.create({ "Type": "div", "Id": "button", "Class": "button", "Content": "Log In", "Parent": slideUPSub });
            button.onclick = function () {
                while (slideUPSub.firstChild) {
                    slideUPSub.removeChild(slideUPSub.firstChild);
                }
                app.SignIn(signIn, closeMenu, slideUP);
            }
            var button2 = GHVHS.DOM.create({ "Type": "div", "Id": "button", "Class": "button", "Content": "Sign Up", "Parent": slideUPSub });
            button2.style.marginTop = "3%";
        }
        
        

    },
    drawMenuNav: function (menuNav) {
        var colorbg = GHVHS.DOM.create({ "Type": "div", "Class": "colorbg", "Parent": menuNav });
        var Filler = GHVHS.DOM.create({ "Type": "div", "Class": "Filler", "Parent": colorbg });
        var SignIn = GHVHS.DOM.create({ "Type": "div", "Class": "SignIn", "Content": "Sign In", "Parent": Filler });
        var slideUp = GHVHS.DOM.create({ "Type": "div", "Class": "slideUp", "Id": "slideUp", "Parent": document.getElementById("canvas") });
        var right2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/whiteMenu.png","Style":"Width:6%;", "Id": "right2", "Class": "right2", "Parent": colorbg });
        right2.onclick = function () {
            var getRight = document.getElementById("right");
            if (getRight.className == "right") {
                app.sildeMenu(menuNav);
            } else {
                getRight.click();
            }
        };
        SignIn.onclick = function () {
            app.SignIn(this, right2, slideUp);
        };
        var Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Parent": colorbg });
        Filter.setAttribute("placeholder", "Search Garnet Health");
        var Links = ["My Chart","Pay Bill","Blog","Directions","Live Chat","Check In","Make An Appointment"];
        for (var i = 0; i < Links.length; i++) {
            var link = GHVHS.DOM.create({ "Type": "div", "Class": "link", "Parent": colorbg });
            link.innerHTML = Links[i];
        }
        
    },
    TopNav: function (page) {
        var mainElement = document.getElementById("topNav");
        var left = GHVHS.DOM.create({ "Type": "img", "Src": "/img/GarnetLogo.png", "Id": "left", "Class": "left", "Parent": mainElement });
        var middle = GHVHS.DOM.create({ "Type": "div", "Id": "middle", "Class": "middle", "Parent": mainElement });
        var msg = GHVHS.DOM.create({ "Type": "div", "Id": "msg", "Class": "msg", "Parent": middle });
        var right = GHVHS.DOM.create({ "Type": "img", "Src": "/img/menu.png", "Id": "right", "Class": "right", "Parent": mainElement });
        var menuNav = GHVHS.DOM.create({ "Type": "div", "Id": "menuNav", "Class": "menuNav", "Parent": mainElement });
        app.drawMenuNav(menuNav);
        right.onclick = function () {
            if (this.className == "right" ) {
                this.className = "rightClicked";
            } else {
                this.className = "right";
            }
            
            app.sildeMenu(menuNav)
        };
        var getCanvas = document.getElementById('canvas');
        getCanvas.addEventListener('touchstart', handleTouchStart);
        getCanvas.addEventListener('touchmove', handleTouchMove,false);
        
        var xDown = null;
        var yDown = null;

        function getTouches(evt) {
            return evt.touches ||             // browser API
                   evt.originalEvent.touches;
        }
        function handleTouchStart(evt) {
            if (document.getElementById('main')) {
                return;
            }
            const firstTouch = getTouches(evt)[0];
            xDown = firstTouch.clientX;
            yDown = firstTouch.clientY;
        }
        var checkDiff = "";
        var SwipeLeft = "";
        var inTransition = "";
        var otherWay = "";
        function handleTouchMove(evt) {
            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;
            var xDiff = xUp - xDown;
            var getCanvas = document.getElementById("canvas");
            var getIcon = document.getElementById("right");
            var DropDowned = document.getElementById('menuNav');
            var YDiff = yUp - yDown;
           
                // to slide drop down menu back

                if (DropDowned.style.left == "40%") {
                    if (xDiff > (getCanvas.offsetWidth * .30)) {
                        console.log(xDiff);
                        app.sildeMenu(DropDowned);
                    }
                } else{ 
                    if (xDiff < 0) {
                        console.log(xDiff);
                        if (xDiff < (-getCanvas.offsetWidth * .30)) {
                            app.sildeMenu(DropDowned);
                        }
                    }
            }
        }


    },
    sildeMenu: function (menuNav) {
        if (menuNav.style.left == "120%" || menuNav.style.left == "") {
            menuNav.style.left = "40%";
        } else {
            var getRight = document.getElementById("right");
            if (getRight.className == "right") {
                menuNav.style.left = "120%";
            }else {
                getRight.click();
            }
            
        }

    },
    DrawMainContent: function (page) {
        var mainElement = document.getElementById("mainContent");
        if (page == "Symtom Checker") {
            var Circle = GHVHS.DOM.create({ "Type": "div", "Id": "Circle", "Class": "Circle", "Parent": mainElement });
            var Title = GHVHS.DOM.create({ "Type": "div", "Id": "Title", "Class": "Title", "Content": "We need to know alittle about this person before getting started.", "Parent": Circle });
            app.drawInputs({ "labels": ["Age", "Gender"], "Elem": Circle });
            var button = GHVHS.DOM.create({ "Type": "div", "Id": "button", "Class": "button","Content":"Continue", "Parent": mainElement });
           
        } else if (page == "Location") {
            var SubHeader = GHVHS.DOM.create({ "Type": "div", "Id": "SubHeader", "Class": "SubHeader", "Parent": mainElement });
            var Urgent = GHVHS.DOM.create({ "Type": "div", "Id": "SignIn", "Class": "whiteButton", "Content": "Urgent Care", "Parent": SubHeader });
            var SubHeader = GHVHS.DOM.create({ "Type": "div", "Id": "SignIn", "Class": "whiteButton", "Content": "Emergency Room", "Parent": SubHeader });
            for (var i = 0; i < 3; i++) {
                var location = GHVHS.DOM.create({ "Type": "img", "Id": "location", "Class": "location", "Parent": mainElement });
                location.src = "/img/ormcLocation.png";
                var locoInfo = GHVHS.DOM.create({ "Type": "div", "Id": "locoInfo", "Class": "locoInfo", "Parent": mainElement });
                var locoName = GHVHS.DOM.create({ "Type": "div", "Id": "locoName", "Content": "Orange Regional Medical Center", "Class": "locoName", "Parent": locoInfo });
                var city = GHVHS.DOM.create({ "Type": "div", "Id": "city", "Content": "Middletown", "Class": "city", "Parent": locoInfo });
                var locoAddress = GHVHS.DOM.create({ "Type": "div", "Id": "locoAddress", "Content": "707 E Main St, Middletown, NY 10940", "Class": "locoAddress", "Parent": locoInfo });
                var hours = GHVHS.DOM.create({ "Type": "div", "Id": "hours", "Class": "hours", "Parent": locoInfo });
                var Open = GHVHS.DOM.create({ "Type": "div", "Id": "Open", "Class": "Open", "Parent": locoInfo });
                Open.innerHTML = "<strong>Open Today:</strong> Open 24 hours";
                var lineSize = GHVHS.DOM.create({ "Type": "div", "Id": "lineSize", "Class": "lineSize", "Content": "0 People in Line", "Parent": locoInfo });
                var button = GHVHS.DOM.create({ "Type": "div", "Id": "button", "Style": "Width:50%;padding-top:1%;padding-bottom:5%;", "Class": "button", "Content": "Make An Appointment", "Parent": locoInfo });
            }
        } else if (page == "Live Chat") {
            var videoContainer = GHVHS.DOM.create({ "Type": "div", "Id": "videoContainer", "Class": "videoContainer", "Parent": mainElement });
            var labelC = GHVHS.DOM.create({ "Type": "div", "Id": "labelC", "Class": "labelC", "Parent": videoContainer });
            var TopLabel = GHVHS.DOM.create({ "Type": "div", "Id": "TopLabel", "Class": "TopLabel", "Parent": labelC });
            TopLabel.innerHTML = "Video Chat with a Doctor";
            var bottomLabel = GHVHS.DOM.create({ "Type": "div", "Id": "bottomLabel", "Class": "bottomLabel", "Parent": labelC });
            bottomLabel.innerHTML = "on my Mobile Device";
            var WeirdCircle = GHVHS.DOM.create({ "Type": "div", "Id": "WeirdCircle", "Class": "WeirdCircle", "Parent": videoContainer });
            var IconVideo = GHVHS.DOM.create({ "Type": "img", "Src": "/img/videoChat.png", "Id": "IconVideo", "Class": "IconVideo", "Parent": WeirdCircle });
            var videoContainer = GHVHS.DOM.create({ "Type": "div", "Id": "videoContainer", "Class": "videoContainer", "Parent": mainElement });
            var labelC = GHVHS.DOM.create({ "Type": "div", "Id": "labelC", "Class": "labelC", "Parent": videoContainer });
            var TopLabel = GHVHS.DOM.create({ "Type": "div", "Id": "TopLabel", "Class": "TopLabel", "Parent": labelC });
            TopLabel.innerHTML = "Video Chat with a Doctor";
            var bottomLabel = GHVHS.DOM.create({ "Type": "div", "Id": "bottomLabel", "Class": "bottomLabel", "Parent": labelC });
            bottomLabel.innerHTML = "At an ORMC Station";
            var WeirdCircle = GHVHS.DOM.create({ "Type": "div", "Id": "WeirdCircle", "Class": "WeirdCircle", "Parent": videoContainer });
            var IconVideo = GHVHS.DOM.create({ "Type": "img", "Src": "/img/textIcon.png", "Id": "IconVideo", "Class": "IconVideo", "Parent": WeirdCircle });
        } else if (page == "Doctors") {

        }
        
    },
    drawInputs: function (p) {
        labels = p.labels;
        Elem = p.Elem;
        for (var i = 0; i < labels.length; i++) {
            var fieldHolder = GHVHS.DOM.create({ "Type": "div", "Id": "fieldHolder", "Class": "fieldHolder", "Parent": Elem });
            var label = GHVHS.DOM.create({ "Type": "div", "Id": "Lable", "Class": "Lable", "Parent": fieldHolder });
            label.innerHTML = labels[i];
            if (p.Flag) {
                if (p.Flag == "Small") {
                    fieldHolder.style.height = "9.5%";
                    label.style.color = "rgba(64, 0, 23, 0.7)";
                } else {
                    fieldHolder.style.height = "15%";
                    label.style.color = "rgba(64, 0, 23, 0.7)";
                }
               
            }
            if (labels[i] == "Password") {
                var inputField = GHVHS.DOM.create({ "Type": "input","InputType":"password", "Id": "inputField", "Class": "inputField", "Parent": fieldHolder });
                inputField.id = labels[i];
            } else {
                var inputField = GHVHS.DOM.create({ "Type": "input", "Id": "inputField", "Class": "inputField", "Parent": fieldHolder });
                inputField.id = labels[i];
               
            }
            

        }
    },
    DrawFootNav: function (selected) {
        var mainElement = document.getElementById("bottomNav");
        var navHolder = ["Symtom Checker", "Location", "Live Chat", "Doctors"];
        var img = ["/img/human.png", "/img/location.png", "/img/chatanywhere.png", "/img/doctor.png"];
        for (var i = 0; i < navHolder.length; i++) {
            var IconHolder = GHVHS.DOM.create({ "Type": "div", "Id": "IconHolder", "Class": "IconHolder", "Parent": mainElement });
            IconHolder.id = navHolder[i];
            var icon = GHVHS.DOM.create({ "Type": "img", "Id": "icon", "Class": "icon", "Parent": IconHolder });
            icon.src = img[i];
            if (img[i] == "/img/location.png") {
                icon.style.width = "20px";
                icon.style.paddingLeft = "5px";
                icon.style.paddingRight = "5px";
                
            }
            if (navHolder[i] == selected) {
                icon.style.backgroundColor = "#ffe6e6";
            }
            IconHolder.onclick = function () {
                var getMainContainer = document.getElementById("mainContent");
                var getall = this.parentElement.querySelectorAll(".IconHolder");
                for (var i = 0; i < getall.length; i++) {
                    var getIcon = getall[i].querySelectorAll(".icon");
                    if (getall[i].id == this.id) {
                        getIcon[0].style.backgroundColor = "#ffe6e6";
                    } else {
                        getIcon[0].style.backgroundColor = "";
                    }
                    
                }
                while (getMainContainer.firstChild) {
                    getMainContainer.removeChild(getMainContainer.firstChild);
                }
                app.DrawMainContent(this.id);
            }
            
        }
    }


};