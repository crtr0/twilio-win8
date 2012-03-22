(function (globals) {

    var

    // The username and authentication token.
    authUsername,
    authToken,

    apiRoot = "https://api.twilio.com/2010-04-01",

    accountSid,

    authKey,

    phoneNumber,

    get = function (url, params, success, error) {
        var queryStr = "";
        if (params !== null) {
            queryStr = "?"
            Object.keys(params).forEach(function (key, i) {
                if (i !== 0) { queryStr = queryStr + "&"; }
                queryStr = queryStr + key + "=" + encodeURIComponent(params[key]);
            });
        }
        
        WinJS.xhr({ user: accountSid, password: authKey, url: url + queryStr }).then(
            function (request) {
                if (typeof success === "function") {
                    success(JSON.parse(request.responseText));
                }
            },
            function (request) {
                if (typeof error === "function") {
                    error(JSON.parse(request.responseText));
                }
            }
        );
    },

    post = function (url, dataHash, success, error) {
        var dataStr = "";
        Object.keys(dataHash).forEach(function (key, i) {
            if (i !== 0) { dataStr = dataStr + "&"; }
            dataStr = dataStr + key + "=" + encodeURIComponent(dataHash[key]);
        });

        WinJS.xhr({
            type: "post", user: accountSid, password: authKey, url: url,
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            data: dataStr
        }).then(
            function (request) {
                if (typeof success === "function") {
                    success(JSON.parse(request.responseText));
                }
            },
            function (request) {
                if (typeof success === "function") {
                    error(JSON.parse(request.responseText));
                }
            }
        );
    },

    twilio = globals.twilio = {};

    /* These are the wrappers for the Twilio REST API */

    twilio.auth = function (acct, key) {
        accountSid = acct;
        authKey = key;
    };

    twilio.getSmsMessages = function (to, date, success, error) {
        get(apiRoot + "/Accounts/" + accountSid + "/SMS/Messages.json", { To: to, DateSent: date }, success, error);
    };

    twilio.makeCall = function (from, to, url, success, error) {
        post(apiRoot + "/Accounts/" + accountSid + "/Calls.json", { From: from, To: to, Url: url }, success, error);
    };

    twilio.sendSms = function (to, body, success, error) {
        post(apiRoot + "/Accounts/" + accountSid + "/SMS/Messages.json", { From: phoneNumber, To: to, Body: body }, success, error );
    };

}(window));
