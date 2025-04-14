// ==UserScript==
// @name         HideTwitchOverlays
// @namespace    https://github.com/NotADucc/HideTwitchOverlays
// @version      1.1.1
// @description  Hides annoying twitch overlays/extensions
// @author       https://github.com/NotADucc
// @match        *://*.twitch.tv/*
// @run-at       document-body
// @grant        none
// ==/UserScript==
(function(history) {
    'use strict';
    const onContentLoaded = () => {
        const predicate_iframe = (classList) => classList.contains('extension-view__iframe');
        const predicate_pop_up = (classList) => classList.contains('Layout-sc-1xcs6mc-0')
        && classList.contains('djGvAr')
        && classList.contains('video-size')
        && classList.contains('passthrough-events');
        const createCallback = (predicate) => {
            return (mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type === "childList") {
                        for (const node of mutation.addedNodes) {
                            if (!node.className) {
                                continue;
                            }
                            if (predicate(node.classList)) {
                                console.debug(`nuked: ${predicate.name}`);
                                node.remove();
                                observer.disconnect();
                            }
                        }
                    }
                }
            };
        };

        const config = { childList: true, subtree: true };

        const twilight_container = document.querySelector('.twilight-main .scrollable-area');
        const iframe_observer = new MutationObserver(createCallback(predicate_iframe));

        // const container = document;
        // const pop_up_observer = new MutationObserver(createCallback(predicate_pop_up));

        iframe_observer.observe(twilight_container, config);
        // pop_up_observer.observe(container, config);

        let max_retries = 30, current_retries = 0;
        const interval = setInterval(() => {
            const osrs_pop_ups = document.querySelector(".Layout-sc-1xcs6mc-0.djGvAr.video-size.passthrough-events");
            if (osrs_pop_ups) {
                osrs_pop_ups.remove();
                console.debug(`nuked: pop up`);
                clearInterval(interval);
            } else {
                current_retries++;
                if (current_retries >= max_retries) {
                    console.debug(`max retries reached for pop up`);
                    clearInterval(interval);
                }
            }
        }, 500);

        window.addEventListener("beforeunload", () => {
            // no clue if this actually works
            iframe_observer.disconnect();
            // pop_up_observer.disconnect();
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