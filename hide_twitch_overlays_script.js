// ==UserScript==
// @name         HideTwitchOverlays
// @namespace    https://github.com/NotADucc/HideTwitchOverlays
// @version      1.0.1
// @description  Hides annoying twitch overlays/extensions
// @author       https://github.com/NotADucc
// @match        *://*.twitch.tv/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
(function(history) {
    'use strict';
    function onContentLoaded() {

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList" && mutation.addedNodes) {
                    for (const node of mutation.addedNodes) {
                        if (!node.className) {
                            continue;
                        }
                        if (node.classList.contains('extension-view__iframe')) {
                            node.remove();
                            observer.disconnect();
                        }
                    }
                }
            }
        };

        const targetNode = document.querySelector('.twilight-main .scrollable-area');
        const observer = new MutationObserver(callback);
        const config = { childList: true };

        observer.observe(targetNode, config);

        const interval = setInterval(() => {
            const osrs_pop_ups = document.querySelector(".Layout-sc-1xcs6mc-0.djGvAr.video-size.passthrough-events");
            if (osrs_pop_ups) {
                osrs_pop_ups.remove();
                clearInterval(interval);
            }
        }, 1_000);

        window.addEventListener("beforeunload", () => {
            // no clue if this actually works
            observer.disconnect();
            clearInterval(interval);
        });
    }

    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        onContentLoaded();
        return pushState.apply(history, arguments);
    }

    if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
        onContentLoaded();
    } else {
        window.addEventListener("DOMContentLoaded", function() {
            onContentLoaded();
        });
    }
})(window.history);