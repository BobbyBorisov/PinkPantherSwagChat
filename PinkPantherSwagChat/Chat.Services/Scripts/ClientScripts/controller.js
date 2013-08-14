var controllers = (function () {
    var Controller = Class.create({
        init: function () {
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

        loadChatUI: function (selector) {
            var chatUIHtml = ui.buildChatUI();
            $(selector).html(chatUIHtml);
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
});