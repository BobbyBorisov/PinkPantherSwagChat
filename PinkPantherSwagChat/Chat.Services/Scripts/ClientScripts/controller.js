var controllers = (function () {
    var rootUrl = "http://localhost:2761/api/";

    var Controller = Class.create({
        init: function () {
            this.persister = persisters.get(rootUrl);
        },

        loadUI: function (selector) {
             //Uncomment when persisters are working
            //if (this.persister.isUserLoggedIn()) {
            //    this.loadChatUI(selector);
            //}
            //else {
            //    this.loadLoginFormUI(selector);
            //}

            //// debug
            //this.loadChatUI(selector);

            ////this.loadLoginFormUI(selector);
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

        loadChatUI: function (selector) {
            var allUsers = this.getAllUsers();
            var chatUIHtml = ui.buildChatUI("someName", allUsers);
            $(selector).html(chatUIHtml);
        },

        getAllUsers: function () {
            var allUsers = [];
            
            this.persister.users.getAll(function (users) {

                for (var i = 0; i < users.length; i++) {
                    allUsers[i] = users[i];
                }

            }, function (err) {
                console.log(err);
            });

            console.log(allUsers);

            return allUsers;
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
    //controller.loadUI("#content");
    //controller.registerSingleUser();
    controller.loginSingleUser();
    controller.getAllUsers();

});