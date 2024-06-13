// menu.js
window.onload = function () {
    getItem();
    showMenu(0);
};

function getItem() {
    var menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = "";

    for (var i = 0; i < arrTabList.length; i++) {
        var menudata = JSON.parse(itemList[i]);
        var menuHtml = '<div class="menu-category" id="menu-category-' + i + '" style="display:none;">';

        for (var j = 0; j < menudata.length; j++) {
            menuHtml += '<div class="menu" onclick="handleMenuClick(' + i + ', ' + j + ');">';
            menuHtml += '<img src="' + menudata[j].src + '" width="250px" height="250px">';
            menuHtml += '<div>' + menudata[j].name + '</div>';
            menuHtml += '<div>' + menudata[j].price + '</div>';
            menuHtml += '</div>';
        }

        menuHtml += '</div>';
        menuContainer.innerHTML += menuHtml;
    }
}

function showMenu(tabNum) {
    for (var i = 0; i < arrTabList.length; i++) {
        var category = document.getElementById('menu-category-' + i);
        var tabButton = document.getElementById('tab-' + i);
        if (i === tabNum) {
            category.style.display = 'flex';
            category.style.flexWrap = 'wrap';
            category.style.justifyContent = 'center';
            tabButton.style.backgroundColor = '#007bff';
            tabButton.style.color = '#ffffff';
        } else {
            category.style.display = 'none';
            tabButton.style.backgroundColor = '#ffffff';
            tabButton.style.color = '#007bff';
        }
    }
}

var currentMenu;
var currentMenuIndex;
var currentMenuTabIndex;

function handleMenuClick(tabIndex, itemIndex) {
    var menudata = JSON.parse(itemList[tabIndex])[itemIndex];
    currentMenu = menudata;
    currentMenuIndex = itemIndex;
    currentMenuTabIndex = tabIndex;

    if (menudata.type === 'hamburger') {
        openMenuPopup();
    } else {
        addMenuToCart(tabIndex, itemIndex);
    }
}

function openMenuPopup() {
    document.getElementById('popup-menu-name').innerText = currentMenu.name;
    document.querySelector('input[name="menu-option"][value="original"]').checked = true;
    document.getElementById('combo-options').style.display = 'none';
    document.getElementById('set-options').style.display = 'none';
    document.getElementById('menu-popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('menu-popup').style.display = 'none';
}

document.querySelectorAll('input[name="menu-option"]').forEach(function(input) {
    input.addEventListener('change', function() {
        if (this.value === 'combo') {
            document.getElementById('combo-options').style.display = 'block';
            document.getElementById('set-options').style.display = 'none';
        } else if (this.value === 'set') {
            document.getElementById('combo-options').style.display = 'none';
            document.getElementById('set-options').style.display = 'block';
        } else {
            document.getElementById('combo-options').style.display = 'none';
            document.getElementById('set-options').style.display = 'none';
        }
    });
});

function addToCart() {
    var selectedOption = document.querySelector('input[name="menu-option"]:checked').value;
    var menuItem = {
        img: currentMenu.src,
        name: currentMenu.name + ' (' + selectedOption + ')',
        price: parseInt(currentMenu.price.replace(/[^0-9]/g, ''), 10),
        cnt: 1,
        toppings: []
    };

    if (selectedOption === 'combo' || selectedOption === 'set') {
        if (selectedOption === 'combo') {
            menuItem.price += 300;
            menuItem.toppings.push('음료수: ' + document.querySelector('input[name="combo-drink"]:checked').value);
        } else if (selectedOption === 'set') {
            menuItem.price += 700;
            menuItem.toppings.push('음료수: ' + document.querySelector('input[name="set-drink"]:checked').value);
            menuItem.toppings.push('사이드: ' + document.querySelector('input[name="set-side"]:checked').value);
        }
    }

    cartList.push(menuItem);
    updateCart();
    closePopup();
}