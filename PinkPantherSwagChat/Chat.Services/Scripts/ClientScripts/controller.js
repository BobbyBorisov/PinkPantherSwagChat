var controllers = (function () {
    var rootUrl = "http://localhost:2761/api/";

    var Controller = Class.create({
        init: function () {
            this.persister = persisters.get(rootUrl);
        },

        loadUI: function (selector) {
            // Uncomment when persisters are working
            //if (this.persister.isUserLoggedIn()) {
            //    this.loadChatUI(selector);
            //}
            //else {
            //    this.loadLoginFormUI(selector);
            //}

            // debug
            this.loadChatUI(selector);

            //this.loadLoginFormUI(selector);
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

        loadChatUI: function (selector) {
            var chatUIHtml = ui.buildChatUI();
            $(selector).html(chatUIHtml);
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
    controller.registerSingleUser();
    controller.getAllUsers();

});