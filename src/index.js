var form = document.getElementById('settings-form');
var clickSound = document.getElementById('click-sound');
var backgroundSound = document.getElementById('background-sound');
var toggleBackgroundSoundButton = document.getElementById('toggle-background-sound');
var settingsContainer = document.getElementById('settings-container');
var title = document.getElementById('title');
var gridContainer = document.getElementById('grid-container');
var gridWidthInput = document.getElementById('grid-width');
var gridHeightInput = document.getElementById('grid-height');
var numberToWinInput = document.getElementById('number-to-win');

var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
var settings = {
  gridWidth: 2,
  gridHeight: 2,
  numberToWin: 2,
};

function renderGrid() {
    console.log('rendering grid');
    var rows = '';
    for(var y = 0; y < settings.gridHeight; y += 1) {
        rows += '<tr pos="' + y + '">';
        for(var x = 0; x < settings.gridWidth; x += 1) {
            rows += '<td pos="' + x + '"></td>'
        }
        rows += '</tr>';
    }
    var grid =  '' +
        '<table>' +
        '<tbody>' +
        rows +
        '</tbody>' +
        '</table>';
    gridContainer.innerHTML = grid;
}

function updateTheme() {
    console.log('updating theme');
    var color = colors[Math.floor(Math.random() * colors.length)];
    settingsContainer.style.background = color;
    title.style.color = color;
}

function updateSettings (
    gridWidth = settings.gridWidth,
    gridHeight = settings.gridHeight,
    numberToWin = settings.numberToWin
) {
    console.log('updating settings');
    settings.gridWidth = parseInt(gridWidth, 10);
    settings.gridHeight = parseInt(gridHeight, 10);
    settings.numberToWin = parseInt(numberToWin, 10);
    gridWidthInput.value = settings.gridWidth;
    gridHeightInput.value = settings.gridHeight;
    numberToWinInput.value = settings.numberToWin;
    updateTheme();
    renderGrid();
}

function serialize (form) {
    var field,
        l,
        s = [];

    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;

        for (var i = 0; i < len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'button' && field.type != 'file' && field.type != 'hidden' && field.type != 'reset' && field.type != 'submit') {
                if (field.type == 'select-multiple') {
                    l = form.elements[i].options.length;

                    for (var j = 0; j < l; j++) {
                        if (field.options[j].selected) {
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                        }
                    }
                }
                else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
    }
    return s.join('&').replace(/%20/g, '+');
}

function serializedToObject (data) {
    var vals = data.split('&');
    var obj = {};
    for (var i = 0; i < vals.length; i += 1) {
        var s = vals[i].split('=');
        obj[s[0]] = s[1];
    }
    return obj;
}

function handleSettingsSubmit(ev) {
    ev.preventDefault();
    var fd = serializedToObject(serialize(form));
    updateSettings(
        fd['grid-width'],
        fd['grid-height'],
        fd['number-to-win'],
    );
}

function playChoiceSound() {
    clickSound.play();
}

function applyChoice (el, player = 1) {
    var classList = el.classList;
    var style = el.style;
    if (classList.contains('chosen')) {
        return;
    }
    classList.add('chosen');
    classList.add('player' + 1);
    style.backgroundImage = 'url(assets/img/toad' + player + '.png)';
    playChoiceSound();
};

function handleGridClick (ev) {
    ev.preventDefault();
    var td = ev.target;
    if (td.tagName !== 'TD') {
        return;
    }
    updateTheme();
    var tr = td.parentElement;
    var y = tr.getAttribute('pos');
    var x = td.getAttribute('pos');
    console.log('x: ' + x + ' y: ' + y);
    applyChoice(td);
}

function handleBackgroundSoundToggle(ev) {
    ev.preventDefault();
    if (backgroundSound.volume === 0) {
        backgroundSound.volume = 1;
    } else {
        backgroundSound.volume = 0;
    }
}

function init() {
    form.addEventListener('submit', handleSettingsSubmit);
    toggleBackgroundSoundButton.addEventListener('click', handleBackgroundSoundToggle);
    gridContainer.addEventListener('click', handleGridClick);
    updateSettings(
        3,
        3,
        3,
    );
    renderGrid();
}

init();
