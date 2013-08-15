var persisters = (function () {
    var username = localStorage.getItem("Username");
    var sessionKey = localStorage.getItem("PasswordHash");
    function saveUserData(userData) {
        localStorage.setItem("Username", userData.Username);
        localStorage.setItem("PasswordHash", userData.PasswordHash);
        localStorage.setItem("UserId", userData.Id);

        console.log(localStorage);
    }
    function clearUserData() {
        localStorage.removeItem("Username");
        localStorage.removeItem("PasswordHash");
        localStorage.removeItem("UserId", userData.Id);

        username = "";
        sessionKey = "";
    }

    var MainPersister = Class.create({
        init: function (rootUrl) {
            this.rootUrl = rootUrl;
            this.users = new UserPersister(this.rootUrl);
            this.conversation = new ConversationPersister(this.rootUrl);
            this.message = new MessagesPersister(this.rootUrl);
        },
        isUserLoggedIn: function () {
            var isLoggedIn = username != null && sessionKey != null;
            return isLoggedIn;
        },
        username: function () {
            return username;
        }
    });
    var UserPersister = Class.create({
        init: function (rootUrl) {
            //...api/user/
            this.rootUrl = rootUrl + "users/";
        },
        login: function (user, success, error) {
            var url = this.rootUrl + "login";
            var userData = {
                Username: user.Username,
                PasswordHash: CryptoJS.SHA1(user.Username + user.PasswordHash).toString()
            };

            httpRequester.postJSON(url, userData,
				function (data) {
				    saveUserData(data);
				    success(data);
				}, error);
        },
        register: function (user, success, error) {
            var url = this.rootUrl + "register";
            var userData = {
                Username: user.Username,
                PasswordHash: CryptoJS.SHA1(user.Username + user.PasswordHash).toString()
            };
            httpRequester.postJSON(url, userData,
				function (data) {
				    saveUserData(data);
				    success(data);
				}, error);  
        },
        //logout: function (success, error) {
        //    var url = this.rootUrl + "logout/" + sessionKey;
        //    httpRequester.getJSON(url, function (data) {
        //        clearUserData();
        //        success(data);
        //    }, error)
        //},
        getAll: function (success, error) {
            var url = this.rootUrl;

            httpRequester.getJSON(url, function(data) {
                success(data);
            }, error);
        }
    });
    var ConversationPersister = Class.create({
        init: function (url) {
            this.rootUrl = url + "conversations/";
        },
        start: function (conversation, success, error) {
            var conversationData = {
                FirstUser: conversation.FirstUser,
                SecondUser: conversation.SecondUser
            };

            var url = this.rootUrl + "/start";

            httpRequester.postJSON(url, conversationData,
				function (data) {
				    success(data);
				}, error);
        }
    });
    var MessagesPersister = Class.create({
        init: function (url) {
            this.rootUrl = url + "messages/";
        },
        getByConversation: function (id, success, error) {
            var url = this.rootUrl + "byconversation/" + id.toString();
            httpRequester.getJSON(url, function (data) {
                success(data);
            }, error);
        },
        send: function (message, success, error) {

            var messageInfo = {
                Sender: message.Sender,
                Conversation: message.Conversation,
                Date: message.Date,
                Content: message.Content
            };

            var url = this.rootUrl + "send/";
            httpRequester.postJSON(url, messageInfo,
				function (data) {
				    success(data);
				}, error);
        }
    });
    return {
        get: function (url) {
            return new MainPersister(url);
        }
    };
}());