// Initialize cart
let cart = [];

// Add to cart function
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    
    // Show animation feedback
    const notification = document.createElement('div');
    notification.textContent = '🍪 Added to cart!';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#b0e0e6';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.animation = 'fadeIn 0.5s, fadeOut 0.5s 2s forwards';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    cartCount.textContent = cart.length;
    
    // Clear current cart items
    cartItems.innerHTML = '';
    
    // Calculate total
    let total = 0;
    
    // Add each item to cart display
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.style.display = 'flex';
        itemElement.style.justifyContent = 'space-between';
        itemElement.style.marginBottom = '10px';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>₹${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})" style="padding: 0 5px;">❌</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });
    
    // Update total display
    cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
}

// Remove from cart function
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Thank you for your order!\nTotal: ₹${total.toFixed(2)}\n\nThis is a demo store, no actual payment will be processed.`);
    
    // Clear cart
    cart = [];
    updateCart();
}

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style); 