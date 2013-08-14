var persisters = (function () {
    var nickname = localStorage.getItem("nickname");
    var sessionKey = localStorage.getItem("sessionKey");
    function saveUserData(userData) {
        localStorage.setItem("nickname", userData.nickname);
        localStorage.setItem("sessionKey", userData.sessionKey);
        nickname = userData.nickname;
        sessionKey = userData.sessionKey;
    }
    function clearUserData() {
        localStorage.removeItem("nickname");
        localStorage.removeItem("sessionKey");
        nickname = "";
        sessionKey = "";
    }

    var MainPersister = Class.create({
        init: function (rootUrl) {
            this.rootUrl = rootUrl;
            this.users = new UserPersister(this.rootUrl);
            this.message = new MessagesPersister(this.rootUrl);
        },
        isUserLoggedIn: function () {
            var isLoggedIn = nickname != null && sessionKey != null;
            return isLoggedIn;
        },
        nickname: function () {
            return nickname;
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
                username: user.username,
                authCode: CryptoJS.SHA1(user.username + user.password).toString()
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
                username: user.username,
                nickname: user.nickname,
                authCode: CryptoJS.SHA1(user.username + user.password).toString()
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

            httpRequester.getJSON(url, function (data) {
                clearUserData();
                success(data);
            }, error)
        }
    });
    var ConversationPersister = Class.create({
        init: function (url) {
            this.rootUrl = url + "conversations/";
        },
        create: function (conversation, success, error) {
            var conversationData = {
                title: conversation.title,
                number: conversation.number
            };
            if (conversation.password) {
                conversationData.password = CryptoJS.SHA1(conversation.password).toString();
            }
            var url = this.rootUrl + "create/" + sessionKey;
            httpRequester.postJSON(url, conversationData, success, error);
        },
        join: function (game, success, error) {
            var gameData = {
                gameId: game.gameId,
                number: game.number
            };
            if (game.password) {
                gameData.password = CryptoJS.SHA1(game.password).toString();
            }
            var url = this.rootUrl + "join/" + sessionKey;
            httpRequester.postJSON(url, gameData, success, error);
        },
        start: function (gameId, success, error) {
            var url = this.rootUrl + gameId + "/start/" + sessionKey;
            httpRequester.getJSON(url, success, error)
        },
        myActive: function (success, error) {
            var url = this.rootUrl + "my-active/" + sessionKey;
            httpRequester.getJSON(url, success, error);
        },
        open: function (success, error) {
            var url = this.rootUrl + "open/" + sessionKey;
            httpRequester.getJSON(url, success, error);
        },
        state: function (gameId, success, error) {
            var url = this.rootUrl + gameId + "/state/" + sessionKey;
            httpRequester.getJSON(url, success, error);
        }
    });
    var MessagesPersister = Class.create({
        init: function (url) {
            this.rootUrl = url + "messages/";
        },
        unread: function (success, error) {
            var url = this.rootUrl + "unread/" + sessionKey;
            httpRequester.getJSON(url, success, error);
        },
        all: function (success, error) {
            var url = this.rootUrl + "all/" + sessionKey;
            httpRequester.getJSON(url, success, error);
        }
    });
    return {
        get: function (url) {
            return new MainPersister(url);
        }
    };
}());