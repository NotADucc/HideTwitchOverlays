// ==UserScript==
// @name         HideTwitchOverlays
// @namespace    https://github.com/NotADucc/HideTwitchOverlays
// @version      1.2.1
// @description  Hides annoying twitch overlays/extensions
// @author       https://github.com/NotADucc
// @match        *://*.twitch.tv/*
// @run-at       document-body
// @grant        none
// ==/UserScript==
(function(history) {
    'use strict';
    const onContentLoaded = () => {
        const max_tries = 30, delay = 500;

        const nuke = [
            {
                name: "i frame",
                selector: () => document.querySelector(".extension-view__iframe"),
                tries_left: max_tries,
                interval: 0,
            },
            {
                name: "pop up",
                selector: () => document.querySelector(".passthrough-events"),
                tries_left: max_tries,
                interval: 0,
            },
            {
                name: "disclosure pop up",
                selector: () => document.querySelector(".disclosure-tool"),
                tries_left: max_tries,
                interval: 0,
            },
        ];


        const startNuking = (info) => {
            const interval = setInterval(() => {
                const node = info.selector();
                if (node) {
                    node.remove();
                    console.debug(`nuked: ${info.name}`);
                    clearInterval(info.interval);
                } else {
                    info.tries_left--;
                    if (info.tries_left <= 0) {
                        console.debug(`max retries reached for ${info.name}`);
                        clearInterval(info.interval);
                    }
                }
            }, delay);

            info.interval = interval;
        }

        nuke.forEach(startNuking);

        window.addEventListener("beforeunload", () => {
            // no clue if this actually works
            nuke.forEach(x => clearInterval(x.interval));
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