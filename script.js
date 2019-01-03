// ==UserScript==
// @name         City Year Timesheet Helper
// @namespace    http://zebburkeconte.com/
// @version      0.1
// @description  Make entering City Year timesheets smoother.
// @author       Zeb Burke-Conte
// @match        *://*.myworkday.com/cityyear*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function setUp() {
        if (document.querySelector('#spinnerContainer') != null) {
            window.setTimeout(setUp, 100);
            return;
        }

        if (document.querySelector('[data-automation-id=pageHeaderTitleText]').innerText !== 'Enter Time' && document.querySelector('[data-automation-id=pageHeaderTitleText]').innerText !== 'Enter My Time') {
            return;
        }

        if (document.querySelector('[data-added-by-cy-timesheet-extension=true]') != null) {
            return;
        }

        var style = document.createElement('style');
        style.innerText =
          '#cy-timesheet__popup-container {' +
            'z-index: 49;' +
            'background-color: rgba(0, 0, 0, 0.65);' +
            'position: fixed;' +
            'top: 0; bottom: 0; left: 0; right: 0;' +
          '}' +
          '#cy-timesheet__popup-table {' +
            'display: table;' +
            'width: 100%;' +
            'height: 100%;' +
            'table-layout: fixed;' +
          '}' +
          '#cy-timesheet__popup-table-cell {' +
            'display: table-cell;' +
            'text-align: center;' +
            'vertical-align: middle;' +
          '}' +
          '#cy-timesheet__wd-popup {' +
            'margin: 0;' +
            'padding: 0;' +
            'min-height: 0;' +
            'border: 1px solid rgba(213, 217, 222, 1);' +
            'z-index: 10;' +
            'background-color: white;' +
            'border-radius: 3px;' +
            'overflow: visible;' +
            'border-color: #d5d9de;' +
            'text-align: left;' +
            'display: inline-block;' +
            'position: relative;' +
            'box-shadow: 0 20px 25px rgba(0, 0, 0, 0.16);' +
            'opacity: 1;' +
            'transform: scale(1);' +
            'max-width: 798px;' +
          '}' +
          '#cy-timesheet__wd-popup-content {' +
            'padding-right: 32px;' +
            'padding-left: 32px;' +
            'max-width: 901px;' +
            'max-height: 636px;' +
            'overflow: auto;' +
            'text-align: left;' +
            'min-height: 0.1%;' +
            'padding-top: 5px;' +
            'padding-bottom: 0;' +
            'box-sizing: border-box;' +
            'display: block;' +
          '}' +
          '#cy-timesheet__header {' +
            'margin-top: 10px;' +
            'margin-bottom: 10px;' +
          '}' +
          '#cy-timesheet__header-1 {' +
            'margin-bottom: 4px;' +
            'padding-bottom: 4px;' +
            'display: table;' +
            'width: 100%;' +
          '}' +
          '#cy-timesheet__header-2 {' +
            'font-size: 22px;' +
            'font-weight: 400;' +
            'display: table-cell;' +
            'vertical-align: middle;' +
            'width: 100%;' +
          '}' +
          '#cy-timesheet__title {' +
            'color: #333;' +
            'font-size: 24px;' +
            'font-weight: 500;' +
            'display: inline;' +
            'margin-right: 10px;' +
          '}' +
          '#cy-timesheet__week-of {' +
            'isplay: block !important;' +
            'line-height: 1.34;' +
            'white-space: pre-wrap;' +
            'color: #333;' +
          '}';
        document.head.appendChild(style);

        var enterTimeButton = document.querySelector('[data-automation-id=wd-CommandButton][title="Enter Time"]').parentNode;
        var quickEnterButton = enterTimeButton.cloneNode(true);
        quickEnterButton.removeChild(quickEnterButton.querySelector('[data-automation-id=dropdownArrow'));
        quickEnterButton.querySelector('[title="Enter Time"]').innerText = 'Quick Enter';
        quickEnterButton.querySelector('[data-automation-id=wd-CommandButton]').style.paddingLeft = 0;
        quickEnterButton.querySelector('[data-automation-id=wd-CommandButton]').style.borderRadius = '100px';
        quickEnterButton.querySelector('[data-automation-id=wd-CommandButton]').style.marginRight = 0;
        quickEnterButton.setAttribute('data-added-by-cy-timesheet-extension', 'true');
        enterTimeButton.parentNode.appendChild(quickEnterButton);

        quickEnterButton.onclick = function() {
            var body = document.querySelector('body');
            var popupContainer = document.createElement('div');
            popupContainer.id = 'cy-timesheet__popup-container';
            body.appendChild(popupContainer);

            var popupTable = document.createElement('div');
            popupTable.id = 'cy-timesheet__popup-table';
            popupContainer.appendChild(popupTable);

            var popupTableCell = document.createElement('div');
            popupTableCell.id = 'cy-timesheet__popup-table-cell';
            popupTable.appendChild(popupTableCell);

            var wdPopup = document.createElement('div');
            wdPopup.id = 'cy-timesheet__wd-popup';
            popupTableCell.appendChild(wdPopup);

            var wdPopupContent = document.createElement('div');
            wdPopupContent.id = 'cy-timesheet__wd-popup-content';
            wdPopup.appendChild(wdPopupContent);

            wdPopupContent.innerHTML =
                '<div>' +
                  '<div id="cy-timesheet__header">' +
                    '<div id="cy-timesheet__header-1">' +
                      '<div id="cy-timesheet__header-2">' +
                        '<h2>' +
                          '<span id="cy-timesheet__title">Quick Enter</span>' +
                          '<div id="cy-timesheet__week-of">Week of ...</div>' +
                        '</h2>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                  '<footer style="padding: 15px 0 0 0; text-align: left; border-top: 1px solid #ccc;">' +
                    '<div style="position: relative; z-index: 19">' +
                      '<div style="border-top: none; padding: 0; margin: 0; height: 53px; overflow: visible; background-color: rgba(255, 255, 255, 0.9); z-index: 1; position: static; width: auto; left: 0; bottom: 0; right: 0; white-space: nowrap; transform: translateZ(0);">' +
                        '<div style="margin-top: 0; margin-bottom: 0; vertical-align: middle; position: relative; display: inline-block; padding-right: 15px;">' +
                          '<div style="height: 35px; min-width: 112px; max-width: 100%; border-radius: 100px; display: inline-block; outline: none; position: relative;">' +
                            '<button style="height: 35px; padding-top: 8px; padding-bottom: 8px; cursor: pointer; color: white !important; background-color: #ffa126 !important; box-shadow: 0 0 0 1px #cad4d8 !important; padding: 10px 32px 10px; min-width: 112px; max-width: 100%; border-radius: 100px; line-height: 13px; overflow: hidden; font-weight: 500; box-sizing: border-box; transition: all 120ms ease-in; display: inline-block; position: relative; top: 0; font-size: 13px; text-align: center; user-select: none; outline: none; border: none; ">' +
                              '<span style="line-height: 14px; vertical-align: middle; max-width: 222px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; text-align: center; height: 20px; margin-left: 0; z-index: 1; text-decoration: none !important; color: white; font-size: 14px; font-weight: 500; display: inline-block; transition: all 120ms ease-in; width: 100%; background-color: transparent; position: relative; font-family: \"Roboto\", \"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif">OK</span>' +
                            '</button>' +
                          '</div>' +
                        '</div>' +
                        '<div style="margin-top: 0; margin-bottom: 0; vertical-align: top; min-width: 0; border-left: none; padding-left: 0; display: inline-block;">' +
                          '<div style="height: 35px; min-width: 112px; max-width: 100%; border-radius: 100px; display: inline-block; outline: none; position: relative;">' +
                            '<button style="height: 35px; padding-top: 8px; padding-bottom: 8px; cursor: pointer; color: #333 !important; background-color: #eef1f2 !important; box-shadow: 0 0 0 1px #cad4d8 !important; padding: 10px 32px 10px; min-width: 112px; max-width: 100%; border-radius: 100px; line-height: 13px; overflow: hidden; font-weight: 500; box-sizing: border-box; transition: all 120ms ease-in; display: inline-block; position: relative; top: 0; font-size: 13px; text-align: center; user-select: none; outline: none; border: none; ">' +
                              '<span style="line-height: 14px; vertical-align: middle; max-width: 222px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; text-align: center; height: 20px; margin-left: 0; z-index: 1; text-decoration: none !important; color: inherit; font-size: 14px; font-weight: 500; display: inline-block; transition: all 120ms ease-in; width: 100%; background-color: transparent; position: relative; font-family: \"Roboto\", \"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif">Cancel</span>' +
                            '</button>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</footer>' +
                '</div>';

            document.querySelector('[data-automation-id="wd-CommandButton"][title="Enter Time"]').click();
            document.querySelector('[data-automation-dropdown-option="dropdown-option"][data-automation-label="Enter Time"]').click();

            function getDate() {
                if (document.querySelector('[data-automation-id="tabLabel"]') == null) {
                    setTimeout(getDate, 100);
                    return;
                }
                var sundayDate = document.querySelector('[data-automation-id="tabLabel"]').innerText.split(', ')[1];
                document.getElementById('cy-timesheet__week-of').innerText = 'Week of ' + sundayDate;
            }

            getDate();
        };
    }

    window.addEventListener("load", setUp);

    var href = document.location.href;
    setInterval(function() {
        if (document.location.href !== href) {
            href = document.location.href;
            setUp();
        }
    }, 100);
})();
