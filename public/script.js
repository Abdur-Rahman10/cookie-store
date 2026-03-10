'use strict';

// STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('cookieCart')) || [];
let appliedCoupon = null; 
let activePincode = null; // 📍 NEW: Track the user's PIN code

const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount-amount');
const deliveryEl = document.getElementById('delivery-fee'); // 📍 NEW
const finalTotalEl = document.getElementById('final-total');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

const cartIcon = document.getElementById('cart-icon');
const sideCart = document.getElementById('side-cart');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');

const couponInput = document.getElementById('coupon-code');
const applyCouponBtn = document.getElementById('apply-coupon');
const couponMessage = document.getElementById('coupon-message');
const pincodeInput = document.getElementById('pincode-input'); 
const applyPincodeBtn = document.getElementById('apply-pincode');
const pincodeMessage = document.getElementById('pincode-message');

const coupons = {
    'WELCOME10': { code: 'WELCOME10', type: 'percent', value: 0.10, min: 0 }, 
    'SWEET50': { code: 'SWEET50', type: 'flat', value: 50, min: 300 } 
};

updateCart();

// ADD TO CART
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({ name, price, quantity: 1 }); 
    }
    updateCart();
    showNotification();
}

// UPDATE CART
function updateCart() {
    localStorage.setItem('cookieCart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item-row');
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <span class="item-total">₹${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" data-index="${index}">❌</button>
            </div>
        `;
        cartItems.appendChild(itemEl);
        subtotal += (item.price * item.quantity);
    });
    
    calculateTotals(subtotal);
}

// CALCULATE TOTALS
function calculateTotals(subtotal) {
    let discount = 0;
    
    // Process Coupon
    if (appliedCoupon) {
        if (subtotal >= appliedCoupon.min) {
            discount = appliedCoupon.type === 'percent' ? subtotal * appliedCoupon.value : appliedCoupon.value;
            couponMessage.textContent = `✅ Coupon '${appliedCoupon.code}' applied!`;
            couponMessage.style.color = '#27ae60';
        } else {
            discount = 0;
            couponMessage.textContent = `⚠️ '${appliedCoupon.code}' requires ₹${appliedCoupon.min} minimum.`;
            couponMessage.style.color = '#e67e22'; 
        }
    } else if (couponMessage.textContent.includes('✅') || couponMessage.textContent.includes('⚠️')) {
        couponMessage.textContent = '';
    }

    // Process Delivery Fee
    let deliveryFee = 0;
    if (activePincode) {
        const pin = parseInt(activePincode);
        if (subtotal >= 500) {
            deliveryFee = 0;
            pincodeMessage.textContent = '🎉 Qualifies for FREE Delivery!';
            pincodeMessage.style.color = '#27ae60';
        } else if (pin >= 560001 && pin <= 560111) {
            deliveryFee = 40;
            pincodeMessage.textContent = '📍 Local City Delivery Applied';
            pincodeMessage.style.color = '#2c3e50';
        } else {
            deliveryFee = 100;
            pincodeMessage.textContent = '🚚 Out of station Delivery Applied';
            pincodeMessage.style.color = '#2c3e50';
        }
    } else {
        pincodeMessage.textContent = 'Enter PIN to calculate delivery';
        pincodeMessage.style.color = '#7f8c8d';
    }
    
    const finalTotal = subtotal - discount + deliveryFee;
    
    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    discountEl.textContent = `-₹${discount.toFixed(2)}`;
    deliveryEl.textContent = `+₹${deliveryFee.toFixed(2)}`;
    finalTotalEl.textContent = `₹${Math.max(0, finalTotal).toFixed(2)}`; 
}

// SIDE CART UI TOGGLES
function openCart() { sideCart.classList.add('open'); cartOverlay.classList.add('open'); }
function closeCart() { sideCart.classList.remove('open'); cartOverlay.classList.remove('open'); }
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart); 

cartItems.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        const index = e.target.getAttribute('data-index');
        cart.splice(index, 1);
        updateCart();
    }
});

addToCartBtns.forEach(button => {
    button.addEventListener('click', function() {
        addToCart(this.getAttribute('data-name'), parseFloat(this.getAttribute('data-price')));
    });
});

// Coupon Logic
applyCouponBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (coupons[code]) {
        appliedCoupon = coupons[code]; 
        couponInput.value = ''; 
        updateCart(); 
    } else {
        appliedCoupon = null;
        couponMessage.textContent = '❌ Invalid coupon code';
        couponMessage.style.color = '#e74c3c';
        updateCart();
    }
});

// Pincode Logic
applyPincodeBtn.addEventListener('click', () => {
    const pin = pincodeInput.value.trim();
    if (pin.length === 6 && !isNaN(pin)) {
        activePincode = pin;
        updateCart();
    } else {
        activePincode = null;
        pincodeMessage.textContent = '❌ Please enter a valid 6-digit PIN';
        pincodeMessage.style.color = '#e74c3c';
        updateCart();
    }
});

checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return alert('Your cart is empty!');
    if (!activePincode) return alert('Please enter a delivery PIN code before checking out!');

    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;
    
    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cart: cart, 
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                pincode: activePincode
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`✅ ${data.message}\n\n--- OFFICIAL RECEIPT ---\nSubtotal: ₹${data.receipt.subtotal}\nDiscount: -₹${data.receipt.discount}\nDelivery: ₹${data.receipt.delivery}\n\nTOTAL CHARGED: ₹${data.receipt.total}\n------------------------`);
            
            cart = [];
            appliedCoupon = null;
            activePincode = null;
            couponInput.value = '';
            pincodeInput.value = '';
            couponMessage.textContent = '';
            pincodeMessage.textContent = '';
            updateCart();
            closeCart();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Checkout failed:', error);
        alert('Could not connect to the server. Please try again later.');
    } finally {
        checkoutBtn.textContent = 'Proceed to Checkout';
        checkoutBtn.disabled = false;
    }
});

// CLEAR CART LOGIC
const clearCartBtn = document.getElementById('clear-cart-link');

clearCartBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    if (confirm('Are you sure you want to remove all items from your cart?')) {
        cart = [];
        appliedCoupon = null;
        activePincode = null;
        
        couponInput.value = '';
        pincodeInput.value = '';
        
        couponMessage.textContent = '';
        pincodeMessage.textContent = '';
        
        updateCart();
        alert('Cart cleared!');
    }
});

// PROMO BANNER & NOTIFICATIONS
const promoBanner = document.getElementById('promo-banner');
const closePromoBtn = document.getElementById('close-promo');
if (sessionStorage.getItem('promoClosed') === 'true') { promoBanner.style.display = 'none'; }
closePromoBtn.addEventListener('click', () => {
    promoBanner.style.marginTop = `-${promoBanner.offsetHeight}px`;
    setTimeout(() => {
        promoBanner.style.display = 'none';
        sessionStorage.setItem('promoClosed', 'true');
    }, 300);
});

function showNotification() {
    const notification = document.createElement('div');
    notification.textContent = '🍪 Added to cart!';
    notification.classList.add('toast-notification'); 
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
}