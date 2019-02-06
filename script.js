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
  if (!Array.prototype.filter){
    Array.prototype.filter = function(func, thisArg) {
        'use strict';
        if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
            throw new TypeError();

        var len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;
        if (thisArg === undefined){
          while (++i !== len){
            // checks to see if the key was set
            if (i in this){
              if (func(t[i], i, t)){
                res[c++] = t[i];
              }
            }
          }
        }
        else{
          while (++i !== len){
            // checks to see if the key was set
            if (i in this){
              if (func.call(thisArg, t[i], i, t)){
                res[c++] = t[i];
              }
            }
          }
        }

        res.length = c; // shrink down array to proper size
        return res;
      };
    }

    'use strict';

    var forceResetup = false;

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

        if (document.querySelector('[data-automation-id="tabLabel"]') != null) {
            return;
        }

        forceResetup = false;

        var style = document.createElement('style');
        style.innerText =
          '#cy-timesheet__popup-container {' +
            'z-index: 55;' +
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
            'display: block !important;' +
            'line-height: 1.34;' +
            'white-space: pre-wrap;' +
            'color: #333;' +
          '}' +
          '#cy-timesheet__page-content-wrapper {' +
            'padding: 0 10px;' +
            'background-color: white;' +
            'min-height: 30px;' +
            'position: relative;' +
            'z-index: 0;' +
            'border-radius: 0;' +
            'box-shadow: none;' +
          '}' +
          '#cy-timesheet__page-content {' +
            'text-align: left;' +
            'padding: 8px 0 8px 0;' +
          '}' +
          '#cy-timesheet__table {' +
            'width: 100%;' +
          '}' +
          '#cy-timesheet__table td, #cy-timesheet__table th {' +
            'padding: 5px;' +
          '}' +
          '#cy-timesheet__table input {' +
            'height: 30px;' +
            'font-size: 13px;' +
            'color: #4a4a4a;' +
            'border: none;' +
            'box-shadow: 0 0 0 1px #cad4d8;' +
            'border-radius: 3px;' +
            'background-color: white;' +
            '-webkit-appearance: none;' +
            'padding: 0 4px 0 5px;' +
          '}' +
          '#cy-timesheet__footer {' +
            'padding: 15px 0 0 0;' +
            'text-align: left;' +
            'border-top: 1px solid #ccc;' +
          '}' +
          '#cy-timesheet__footer-content-container {' +
            'border-top: none;' +
            'padding: 0;' +
            'margin: 0;' +
            'height: 53px;' +
            'overflow: visible;' +
            'background-color: rgba(255, 255, 255, 0.9);' +
            'z-index: 1;' +
            'position: static;' +
            'width: auto;' +
            'left: 0;' +
            'bottom: 0;' +
            'right: 0;' +
            'white-space: nowrap;' +
            'transform: translateZ(0);' +
          '}' +
          '#cy-timesheet__ok-button-container-wrapper {' +
            'margin-top: 0;' +
            'margin-bottom: 0;' +
            'vertical-align: middle;' +
            'position: relative;' +
            'display: inline-block;' +
            'padding-right: 15px;' +
          '}' +
          '#cy-timesheet__cancel-button-container-wrapper {' +
            'margin-top: 0;' +
            'margin-bottom: 0;' +
            'vertical-align: top;' +
            'min-width: 0;' +
            'border-left: none;' +
            'padding-left: 0;' +
            'display: inline-block;' +
          '}' +
          '#cy-timesheet__footer-content-container .cy-timesheet__button-wrapper {' +
            'height: 35px;' +
            'min-width: 112px;' +
            'max-width: 100%;' +
            'border-radius: 100px;' +
            'display: inline-block;' +
            'outline: none;' +
            'position: relative;' +
          '}' +
          '#cy-timesheet__footer-content-container .cy-timesheet__button {' +
            'height: 35px;' +
            'padding-top: 8px;' +
            'padding-bottom: 8px;' +
            'cursor: pointer;' +
            'box-shadow: 0 0 0 1px #cad4d8 !important;' +
            'padding: 10px 32px 10px;' +
            'min-width: 112px;' +
            'max-width: 100%;' +
            'border-radius: 100px;' +
            'line-height: 13px;' +
            'overflow: hidden;' +
            'font-weight: 500;' +
            'box-sizing: border-box;' +
            'transition: all 120ms ease-in;' +
            'display: inline-block;' +
            'position: relative;' +
            'top: 0;' +
            'font-size: 13px;' +
            'text-align: center;' +
            'user-select: none;' +
            'outline: none;' +
            'border: none;' +
          '}' +
          '#cy-timesheet__ok-button {' +
            'color: white !important;' +
            'background-color: #ffa126 !important;' +
          '}' +
          '#cy-timesheet__cancel-button {' +
            'color: #333 !important;' +
            'background-color: #eef1f2 !important;' +
          '}' +
          '#cy-timesheet__footer-content-container .cy-timsheet__button span {' +
            'line-height: 14px;'
            'vertical-align: middle;'
            'max-width: 222px;' +
            'white-space: nowrap;' +
            'text-overflow: ellipsis;' +
            'overflow: hidden;' +
            'text-align: center;' +
            'height: 20px;' +
            'margin-left: 0;' +
            'z-index: 1;' +
            'text-decoration: none !important;' +
            'color: inherit;' +
            'font-size: 14px;' +
            'font-weight: 500;' +
            'display: inline-block;' +
            'transition: all 120ms ease-in;' +
            'width: 100%;' +
            'background-color: transparent;' +
            'position: relative;' +
            'font-family: \"Roboto\", \"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif;' +
          '}';
        document.head.appendChild(style);

        var enterTimeButton = document.querySelector('[data-automation-id=wd-CommandButton][title="Enter Time"]').parentNode;
        var quickEnterButton = enterTimeButton.cloneNode(true);
        quickEnterButton.removeChild(quickEnterButton.querySelector('[data-automation-id=dropdownArrow'));
        quickEnterButton.querySelector('[title="Enter Time"]').innerText = 'Auto Enter';
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

            popupContainer.onclick = function(e) { e.stopPropagation(); };
            popupContainer.onfocus = function(e) { e.stopPropagation(); };

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
                          '<span id="cy-timesheet__title">Auto Enter</span>' +
                          '<div id="cy-timesheet__week-of">Week of ...</div>' +
                        '</h2>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                  '<div id="cy-timesheet__page-content-wrapper">' +
                    '<div id="cy-timesheet__page-content">' +
                      '<table id="cy-timesheet__table">' +
                        '<tr style="font-weight: bold">' +
                          '<th>Day</th>' +
                          '<th>Service</th>' +
                          '<th>Training</th>' +
                          '<th>Meal\/Break</th>' +
                        '</tr>' +
                        '<tr>' +
                          '<td>Monday</td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="9.5"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0.5"></input></td>' +
                        '</tr>' +
                        '<tr>' +
                          '<td>Tuesday</td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="9.5"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0.5"></input></td>' +
                        '</tr>' +
                        '<tr>' +
                          '<td>Wednesday</td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="9.5"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0.5"></input></td>' +
                        '</tr>' +
                        '<tr>' +
                          '<td>Thursday</td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="9.5"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0.5"></input></td>' +
                        '</tr>' +
                        '<tr>' +
                          '<td>Friday</td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="9.5"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0"></input></td>' +
                          '<td><input type="number" step="0.25" min="0" max="24" value="0.5"></input></td>' +
                        '</tr>' +
                      '</table>' +
                    '</div>' +
                  '</div>' +
                  '<footer id="cy-timesheet__footer">' +
                    '<div style="position: relative; z-index: 19">' +
                      '<div id="cy-timesheet__footer-content-container">' +
                        '<div id="cy-timesheet__ok-button-container-wrapper">' +
                          '<div class="cy-timesheet__button-wrapper">' +
                            '<button id="cy-timesheet__ok-button" class="cy-timesheet__button">' +
                              '<span>OK</span>' +
                            '</button>' +
                          '</div>' +
                        '</div>' +
                        '<div id="cy-timesheet__cancel-button-container-wrapper">' +
                          '<div class="cy-timesheet__button-wrapper">' +
                            '<button id="cy-timesheet__cancel-button" class="cy-timesheet__button">' +
                              '<span>Cancel</span>' +
                            '</button>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</footer>' +
                '</div>';

            document.querySelector('[data-automation-id="wd-CommandButton"][title="Enter Time"]').click();
            document.querySelector('[data-automation-dropdown-option="dropdown-option"][data-automation-label="Enter Time"]').click();

            var canceled = false;
            var cancelButton = document.getElementById('cy-timesheet__cancel-button');
            cancelButton.onclick = function() {
              body.removeChild(popupContainer);
              document.querySelector('[data-automation-id="wd-CommandButton_uic_cancelButton"]').click();
              forceResetup = true;
              canceled = true;
            };

            var typesSet = false;

            getDate();

            function getDate() {
                if (canceled) {
                  return;
                }
                if (document.querySelector('[data-automation-id="tabLabel"]') == null) {
                    setTimeout(getDate, 20);
                    return;
                }
                var sundayDate = document.querySelectorAll('[data-automation-id="tabLabel"]')[1].innerText.split(', ')[1];
                document.getElementById('cy-timesheet__week-of').innerText = 'Week of ' + sundayDate;

                var okButton = document.getElementById('cy-timesheet__ok-button');
                okButton.onclick = function() {
                  okButton.disabled = true;
                  okButton.onclick = null;
                  cancelButton.disabled = true;
                  cancelButton.onclick = null;

                  var data = [];
                  var rows = document.querySelectorAll('#cy-timesheet__table tr');
                  rows = Array.prototype.slice.call(rows);
                  rows.splice(0, 1);
                  rows.forEach(function(row) {
                    var inputs = row.querySelectorAll('input');
                    var service = inputs[0].value;
                    var training = inputs[1].value;
                    var meal = inputs[2].value;
                    data.push([service, training, meal]);
                  });

                  document.querySelector('#cy-timesheet__page-content').innerHTML = 'This will take a minute or so...';

                  setTypes();

                  function enterData() {
                    if (canceled) {
                      return;
                    }
                    if (!typesSet) {
                      setTimeout(enterData, 30);
                      return;
                    }

                    var tabs = document.querySelectorAll('[id^="wd-timeEntryList-"]');
                    var i = 1;

                    data.forEach(function(d) {
                      var inputs = tabs[i].querySelectorAll('[data-automation-id="numericInput"]');
                      inputs[0].value = d[0];
                      fireChange(inputs[0]);
                      inputs[1].value = d[1];
                      fireChange(inputs[1]);
                      inputs[2].value = d[2];
                      fireChange(inputs[2]);

                      function fireChange(element) {
                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", false, true);
                            element.dispatchEvent(evt);
                        } else {
                            element.fireEvent("onchange");
                        }
                      }

                      i++;
                    });

                    body.removeChild(popupContainer);
                    document.querySelector('[data-automation-id="wd-CommandButton_uic_okButton"]').click();
                  }

                  enterData();
                };
            }

            function setTypes() {
              if (canceled) {
                return;
              }
              if (document.querySelector('[id^="wd-timeEntryList-"]') == null) {
                  setTimeout(setTypes, 20);
                  return;
              }

              var tabs = document.querySelectorAll('[id^="wd-timeEntryList-"]');

              setTypesOnTab(1);

              function setTypesOnTab(index) {
                if (canceled) {
                  return;
                }
                document.querySelectorAll('[data-automation-id="tabLabel"]')[index].click();
                var blocks = tabs[index].querySelectorAll('div');
                blocks = Array.prototype.slice.call(blocks);
                blocks = blocks.filter(function(b) { return b.parentNode === tabs[index]; });

                setTypeOnBlock(0);

                function setTypeOnBlock(blockIndex) {
                  if (canceled) {
                    return;
                  }
                  var block = blocks[blockIndex];
                  var typeName;
                  if (blockIndex === 0) {
                    typeName = 'Service';
                  } else if (blockIndex === 1) {
                    typeName = 'Training';
                  } else if (blockIndex === 2) {
                    typeName = 'Meal/Break';
                  }
                  block.querySelector('[data-automation-id="promptIcon"]').click();
                  var intervalId = setInterval(function() {
                    if (canceled) {
                      clearInterval(intervalId);
                      return;
                    }
                    if (document.querySelector('[aria-label="Submenu Time Entry Codes"]') == null) {
                      return;
                    }
                    clearInterval(intervalId);
                    document.querySelector('[aria-label="Submenu Time Entry Codes"]').click();
                    var innerIntervalId = setInterval(function() {
                      if (canceled) {
                        clearInterval(innerIntervalId);
                        return;
                      }
                      if (document.querySelector('[aria-label="Time Entry Codes"] [data-automation-label="' + typeName + '"][id^="promptOption"]') == null) {
                        return;
                      }
                      clearInterval(innerIntervalId);
                      document.querySelector('[aria-label="Time Entry Codes"] [data-automation-label="' + typeName + '"][id^="promptOption"]').click();

                      var lastIntervalId = setInterval(function() {
                        if (canceled) {
                          clearInterval(lastIntervalId);
                          return;
                        }
                        var elem = document.querySelector('[data-automation-id="itemBrowser"]');
                        if (elem != null) {
                          elem.remove();
                        }
                        if (document.querySelector('[aria-label="Submenu Time Entry Codes"]') != null) {
                          return;
                        }
                        clearInterval(lastIntervalId);

                        if (blockIndex < blocks.length - 1) {
                          setTypeOnBlock(blockIndex + 1);
                        } else if (index < 5) {
                          setTypesOnTab(index + 1);
                        } else {
                          // All done
                          typesSet = true;
                        }
                      }, 10);
                    }, 10);
                  }, 10);
                }
              }
            }
        };
    }

    window.addEventListener("load", setUp);

    setInterval(setUp, 100);
})();
