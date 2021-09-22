//  Created by https://github.com/kyujin-cho

console.log('loading injectPrice.js');

async function getItemDiscountPrice(row) {
    const productPrice = parseInt(row.getElementsByClassName('prod-sale-original__price')[0]?.innerText.replace(/,/g, ''))
    if (!productPrice) return
    let discountedPrice = parseInt(row.getElementsByClassName('prod-coupon-price')[0].innerText.replace(/,/g, ''))
    if (isNaN(discountedPrice)) {
        discountedPrice = parseInt(row.getElementsByClassName('prod-sale-price')[0].innerText.replace(/,/g, ''))
    }
    const productId = row.querySelector('button.offer-item-cart').getAttribute('data-vendor-item-id')

    const clickProductId = /\/vp\/products\/([0-9]+)\/item/.exec(window.location.pathname)[1]

    // Add item to cart
    const addCartResponse = await fetch(`https://www.coupang.com/vp/cart/${clickProductId}/items`, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-requested-with": ""
        },
        "body": `items%5B%5D=${productId}%3A+1`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    const addCartResponseJSON = await addCartResponse.json()
    const cartItemId = addCartResponseJSON.resultContents[0].cartId

    // Get current discount information
    const resp = await fetch('https://cart.coupang.com/benefit/cartbenefit', {
        mode: 'cors',
        credentials: 'include',
        method: 'POST',
        headers: {
            Accept: 'application/json, text/javascript,  */*; q=0.01',
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify([
            {
                vendorItemId: productId,
                quantity: 1,
                totalSalePrice: productPrice
            }
        ])
    })
    const json = await resp.json()
    let realPrice = discountedPrice
    if (json.ccidAmount && json.ccidAmount > 0) {
        realPrice -= json.ccidAmount
    }

    const priceString = new Intl.NumberFormat('ko-KR', { style: 'decimal'}).format(realPrice)
    const elem = row.querySelector('.offer-item-info.offer-item-price')
    const existingPriceInformation = row.getElementsByClassName('prod-cart-coupon-price')
    if (existingPriceInformation.length > 0) {
        row.removeChild(existingPriceInformation[0])
    }
    const newElem = document.createElement('div')
    newElem.className = 'prod-coupon-price prod-cart-coupon-price'
    newElem.innerHTML = `<span>실구매가</span> <strong>${priceString}</strong><span>원</span>`
    elem.appendChild(newElem)

    // clear cart
    await fetch(`https://cart.coupang.com/api/memberCartItem/deleteItems?cartItemIds[]=${cartItemId}&itemStatus=CHECKED`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
    })
}

async function checkCartPrice() {
    // load current cart information
    const cartResponse = await fetch('https://cart.coupang.com/api/cart/content?t=' + Date.now(), {
        mode: 'cors',
        credentials: 'include'
    })
    const cartHTML = await cartResponse.text()
    const html = document.createElement('html')
    html.innerHTML = cartHTML
    
    const currentItems = Array.from(html.getElementsByClassName('cart-deal-item')).map((el) => el.getAttribute('data-bundle-id'))

    // clear cart
    await fetch(`https://cart.coupang.com/api/memberCartItem/deleteItems?cartItemIds[]=${currentItems.join(',')}&itemStatus=CHECKED`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
    })
    const rows = document.querySelectorAll('table.offer-list-table tbody tr.offer-item')
    for (const row of rows) {
        await getItemDiscountPrice(row)
    }
}

if (document.getElementsByName('coupangButton').length == 0) {
    const style = 'margin-top: 12px;border: 0 none;border-radius: 2px;outline: none;background: #346aff;cursor: pointer;display: inline-block;padding: 10px 0;font-weight: 700;text-align: center;color: #fff;width: 120px;height: 35px;'
    const targetBody = document.querySelector('.offer-product-summary')
    const button = document.createElement('button')
    
    button.name = 'coupangButton';
    button.setAttribute('style', style)
    button.innerText = '실구매가 체크'
    button.addEventListener('click', checkCartPrice)
    targetBody.appendChild(button);
}
