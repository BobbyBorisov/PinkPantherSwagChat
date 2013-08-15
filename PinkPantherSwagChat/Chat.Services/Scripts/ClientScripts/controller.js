var controllers = (function () {
    var rootUrl = "http://localhost:2761/api/";
    var partnerName;
    var currentConversation;

    var Controller = Class.create({
        init: function () {
            this.persister = persisters.get(rootUrl);
        },

        initPubNub: function () {
            this.pubnub = PUBNUB.init({
                publish_key: 'pub-c-114ac428-67b8-490a-93d0-3a210895d407',
                subscribe_key: 'sub-c-ecacb7d2-04c0-11e3-a005-02ee2ddab7fe'
            })
        },

        loadUI: function (selector) {
             //Uncomment when persisters are working
            if (this.persister.isUserLoggedIn()) {
                this.loadChatUI(selector);
            }
            else {
                this.loadLoginFormUI(selector);
            }

            // debug
            ////this.loadChatUI(selector);
            //this.loadLoginFormUI(selector);

            this.attachUIEventHandlers(selector);
        },

        loadLoginFormUI: function (selector) {
            var loginFormHtml = ui.buildLoginForm();
            $(selector).html(loginFormHtml);
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

        loadUsersList: function (selector, users) {
            var chatUIHtml = ui.buildChatUI("someName", users);
            $(selector).html(chatUIHtml);
        },

        loadChatUI: function (selector) {
            var self = this;
            
            this.persister.users.getAll(function (users) {

                self.loadUsersList(selector, users);

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

        createNotification: function (data) {
            var channelName = "";
            var firstUser = localStorage.getItem("Username");
            if (firstUser < partnerName) {
                channelName = firstUser + "-" + partnerName + "-channel";
            } else {
                channelName = partnerName + "-" + firstUser + "-channel";
            }

            this.pubnub.subscribe({
                channel: channelName,
                callback: function (message) {
                    // Received a message --> print it in the page
                    //$("#msgContent").append("<p>"+message+ "</p>");
                    //console.log(message);
                    //updatemsg
                }
            });
        },

        startConversation: function (selector) {
            var conversation = {
                FirstUser: { Username: localStorage.getItem("Username") },
                SecondUser: { Username: partnerName }
            };

            console.log(conversation);

            this.persister.conversation.start(conversation, function (data) {
                var messages = data.Messages;

                var chatHtml = ui.buildConversationWindow(messages, partnerName);
                console.log(chatHtml);
                
                // append new conversation
                $(selector).append(chatHtml);

                // save conversation
                currentConversation = data;
            });
        },

        attachUIEventHandlers: function (selector) {
            var wrapper = $(selector);
            var self = this;

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
                var user = {
                    Username: $(selector).find("#tb-register-username").val(),
                    PasswordHash: $(selector + " #tb-register-password").val()
                }
                self.persister.users.register(user, function () {

                }, function (err) {
                    wrapper.find("#error-messages").text(err.responseJSON.Message);
                });
                return false;
            });

            // login existing user
            wrapper.on("click", "#btn-login", function () {
                var user = {
                    Username: $(selector + " #tb-login-username").val(),
                    PasswordHash: $(selector + " #tb-login-password").val()
                }

                self.persister.users.login(user, function () {
                    self.loadChatUI(selector);
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

                // delete last conversation
                $("#chatWindow").remove();

                // start new conversation
                self.startConversation(selector);
            });

            wrapper.on("click", "#sendButton", function () {
                var message = {};
                message.Date = new Date();
                message.Content = $("#textInput").val();
                message.Conversation = currentConversation;
                console.log(currentConversation);

                var user = { };
                user.Id = localStorage.getItem("UserId");

                message.Sender = user;

                self.persister.message.send(message, function () {
                    self.persister.message.getByConversation(currentConversation.Id, function(messages) {
                        var chatHtml = ui.buildConversationWindow(messages, partnerName);
                        console.log(chatHtml);
                        console.log(messages);
                        // append new conversation
                        // TODO : clear the previous
                        $(selector).append(chatHtml);
                    });
                });
                //console.log(currentConversation);
            });
        }
    });

    return {
        get: function () {
            return new Controller();
        }
    }
})();

$(function () {
    var controller = controllers.get();
    controller.loadUI("#content");
    //controller.registerSingleUser();
    //controller.loginSingleUser();
    //controller.startConversation();
    //controller.getAllUsers();

});