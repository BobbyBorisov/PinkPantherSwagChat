﻿var ui = (function () {
    function buildLoginForm() {
        var html =
            '<div id="login-form-holder">' +
				'<form>' +
					'<div id="login-form">' +
						'<label for="tb-login-username">Username: </label>' +
						'<input type="text" id="tb-login-username"><br />' +
						'<label for="tb-login-password">Password: </label>' +
						'<input type="password" id="tb-login-password"><br />' +
						'<button id="btn-login" class="button">Login</button>' +
					'</div>' +
					'<div id="register-form" style="display: none">' +
						'<label for="tb-register-username">Username: </label>' +
						'<input type="text" id="tb-register-username"><br />' +
						'<label for="tb-register-password">Password: </label>' +
						'<input type="password" id="tb-register-password"><br />' +
                        '<label for="file-upload">Profile Picture</label>' +
                        '<input type="file" id="file-upload" />' +
						'<button id="btn-register" class="button">Register</button>' +
					'</div>' +
					'<a href="#" id="btn-show-login" class="button selected">Login</a> ' +
					'<a href="#" id="btn-show-register" class="button">Register</a>' +
				'</form>' +
				'<div id="error-messages"></div>' +
            '</div>';
        return html;
    }

    function buildChatUI(partnerName, allUsers) {
        var partnerPictureUrl = "";
        partnerName = partnerName.escape();

        var html =
            '<div id="profilePanel">' +
            'Welcome '+localStorage.getItem("Username")+', <img src="" id="yourPicture" />' +
            '<a href=# id="logoutButton">Logout</a>' +
            '</div>' +
            '<div id="usersList">';

        for (var i = 0; i < allUsers.length; i++) {
            html += '<a href=#><p id="'+ allUsers[i].Username+'">' + allUsers[i].Username + '</p></a>';
        }
            
        html += '</div>' +
        '<div id="partnerName">Chatting with' + partnerName + '</div>' +
        '<img src="" id="partnerPicture" />';
        
        
        return html;
    }

    function buildConversationWindow(messages, partnerUsername) {
        partnerUsername = partnerUsername.escape();

        var html = '<div id="chatWindow">' +
        '<div id="textForm">' +
                '<div id="msgContent">';


        for (var i = 0; i < messages.length; i++) {
            var username = messages[i].Sender.Username.escape();
            if (username == partnerUsername) {
                html += '<p class="recieved">' + partnerUsername + '</p>';
            }
            else {
                html += '<p class="sent">' + username + '</p>';
            }

            html += '<p class="msgDate">' + messages[i].Date + '</p>';
            html += '<p class="chatMessage">' + messages[i].Content + '</p>';
        }

        html += '</div>' +
                '<div id="send-text-form-holder">' +
                '<form>' +
               '<input id="textInput" type="text" placeholder="type text here" />' +
               '<input type="submit" id="sendButton", value="Send" />' +
               '</form>' +
               '</div>' +
           '</div>' +
       '</div>';

        return html;
    }

    return {
        buildLoginForm: buildLoginForm,
        buildChatUI: buildChatUI,
        buildConversationWindow: buildConversationWindow
    }
})();