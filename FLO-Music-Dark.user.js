// ==UserScript==
// @name         FLO Music Dark
// @namespace    FLO_Music_Dark
// @version      0.0.1
// @description  FLO(music-flo.com)에 어두운 모드 테마를 적용
// @author       NOMO
// @match        *.music-flo.com/*
// @homepageURL  https://nomomo.github.io/FLO-Music-Dark/
// @supportURL   https://github.com/nomomo/FLO-Music-Dark/issues
// @downloadURL  https://raw.githubusercontent.com/nomomo/FLO-Music-Dark/master/FLO-Music-Dark.user.js
// @updateURL    https://raw.githubusercontent.com/nomomo/FLO-Music-Dark/master/FLO-Music-Dark.user.js
// @grant        GM.addStyle
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @run-at       document-start
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(async () => {
    'use strict';
    var nomoflow_use = await GM.getValue("nomoflow_use", true);
    var styleElem = undefined;
    $(document).ready(function () {
        // initialize (create on-off button css)
        GM_addStyle(`
            #nomoflo_darkmode {color:#8c8c8c; cursor:pointer;}
            #nomoflo_darkmode.nomoflo_darkmode_on {color:#737373;}
        `);

        // initialize  (create on-off button elem.)
        var $snb_w = $(".snb_w");
        if ($snb_w.length !== 0) {
            var $snb_w_ul = $snb_w.find("ul").first();
            if ($snb_w_ul.length !== 0) {
                $snb_w_ul.prepend("<li id='nomoflo_darkmode'></li>");
            }
        }

        // initialize (apply theme)
        var $nomoflo_darkmode = $("#nomoflo_darkmode");
        if ($nomoflo_darkmode.length !== 0) {
            if (nomoflow_use) {
                $nomoflo_darkmode.html("어두운 모드 ON").addClass("nomoflo_darkmode_on");
                nomoflo_addStyle(true);
            } else {
                $nomoflo_darkmode.html("어두운 모드 OFF").removeClass("nomoflo_darkmode_on");
                nomoflo_addStyle(false);
            }
        }
        /*
        // theme on-off animation
        setTimeout(function(){
            GM_addStyle(`
                *{transition:background-color 1s, color 0.5s, border-color 1s ease-out}
            `);
        },1000);*/

        // click toggle
        $nomoflo_darkmode.on("click", async function () {
            if ($nomoflo_darkmode.hasClass("nomoflo_darkmode_on")) {
                $nomoflo_darkmode.html("어두운 모드 OFF").removeClass("nomoflo_darkmode_on");
                nomoflo_addStyle(false);
                await GM.setValue("nomoflow_use", false);
            } else {
                $nomoflo_darkmode.html("어두운 모드 ON").addClass("nomoflo_darkmode_on");
                nomoflo_addStyle(true);
                await GM.setValue("nomoflow_use", true);
            }
        });
    });

    // function - apply theme
    var nomoflo_addStyle = function (cond) {
        if (cond && styleElem !== undefined) {
            return;
        }
        if (!cond && styleElem !== undefined) {
            $(styleElem).remove();
            styleElem = undefined;
            return;
        } else if (!cond) {
            return;
        } else {
            styleElem = GM_addStyle(`
                body {
                    color:#ccc;
                    background-color: #000;
                }
                /*logo*/
                .flo_bi {
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAXCAYAAACvd9dwAAAACXBIWXMAAAsTAAALEwEAmpwYAAA57GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTktMDctMTRUMTk6MTU6NTYrMDk6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOS0wNy0xNFQxOToxNzoyNCswOTowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTktMDctMTRUMTk6MTc6MjQrMDk6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NmMzNDAxOGQtZWNkMi1iMzRmLTkxMTEtNTBlNzNmMzVkZWEwPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6OGFkNjIwMGYtYTYyMC0xMWU5LTgyYzgtZmRmNGIyMmQzZjdkPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6ZjcwODZmNGUtMzM1Yi03NTRmLWIzZDQtYWFhYjY2YWY3NWIwPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmY3MDg2ZjRlLTMzNWItNzU0Zi1iM2Q0LWFhYWI2NmFmNzViMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOS0wNy0xNFQxOToxNTo1NiswOTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo2YzM0MDE4ZC1lY2QyLWIzNGYtOTExMS01MGU3M2YzNWRlYTA8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTktMDctMTRUMTk6MTc6MjQrMDk6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NTU8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjM8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PvzlAwgAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABLxJREFUeNrMWG9sU1UU/537XrstTGlL27HxOrYOYcvMJNaRgBoTPmiUmBATopnJool/oiEa4gdjSLSg8gE/KEYN8YNCCEFjNJFhEDShHyQLIJFEIoKDjfW1rq/bumZjY23fPX5Atvfe6Oi28ud8e+fec+793XPO7577iJkRi8XUtpUrayEK9xCRIFkYHesbMLS1ayfgEL27u6oiVKMFtPA/Vn02dbmRhfru9W8mNrx+7W0sQAyjt8ZN6ssEWgeiRmZeDsIwGJeY8TfD/NoXXN5dzJ4yRnwXCJ0E8swYZb4I0GmGTAKkEKgZxI8x47gnoK23Th0a0NeoKp2w2F5aHNCa5gMqne5b6iJ1JwHPAuSefTb/bkre6guGjjpHVCJ6o6gdUROAJoKwKgEwbpVkjP6HXaR+R6Da0izoIUXQ4ZHBeNQbqP+Amac2J3AXyYgR3yiEOEZUBBgjDXD+BiOCILZn0vF9NuW1DOIJZhxn8H5m/grMR8EYvLF/TpiMz8oNLJvqD0PQHoBcjqFfJfOGq+ZQ9eLAsuDRY91VhVy+haX8mBljthiCns8Y8denvo1k/6PZK2dPrljx5KRzwWTygn8RKuoLCnmJeDwn+d/du/f0R6NR6Zy7kJqLRqNiy+aXTgIUsRxjHsDmxX7ty2J2g8neVS6X+yAIKy3rTkqJdm+N9idZUnRBshBwmVT/00JRDlp1JsvnfIHQtzezTaUuBitExRlrKjN4n8evdd4VNSeEeM1O0thbCjAAqKlpMiTzi7b0ZGzSdd2n2ugXylNg0Qpiz+wEhX6PX9tWDmCp1MVgpVL5hFVXoMkdc/HhC4aOjKQTZ4iw+n+Wr1zkxib1WlroHS5F/ZxAHtB1up/tauFLAMoCzk2u++yszSf8/vCFufohlvtBYvX0+ctVasbQ24RCewGodygpG+3nRufm40Uynxf2O7pBkMC2OwcMIEEBGzji9Hz8MBSHHQVUMK22ZiEDcTD2MuRAcU+ULRc4yWZCIcXa/9TNK/7EddZyIiChEmG5I7yv+ALaz7crcmyKPlveMB6Yp6s2h+c+4WSPidzYqdtaceO58wDnpkuF7h8a0NfMKbWJCIROe5Bw9o7fc95wOAuJ723dvIL3iYjm0Gy/QESNlks8O1FI/XDLwDGoZN+S5BeOUDw+bOjvlNQZJfuaAfGpY/F9dXWR8bKBU1WzYN8fGgwjXlL75Q3U/8aMQ442/8ORtP5JLBZTizfbifWqWz1OhGoLsgzncx8BAI2kdVtzOTY56l+2rHloruCGe3ruVTxVDhblDAOHCDQ2sw/gnDcY2nL9/aXruq+6kv4goN7RivWBsAucj/Go7BWLFJ9UqJVYeZUIG5ycwabc6KkJ/VhWcACQHUz8BaCl1Pk9lwfckUgkP918x9tVRRwGYcm8SkHydk9Qe++WPFZNab65EPslS0OnuJCLAHx6TqAY4xKywwqs7OB8wfpfJGRHsYduKeKpbbycGSs8IhlbGZy4Caw8GN9I02z3+kMHZvAAQ75lVeTzlVcWRO3+0IHhnp6fRHXlgyy4hQSqis3t6uoyI5HIDH1DQ8NVADtisdjOttbwMwJiHYjCmPr7Rb3EfC4/yfv9IS1ZzP9/AwApsAWHGOgafwAAAABJRU5ErkJggg==');
                }
                header {
                    background-color: #000;
                }
                header .header_inner .snb_w .user_character {
                    color: #fff;
                }
                header .header_inner .snb_w ul li a {
                    color: #737373; /*8c8c8c*/
                }
                .main, .section_home {
                    background-color: #000;
                }
                .main a, .section_home a {
                    color: #ccc; /*#333*/
                }
                header .header_inner .nav_gnb ul li a {
                    color:#fff;
                }
                input, textarea {
                    background-color: #000;
                    color: #fff;
                }
                /* 페이징 dot */
                .paging_dot_w span {
                    background-color: #ccc; /*333*/
                }
                /* 푸터 */
                footer {
                    background-color: #000;
                }
                footer .flo_fnb {
                    border-bottom: 1px solid #0a0a0a; /*#f5f5f5*/
                }
                footer .policy_area li a {
                    color: #b5b5b5; /*#4a4a4a*/
                }
                footer .policy_area li a em {
                    color: #b5b5b5; /*#4a4a4a*/
                }
                footer address span {
                    color: #5f5f5f;/*#a0a0a0*/
                }
                footer .copyright {
                    color:#e7e7e7;/*#181818*/
                }
                footer .flo_fnb li a {
                    color:#fff;
                }
                /*검색아이콘*/
                .flo_search:before, .help_search_faq:before {
                    filter: invert(100%);
                    -webkit-filter: invert(100%);
                }
                /*검색제안 백그라운드*/
                .search_suggestion_w{
                    background-color: #000;
                }
                /* 검색 창 테두리 */
                .flo_search, .help_search_faq {
                    border: 1px solid #2d2d2d;/*#d2d2d2;*/
                }
                .search_suggestion_w .search_suggestion_each h4 {
                    color:#ccc; /*#333*/
                }
                .search_suggest_list li a {
                    color:#ccc; /*#333*/
                }
                .rise_keyword li a {
                    color:#ccc; /*#333*/
                }
                .rise_keyword li a:hover {
                    background-color: #050505; /*#fafafa*/
                }
                .ct_container, .section_browse, .section_character, .section_detail, .section_error, .section_help, .section_info, .section_member, .section_new, .section_purchase, .section_recent, .section_search, .section_storage, .voucher_info {
                    background-color: #000;
                }
                .ct_container a, .section_browse a, .section_character a, .section_detail a, .section_error a, .section_help a, .section_info a, .section_member a, .section_new a, .section_purchase a, .section_recent a, .section_search a, .section_storage a, .voucher_info a {
                    color:#ccc; /*#333*/
                }
                button, .sort_type_wrap {
                    color:#ccc; /*#333*/
                }
                .player_ct.mini{
                    background-color:#222; /*#000*/
                }
                .help_list_table th, .track_list_table th {
                    color: #5f5f5f;/*#a0a0a0*/
                    border-top: 1px solid #141414;/*ebebeb*/
                    border-bottom: 1px solid #141414;/*ebebeb*/
                }
                .help_list_table td, .track_list_table td {
                    border-bottom: 1px solid #090909;/*f6f6f6*/
                }
                .chart_content_head .btn_allplay, .chart_content_head .btn_plus {
                    color:#ddd; /*#222*/
                }
                .help_list_table td.info .txt_area .tit, .track_list_table td.info .txt_area .tit {
                    color:#ccc; /*#333*/
                }
                .help_list_table td.artist p .artist_link_w a, .track_list_table td.artist p .artist_link_w a {
                    color:#ccc; /*#333*/
                }
                .help_list_table td.info .txt_area .album, .track_list_table td.info .txt_area .album {
                    color:#696969; /*#969696*/
                }

                .newlist_tab .btn_more, .setting_tab .btn_more, .storage_tab .btn_more, .tab .btn_more, .voucher_tab .btn_more {
                    background-color: #000;
                }
                /*내정보 창*/
                    header .header_inner .snb_w .my_character_info {
                    background-color: #000;
                }
                header .header_inner .snb_w .my_character_info ul li:active, header .header_inner .snb_w .my_character_info ul li:hover {
                    background-color: #0a0a0a; /*#f5f5f5*/
                }
                .my_character_info .pop_user_character_area .character_pop_thumbnail.newlist_plus{
                    background-color: #0c0c0c; /*f3f3f3*/
                    border: 1px solid #161616; /*e9e9e9*/
                }
                .my_character_info .user_info{
                    border-top: 1px solid #111; /*eee*/
                }
                .my_character_info .btn_character_logout{
                    border-top: 1px solid #111; /*eee*/
                }
                /*이름수정*/
                .comp_inp_birth, .comp_inp_pw, .comp_inp_txt {
                    color:#e7e7e7;/*#181818*/
                }
                /*TOP 100 듣기*/
                    .btn_popular_listen {
                    color:#ccc; /*#333*/
                }
                /*TOP 100 더보기*/
                .btn_list_more {
                    border: 1px solid #141414;/*ebebeb*/
                    color: #fff;
                }

                /*실시간 종합 차트 제목*/
                .chart_content_head h4{
                    color:#ccc; /*#333*/
                }

                /*실시간 종합 차트 업데이트 일시 */
                .chart_content_head .update span {
                    color: #5f5f5f;/*#a0a0a0*/
                }

                /* 실시간 종합 차트 위 버튼 테두리 */
                .btn_tab_tracklist {
                    border: 1px solid rgba(255,255,255,.2);
                }
                /* 순위 숫자 */
                .help_list_table td.num, .track_list_table td.num {
                    color:#ccc; /*#333*/
                }

                /* 재생바 총 시간*/
                .player_ct .playtime .time_all {
                    color: #b9b9b9; /*#646464*/;
                }

                /* 쿠폰등록 버튼 폰트 */
                .sort_type_wrap_coupon button {
                    color: #fff;
                    border: .5px solid #2d2d2d; /*d2d2d2*/
                }

                /* 새로운 리스트 만들기 */
                .type_newlist_plus {
                    background-color: #090909; /*f6f6f6*/
                }

                .btn_create_playlist:hover .type_newlist_plus {
                    background-color: #141414;/*ebebeb*/
                }

                /*공지사항*/
                .help_list_table tbody tr:hover, .help_list_table tr:hover {
                    background-color: #050505; /*#fafafa*/
                }
                .help_list_table tr.on {
                    background-color: #0a0a0a; /*#f5f5f5*/
                }
                /*FAQ*/
                .section_help .help_question_textarea textarea {
                    border: 1px solid #141414;/*ebebeb*/
                }
                .section_help .help_question_textarea span {
                color: #3b3b3b; /*#c4c4c4;*/
                    background-color: #000;
                }
                .section_help .comp_select {
                    border: 1px solid #141414;/*ebebeb*/
                }
                .section_help .comp_select select {
                    color:#ccc;/*333*/
                }

                /*내리스트*/
                .section_content_head .btn_allchoice{
                    color: #eee; /*222;*/
                }

                /*내플레이리스트 설정*/
                .popup_w_setting {
                    background-color:#000;
                }
                .popup_w .popup_content .top_line_area, .popup_w_big .popup_content .top_line_area, .popup_w_img .popup_content .top_line_area, .popup_w_setting .popup_content .top_line_area {
                    border-top: 1px solid #0c0c0c; /*f3f3f3*/
                }
                /* 내리스트 가져오기 */
                .popup_w_big, .popup_w_img, .popup_w_setting {
                    background-color:#000;
                }
                .popup_w_big .popup_content li {
                    border-bottom: 1px solid #111; /*eee*/
                }

                /**/
                .btn_play_type1, /*메인 상단 재생버튼*/
                .paging_arrow .btn_paging_arrow.previous,
                .paging_arrow .btn_paging_arrow.forward, /*메인 넘기기 스크롤 버튼*/
                .album_thumbnail .btn_thumbnail_play, /*섬네일 우측하단 재생버튼*/
                .album_thumbnail.type_artist .btn_thumbnail_play, /*메인 앨범 재생버튼*/
                .section_content_head h3 a:after, /* > 모양 */
                .big_size .badge_track_info .util_area button[class^=btn_]:not(:hover),
                .badge_track_info .btn_add_list:not(:hover), /*= 모양 */
                .btn_tab_normal:not(:hover) .ico_like, /* 보관함 하트아이콘 */
                .big_size .badge_track_info .artist a.last:after, /* 보관함 > */
                .album_thumbnail.type_playlist:after, .album_thumbnail.type_playlist:before, /* 책 뒤에 겹쳐진 그림자 */
                .help_list_table td button[class^=btn_], .track_list_table td button[class^=btn_], /* 실시간 종합 차트 버튼 */
                button:not(:hover).btn_popular_listen:before, /* TOP 100 듣기 버튼 아이콘*/
                .my_character_info .user_info .info_setting:after, /* 정보관리 우측 > 아이콘 */
                .big_size .badge_track_info .btn_edit, /* 보관함 리스트 수정 시 연필모양 아이콘 */
                .character_section .info_area .title_modify span .btn_edit, /* 내정보 수정 연필모양 아이콘*/
                .inp_check_circle+label:before, /* 내리스트 편집시 체크*/
                .section_content_head .btn_allchoice:not(:hover):after, /*내리스트 편집시 전체선택 왼쪽 체크아이콘*/
                .big_size .comp_inc_btn .btn_pw_del /* 보관함 리스트 수정 X 버튼 */
                {
                    filter: invert(100%) hue-rotate(180deg) saturate(1700%);
                    -webkit-filter: invert(100%) hue-rotate(180deg) saturate(1700%);
                }
            `);
        }
    }
})();
