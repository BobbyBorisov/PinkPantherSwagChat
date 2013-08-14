﻿var ui = (function () {
    function buildLoginForm() {
        var html =
            '<div id="login-form-holder">' +
				'<form>' +
					'<div id="login-form">' +
						'<label for="tb-login-username">Username: </label>' +
						'<input type="text" id="tb-login-username"><br />' +
						'<label for="tb-login-password">Password: </label>' +
						'<input type="text" id="tb-login-password"><br />' +
						'<button id="btn-login" class="button">Login</button>' +
					'</div>' +
					'<div id="register-form" style="display: none">' +
						'<label for="tb-register-username">Username: </label>' +
						'<input type="text" id="tb-register-username"><br />' +
						'<label for="tb-register-nickname">Nickname: </label>' +
						'<input type="text" id="tb-register-nickname"><br />' +
						'<label for="tb-register-password">Password: </label>' +
						'<input type="text" id="tb-register-password"><br />' +
						'<button id="btn-register" class="button">Register</button>' +
					'</div>' +
					'<a href="#" id="btn-show-login" class="button selected">Login</a>' +
					'<a href="#" id="btn-show-register" class="button">Register</a>' +
				'</form>' +
				'<div id="error-messages"></div>' +
            '</div>';
        return html;
    }

    function buildChatUI (partnerName, allUsers) {
        var html =
            '<div id="usersList">';

        for (var i = 0; i < allUsers.length; i++) {
            html += '<p>' + allUsers[i].Username + '</p>';
        }
            
        html += '</div>' +
        '<div id="partnerName">Chatting with' + partnerName + '</div>' +
        '<div id="chatWindow">' +
            '<p class="sent">Zdrasti</p>' +
            '<p class="recieved">Kvo stava</p>' +
            '<p class="sent">Dobre e.</p>' +
            '<div id="textForm">' +
                '<input id="textInput" type="text" placeholder="type text here" />' +
                '<input type="submit" id="sendButton", value="Send" />' +
            '</div>' +
        '</div>';

        return html;
    }

    return {
        buildLoginForm: buildLoginForm,
        buildChatUI: buildChatUI
    }
})();