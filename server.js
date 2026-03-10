import express from 'express';
import cookieData from './data/cookies.js'; 

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {
    res.render('index', { cookies: cookieData }); 
});

const validCoupons = {
    'WELCOME10': { type: 'percent', value: 0.10, min: 0 }, 
    'SWEET50': { type: 'flat', value: 50, min: 300 } 
};

app.post('/checkout', (req, res) => {
    const { cart, couponCode, pincode } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    let secureSubtotal = 0;
    cart.forEach(clientItem => {
        const dbItem = cookieData.find(cookie => cookie.name === clientItem.name);
        if (dbItem) {
            secureSubtotal += (dbItem.price * clientItem.quantity); 
        }
    });

    let secureDiscount = 0;
    if (couponCode && validCoupons[couponCode]) {
        const coupon = validCoupons[couponCode];
        if (secureSubtotal >= coupon.min) {
            secureDiscount = coupon.type === 'percent' 
                ? secureSubtotal * coupon.value 
                : coupon.value;
        }
    }

    let deliveryFee = 0;
    if (pincode) {
        const pin = parseInt(pincode);
        if (secureSubtotal >= 500) {
            deliveryFee = 0; 
        } else if (pin >= 560001 && pin <= 560111) {
            deliveryFee = 40; 
        } else {
            deliveryFee = 100; 
        }
    }

    const secureTotal = secureSubtotal - secureDiscount + deliveryFee;

    res.json({
        message: 'Order verified securely!',
        receipt: {
            subtotal: secureSubtotal,
            discount: secureDiscount,
            delivery: deliveryFee,
            total: Math.max(0, secureTotal)
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🍪 Server is baking on http://localhost:${PORT}`);
});