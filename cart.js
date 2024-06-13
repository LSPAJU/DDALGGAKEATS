var cartList = [];
var paySum = 0;

function addMenuToCart(tabIndex, itemIndex) {
    var menudata = JSON.parse(itemList[tabIndex])[itemIndex];
    var menuItem = {
        img: menudata.src,
        name: menudata.name,
        price: parseInt(menudata.price.replace(/[^0-9]/g, ''), 10),
        cnt: 1,
        toppings: []
    };

    cartList.push(menuItem);
    updateCart();
}

function addToCart() {
    var selectedOption = document.querySelector('input[name="menu-option"]:checked').value;
    var menuItem = {
        img: currentMenu.src,
        name: currentMenu.name,
        price: parseInt(currentMenu.price.replace(/[^0-9]/g, ''), 10),
        cnt: 1,
        toppings: []
    };

    if (selectedOption === 'combo' || selectedOption === 'set') {
        if (selectedOption === 'combo') {
            menuItem.price += 300;
            menuItem.name += ' (콤보)';
            var selectedDrink = document.querySelector('input[name="combo-drink"]:checked').value;
            menuItem.toppings.push('음료수: ' + selectedDrink);
            menuItem.price += getDrinkPriceDifference('코카콜라', selectedDrink);
        } else if (selectedOption === 'set') {
            menuItem.price += 700;
            menuItem.name += ' (세트)';
            var selectedSide = document.querySelector('input[name="set-side"]:checked').value;
            var selectedDrink = document.querySelector('input[name="set-drink"]:checked').value;
            menuItem.toppings.push('음료수: ' + selectedDrink);
            menuItem.toppings.push('사이드: ' + selectedSide);
            menuItem.price += getSidePriceDifference('감자튀김', selectedSide);
            menuItem.price += getDrinkPriceDifference('코카콜라', selectedDrink);
        }
    }

    cartList.push(menuItem);
    updateCart();
    closePopup();
}

function getSidePriceDifference(defaultItem, selectedItem) {
    var sidePriceDifferences = {
        '감자튀김': 0,
        '양념감자': 500,
        '웨지감자': 0,
        '체다치즈 감자튀김': 1000,
        '치즈스틱': 300,
        '롱치즈스틱': 800,
        '치킨윙': 1500,
        '치킨텐더': 800
    };

    return sidePriceDifferences[selectedItem];
}

function getDrinkPriceDifference(defaultItem, selectedItem) {
    var drinkPriceDifferences = {
        '코카콜라': 0,
        '코카콜라 제로': 0,
        '펩시 제로': 0,
        '환타': 0,
        '사이다': 0,
        '스프라이트': 0,
        '밀크쉐이크': 2500
    };

    return drinkPriceDifferences[selectedItem];
}

function updateCart() {
    var cartItemsContainer = document.getElementById('cart-items');
    var cartTotalContainer = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = "";
    paySum = 0;

    cartList.forEach(function (item, index) {
        var itemHtml = '<div class="cart-item">';
        itemHtml += '<img src="' + item.img + '" width=50px height=50px>';
        itemHtml += '<div class="details">';
        itemHtml += '<div>' + item.name + '</div>';
        if (item.toppings && item.toppings.length > 0) {
            item.toppings.forEach(function (topping) {
                itemHtml += '<div class="toppings">' + topping + '</div>';
            });
        }
        itemHtml += '<div>' + addComma(item.price) + '원</div>';
        itemHtml += '</div>';
        itemHtml += '<div class="controls">';
        itemHtml += '<button onclick="changeItemCount(' + index + ', -1)">-1</button>';
        itemHtml += '<span>' + item.cnt + '</span>';
        itemHtml += '<button onclick="changeItemCount(' + index + ', 1)">+1</button>';
        itemHtml += '<button onclick="removeFromCart(' + index + ')">제거</button>';
        itemHtml += '</div>';
        itemHtml += '</div>';

        cartItemsContainer.innerHTML += itemHtml;
        paySum += item.price * item.cnt;
    });

    cartTotalContainer.innerText = "총액: " + addComma(paySum) + "원";
}

function changeItemCount(index, change) {
    if (cartList[index].cnt + change > 0) {
        cartList[index].cnt += change;
        updateCart();
    }
}

function removeFromCart(index) {
    cartList.splice(index, 1);
    updateCart();
}

function proceedToPayment() {
    if (cartList.length === 0 || paySum === 0) {
        alert("상품을 골라주세요!");
    } else {
        localStorage.setItem('cartList', JSON.stringify(cartList));
        localStorage.setItem('paySum', paySum);
        window.location.href = 'cost.html';
    }
}

function addComma(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}