// Clear cart explicitly on hard page reload to support prototyping workflow
if (typeof performance !== 'undefined') {
    const isReload = (performance.navigation && performance.navigation.type === 1) || 
                     (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]?.type === "reload");
    if (isReload) {
        localStorage.removeItem('aldeno_cart');
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('aldeno_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('aldeno_cart', JSON.stringify(cart));
}

function addToCart(product, size, qty = 1) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === size);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({ ...product, size, quantity: qty });
    }
    saveCart(cart);
}

function updateCartQuantity(id, size, newQty) {
    let cart = getCart();
    if(newQty <= 0) {
        cart = cart.filter(item => !(item.id === id && item.size === size));
    } else {
        const item = cart.find(item => item.id === id && item.size === size);
        if (item) item.quantity = newQty;
    }
    saveCart(cart);
}

function getCartTotals() {
    const cart = getCart();
    let totalItems = 0;
    let subtotal = 0;
    let originalTotal = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += (item.price * item.quantity);
        originalTotal += (item.oldPrice * item.quantity);
    });

    let discountPercentage = 0;
    if (totalItems >= 4) {
        discountPercentage = 0.30; // 30%
    } else if (totalItems === 3) {
        discountPercentage = 0.25; // 25%
    } else if (totalItems === 2) {
        discountPercentage = 0.20; // 20%
    }

    const bundleDiscount = Math.round(subtotal * discountPercentage);
    const total = subtotal - bundleDiscount;

    return {
        totalItems,
        subtotal,
        originalTotal,
        bundleDiscount,
        total,
        discountPercentage
    };
}
