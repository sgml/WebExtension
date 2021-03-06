"use strict";

var textElement = document.querySelectorAll(".tracking-protection__content__text")[0];
var textOK = "";
var textKO = "";

var changeTPIcon = function (state) {
    var icon = document.querySelectorAll(".tracking-protection__content__icon")[0];
    if (state === true) {
        icon.classList.remove("icon__tracking-protection--disabled");
        icon.classList.add("icon__tracking-protection--enabled");
    } else {
        icon.classList.remove("icon__tracking-protection--enabled");
        icon.classList.add("icon__tracking-protection--disabled");
    }
};

var changeText = function (state) {
    textElement.textContent = state ? textOK : textKO;
};

document.querySelectorAll(".tracking-protection__content__button")[0]
    .addEventListener("click", function () {
        var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];

        var blockDisplay = document.querySelectorAll('.reload-msg')[0].style.display;
        if (!blockDisplay || blockDisplay === 'none') {
            document.body.style.height = parseInt(document.body.clientHeight + 50) + "px";
            document.querySelectorAll('.reload-msg')[0].style.display = 'block';
        }

        if (checkbox.checked === true) {
            browser.runtime.sendMessage({name: "tracking_protection_on"});
            changeTPIcon(true);
            changeText(true);
            var setting = browser.privacy.websites.trackingProtectionMode.set({
                value: "always"
            });
        } else {
            browser.runtime.sendMessage({name: "tracking_protection_off"});
            changeTPIcon(false);
            changeText(false);
            var setting = browser.privacy.websites.trackingProtectionMode.set({
                value: "never"
            });
        }
        browser.runtime.sendMessage({name: "close-popup"});
    });

browser.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "tracking_protection_status":
            var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];
            var checkboxElement = document.querySelectorAll(".tracking-protection__content__button")[0];

            textOK = message.text_enabled;
            textKO = message.text_disabled;

            checkboxElement.style.display = "inherit";
            checkbox.checked = message.status;
            changeTPIcon(message.status);
            changeText(message.status);
            break;
    }
});


document.querySelectorAll(".tracking-protection__content__text")[0]
    .addEventListener("click", function () {
        browser.runtime.sendMessage({name: "close-popup"});
    });
