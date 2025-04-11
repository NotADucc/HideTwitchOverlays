// ==UserScript==
// @name         HideTwitchOverlays
// @namespace    https://github.com/NotADucc/HideTwitchOverlays
// @version      1
// @description  Hides annoying twitch overlays/extensions
// @author       https://github.com/NotADucc
// @match        *://*.twitch.tv/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = document.querySelector('.twilight-main .scrollable-area');
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList" && mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (!node.className) {
                        continue;
                    }
                    if (node.className == 'extension-view__iframe') {
                        node.remove();
                        observer.disconnect();
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);

    window.addEventListener("beforeunload", () => {
        // no clue if this actually works
        observer.disconnect();
    });

    const interval = setInterval(() => {
        const osrs_pop_ups = document.querySelector(".Layout-sc-1xcs6mc-0.djGvAr.video-size.passthrough-events");
        if (osrs_pop_ups) {
            osrs_pop_ups.remove();
            clearInterval(interval);
        }
    }, 1_000);
})();
