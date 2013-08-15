var controllers = (function () {
    var rootUrl = "http://localhost:2761/api/";
    var partnerName;
    var currentConversation;
    var selector;

    var Controller = Class.create({
        init: function (selector) {
            this.selector = selector;
            this.persister = persisters.get(rootUrl);
            this.initPubNub();
        },

        initPubNub: function () {
            this.pubnub = PUBNUB.init({
                publish_key: 'pub-c-114ac428-67b8-490a-93d0-3a210895d407',
                subscribe_key: 'sub-c-ecacb7d2-04c0-11e3-a005-02ee2ddab7fe'
            });
            this.subscribeNotificationOnUsers();
            
        },

        loadUI: function () {
             //Uncomment when persisters are working
            if (this.persister.isUserLoggedIn()) {
                this.loadChatUI(this.selector);
            }
            else {
                this.loadLoginFormUI(this.selector);
            }

            // debug
            ////this.loadChatUI(selector);
            //this.loadLoginFormUI(selector);

            this.attachUIEventHandlers(this.selector);
        },

        loadLoginFormUI: function () {
            var loginFormHtml = ui.buildLoginForm();
            $(this.selector).html(loginFormHtml);
        },
        registerSingleUser: function(){
            var user = {
                Username: "Pepa",
                PasswordHash: "pepa"
            }

            this.persister.users.register(user,function () {
                console.log("Success");
            });
        },
        loginSingleUser: function () {
            var user = {
                Username: "Pepa",
                PasswordHash: "pepa"
            }

            this.persister.users.login(user, function () {
                console.log("Success login");
            });

        },

        loadUsersList: function (users) {
            var chatUIHtml = ui.buildChatUI("someName", users);
            $(this.selector).html(chatUIHtml);
        },

        loadChatUI: function () {
            var self = this;
            
            this.persister.users.getAll(function (users) {

                self.loadUsersList(users);

            }, function (err) {
                console.log(err);
            });
        }
        ,
        getAllUsers: function () {
            this.persister.users.getAll(function (users)
            {
                for (var i = 0; i<users.length; i += 1)
                {
                    //$(document).append(users[i].Username);
                    console.log(users[i].Username);
                }
                
            });
            
        },

        getChannelName: function () {
            var channelName = "";
            var firstUser = localStorage.getItem("Username");
            if (firstUser < partnerName) {
                channelName = firstUser + "-" + partnerName + "-channel";
            } else {
                channelName = partnerName + "-" + firstUser + "-channel";
            }

            return channelName;
        },

        createNotification: function (data) {
            var self = this;
            var channelName = this.getChannelName();

            this.pubnub.subscribe({
                channel: channelName,
                callback: function (message) {
                    console.log(message);
                    self.updateConversation("#content");
                    //not
                }
            });
        },
        subscribeNotificationOnUsers: function (){
            var self = this;

            this.pubnub.subscribe({
                channel: "New-Users",
                callback: function (message) {
                    console.log(message);
                    self.loadChatUI();
                }
            });
        },

        subsribeOwnChannelForNotification: function(){
            var self = this;
            var username = localStorage.getItem("Username");

            console.log(username);

            this.pubnub.subscribe({
                channel: username + "-channel",
                callback: function (message) {
                    console.log(message);
                    $("#" + message).css("background-color", "yellow");
                }
            });
        },

        startConversation: function (success) {
            var self = this;
            var conversation = {
                FirstUser: { Username: localStorage.getItem("Username") },
                SecondUser: { Username: partnerName }
            };

            console.log(conversation);
            this.createNotification(conversation);

            this.persister.conversation.start(conversation, function (data) {
                var messages = data.Messages;

                var chatHtml = ui.buildConversationWindow(messages, partnerName);
                console.log(chatHtml);
                
                // append new conversation
                $(self.selector).append(chatHtml);

                // save conversation
                currentConversation = data;
                success();
            });
        },

        updateConversation: function () {
            var self = this;

            this.persister.message.getByConversation(currentConversation.Id, function (messages) {
                var chatHtml = ui.buildConversationWindow(messages, partnerName);
                console.log(chatHtml);
                console.log(messages);
                // append new conversation

                //clear the previous
                $(self.selector).find("#chatWindow").remove();

                $(self.selector).append(chatHtml);

                // scroll to bottom
                var objDiv = document.getElementById("msgContent");
                objDiv.scrollTop = objDiv.scrollHeight;

                $("#textInput").focus();
            });
        },

        attachUIEventHandlers: function () {
            
            var self = this;
            var wrapper = $(self.selector);

            // switch login and register forms
            wrapper.on("click", "#btn-show-login", function () {
                wrapper.find(".button.selected").removeClass("selected");
                $(this).addClass("selected");
                wrapper.find("#login-form").show();
                wrapper.find("#register-form").hide();
            });
            wrapper.on("click", "#btn-show-register", function () {
                wrapper.find(".button.selected").removeClass("selected");
                $(this).addClass("selected");
                wrapper.find("#register-form").show();
                wrapper.find("#login-form").hide();
            });

            // register new user
            wrapper.on("click", "#btn-register", function () {
                // upload profile picture
                ImageUploader.uploadImage("file-upload", function (url) {
                    var user = {
                        Username: $(self.selector).find("#tb-register-username").val(),
                        PasswordHash: $(self.selector + " #tb-register-password").val(),
                        ProfilePictureUrl: url
                    }

                    self.persister.users.register(user, function () {
                        self.pubnub.publish({
                            channel: "New-Users",
                            message: "new user registered"

                        });

                        window.location.reload();
                        //localStorage.clear();
                    }, function (err) {
                        wrapper.find("#error-messages").text(err.responseJSON.Message);
                    });
                    return false;
                });
                
            });

            // login existing user
            wrapper.on("click", "#btn-login", function () {
                var user = {
                    Username: $(self.selector + " #tb-login-username").val(),
                    PasswordHash: $(self.selector + " #tb-login-password").val()
                }

                self.persister.users.login(user, function () {
                    self.loadChatUI();
                    self.subsribeOwnChannelForNotification();

                }, function (err) {
                    wrapper.find("#error-messages").text(err.responseJSON.Message);
                });
                return false;
            });

            // get partner name and start conversation
            wrapper.on("click", "#usersList p", function () {
                // get partner name
                partnerName = this.innerText;
                wrapper.find("#partnerName").html('Chatting with ' + partnerName);
                $(this).css("background-color", "transparent");

                // delete last conversation
                $("#chatWindow").remove();

                // start new conversation
                self.startConversation(function () {
                    console.log(currentConversation);
                    var partner = (currentConversation.FirstUser.Username == partnerName) ? currentConversation.FirstUser : currentConversation.SecondUser
                    var partnerPictureUrl = partner.ProfilePictureUrl;
                    
                    if (partnerPictureUrl != null) {
                        $("#partnerPicture").attr("src", partnerPictureUrl);
                    }
                    else {
                        $("#partnerPicture").attr("src", "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png");
                    }

                    var currentUserPictureUrl = localStorage.getItem("ProfilePictureUrl");
                    console.log(currentUserPictureUrl);
                    if (currentUserPictureUrl != null) {
                        $("#yourPicture").attr("src", currentUserPictureUrl);
                    }
                    else {
                        $("#yourPicture").attr("src", "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png");
                    }
                });

                
            });

            // send new message
            wrapper.on("click", "#sendButton", function (e) {
                var message = {};
                message.Date = new Date();
                message.Content = $("#textInput").val();
                message.Conversation = currentConversation;
                console.log(currentConversation);

                var user = { };
                user.Id = localStorage.getItem("UserId");

                message.Sender = user;

                self.persister.message.send(message, function () {
                    self.updateConversation();
                });

                var channelName = self.getChannelName();
                e.preventDefault();
                self.pubnub.publish({
                    channel: channelName,
                    message: $("#textInput").val()

                });

                self.pubnub.publish({
                    channel: partnerName+"-channel",
                    message: localStorage.getItem("Username")

                });

                $("#textInput").val("");
            });

            wrapper.on("click", "#logoutButton", function () {
                localStorage.clear();
                window.location.reload();
            });
        }
    });

    return {
        get: function (selector) {
            return new Controller(selector);
        }
    }
})();

$(function () {
    var controller = controllers.get("#content");
    controller.loadUI();
    //controller.registerSingleUser();
    //controller.loginSingleUser();
    //controller.startConversation();
    //controller.getAllUsers();

});