/*  GIANNI'S BARBERING SUPPLIES JAVASCRIPT
   Complete functionality for E-Commerce Website
  */

//  PRODUCT DATABASE 
// Array containing all 8 products available in the store
const products = [
    {
        id: 1,                                      // Unique product identifier
        name: "Professional Hair Clipper Pro X1",
        price: 89.99,                               // Price in dollars
        category: "clippers",
        description: "High-performance cordless clipper with ceramic blades",
        icon: "✂️",                                 // Fallback emoji if image missing
        image: "images/products/clipper-1.jpg"     // Path to product image
    },
    {
        id: 2,
        name: "Premium Pomade - Strong Hold",
        price: 24.99,
        category: "styling",
        description: "Water-based pomade with natural shine",
        icon: "💈",
        image: "images/products/pomade-1.jpg"
    },
    {
        id: 3,
        name: "Straight Razor Kit",
        price: 45.50,
        category: "shaving",
        description: "Professional straight razor with leather strop",
        icon: "🪒",
        image: "images/products/razor-1.jpg"
    },
    {
        id: 4,
        name: "Carbon Fiber Cutting Comb Set",
        price: 19.99,
        category: "combs",
        description: "Heat-resistant professional combs (5-piece set)",
        icon: "🪮",
        image: "images/products/comb-1.jpg"
    },
    {
        id: 5,
        name: "Beard Trimmer Elite",
        price: 69.99,
        category: "clippers",
        description: "Precision beard trimmer with 20 length settings",
        icon: "✂️",
        image: "images/products/trimmer-1.jpg"
    },
    {
        id: 6,
        name: "Styling Clay - Matte Finish",
        price: 22.99,
        category: "styling",
        description: "Strong hold clay for textured styles",
        icon: "💈",
        image: "images/products/clay-1.jpg"
    },
    {
        id: 7,
        name: "Luxury Shaving Cream",
        price: 18.50,
        category: "shaving",
        description: "Rich lather shaving cream with aloe vera",
        icon: "🪒",
        image: "images/products/cream-1.jpg"
    },
    {
        id: 8,
        name: "Boar Bristle Brush",
        price: 29.99,
        category: "combs",
        description: "Natural boar bristle for shine and health",
        icon: "🪮",
        image: "images/products/brush-1.jpg"
    }
];

//  LOCAL STORAGE FUNCTIONS 
// Object containing all localStorage-related functions
const storage = {
    // Get shopping cart from localStorage
    getCart: function() {
        const cart = localStorage.getItem('giannis_cart');
        return cart ? JSON.parse(cart) : [];    // Return parsed cart or empty array
    },
    
    // Save shopping cart to localStorage
    saveCart: function(cart) {
        localStorage.setItem('giannis_cart', JSON.stringify(cart));  // Convert to JSON string
        this.updateCartCount();                                       // Update navigation counter
    },
    
    // Update cart count badge in navigation
    updateCartCount: function() {
        const cart = this.getCart();
        // Sum all quantities to get total items
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = `(${totalItems})`;
        }
    },
    
    // Get all registered users from localStorage
    getUsers: function() {
        const users = localStorage.getItem('giannis_users');
        return users ? JSON.parse(users) : [];
    },
    
    // Save new user to localStorage
    saveUser: function(user) {
        const users = this.getUsers();
        users.push(user);                       // Add new user to array
        localStorage.setItem('giannis_users', JSON.stringify(users));
    },
    
    // Get currently logged-in user
    getCurrentUser: function() {
        const user = localStorage.getItem('giannis_current_user');
        return user ? JSON.parse(user) : null;
    },
    
    // Set current user (login)
    setCurrentUser: function(user) {
        localStorage.setItem('giannis_current_user', JSON.stringify(user));
    },
    
    // Logout user
    logout: function() {
        localStorage.removeItem('giannis_current_user');
    },
    
    // Save completed order to localStorage
    saveOrder: function(order) {
        const orders = this.getOrders();
        orders.push(order);
        localStorage.setItem('giannis_orders', JSON.stringify(orders));
    },
    
    // Get all orders
    getOrders: function() {
        const orders = localStorage.getItem('giannis_orders');
        return orders ? JSON.parse(orders) : [];
    }
};

// SHOPPING CART FUNCTIONS 
const cart = {
    // Add product to cart
    addItem: function(productId) {
        const product = products.find(p => p.id === productId);  // Find product by ID
        if (!product) return;                                     // Exit if not found
        
        const cartItems = storage.getCart();
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;                           // Increase quantity if exists
        } else {
            // Add new item with quantity 1
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                icon: product.icon
            });
        }
        
        storage.saveCart(cartItems);                              // Save to localStorage
        this.showAddedMessage(product.name);                      // Show success message
    },
    
    // Remove item from cart
    removeItem: function(productId) {
        let cartItems = storage.getCart();
        cartItems = cartItems.filter(item => item.id !== productId);  // Remove item
        storage.saveCart(cartItems);
        if (typeof this.renderCart === 'function') {
            this.renderCart();                                         // Re-render cart display
        }
    },
    
    // Update item quantity
    updateQuantity: function(productId, quantity) {
        const cartItems = storage.getCart();
        const item = cartItems.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity));           // Minimum quantity is 1
            storage.saveCart(cartItems);
            if (typeof this.renderCart === 'function') {
                this.renderCart();                                     // Re-render to show new totals
            }
        }
    },
    
    // Calculate cart totals
    calculateTotals: function() {
        const cartItems = storage.getCart();
        // Calculate subtotal (sum of price × quantity for all items)
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * 0.05;                              // 5% discount
        const tax = (subtotal - discount) * 0.15;                      // 15% tax on discounted amount
        const total = subtotal - discount + tax;                       // Grand total
        
        // Return all values formatted to 2 decimal places
        return {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    },
    
    // Clear entire cart
    clearCart: function() {
        localStorage.removeItem('giannis_cart');
        storage.updateCartCount();
        if (typeof this.renderCart === 'function') {
            this.renderCart();
        }
    },
    
    // Show "Added to Cart" success message
    showAddedMessage: function(productName) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.style.position = 'fixed';
        alert.style.top = '100px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.textContent = `${productName} added to cart!`;
        document.body.appendChild(alert);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
};

// FORM VALIDATION FUNCTIONS
const validation = {
    // Validate email format
    isValidEmail: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                    // Email pattern
        return regex.test(email);
    },
    
    // Validate password (minimum 6 characters)
    isValidPassword: function(password) {
        return password.length >= 6;
    },
    
    // Validate username (3-20 alphanumeric + underscore)
    isValidUsername: function(username) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        return regex.test(username);
    },
    
    // Check if username already exists (DUPLICATE PREVENTION)
    usernameExists: function(username) {
        const users = storage.getUsers();
        return users.some(user => user.username.toLowerCase() === username.toLowerCase());
    },
    
    // Check if email already exists (DUPLICATE PREVENTION)
    emailExists: function(email) {
        const users = storage.getUsers();
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    },
    
    // Show error message for input field
    showError: function(inputElement, message) {
        inputElement.classList.add('error');                           // Add red border
        const errorDiv = inputElement.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');                            // Display error
        }
    },
    
    // Clear error message
    clearError: function(inputElement) {
        inputElement.classList.remove('error');
        const errorDiv = inputElement.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.classList.remove('show');
        }
    }
};

//  PAGE INITIALIZATION 
// Runs when page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on every page
    storage.updateCartCount();
    
    // Load featured products on homepage
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        loadFeaturedProducts();
    }
    
    // Load all products on products page
    const allProductsContainer = document.getElementById('all-products');
    if (allProductsContainer) {
        loadAllProducts();
    }
    
    // Initialize cart page
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        initCartPage();
    }
    
    // Initialize checkout page
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        initCheckoutPage();
    }
    
    // Initialize login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        initLoginForm();
    }
    
    // Initialize registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        initRegisterForm();
    }
    
    // Initialize invoice page
    const invoiceContainer = document.getElementById('invoice-details');
    if (invoiceContainer) {
        loadInvoice();
    }
});

// PRODUCT DISPLAY FUNCTIONS 
// Load first 4 products as featured on homepage
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featured = products.slice(0, 4);                             // Get first 4 products
    
    featured.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// Load all 8 products on products page
function loadAllProducts() {
    const container = document.getElementById('all-products');
    
    // Check if there's a category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // Filter products by category if specified, otherwise show all
    const productsToShow = category 
        ? products.filter(p => p.category === category)
        : products;
    
    // If filtering, show category heading
    if (category) {
        const categoryNames = {
            'clippers': 'Clippers & Trimmers',
            'styling': 'Styling Products',
            'shaving': 'Shaving Supplies',
            'combs': 'Combs & Brushes'
        };
        
        const heading = document.createElement('div');
        heading.style.textAlign = 'center';
        heading.style.marginBottom = '2rem';
        heading.innerHTML = `
            <h3 style="color: var(--deep-navy); font-size: 1.5rem;">
                ${categoryNames[category] || 'Products'}
            </h3>
            <a href="products.html" style="color: var(--primary-red); text-decoration: none; font-weight: bold;">
                ← View All Products
            </a>
        `;
        container.parentElement.insertBefore(heading, container);
    }
    
    // Display filtered products
    productsToShow.forEach(product => {
        container.appendChild(createProductCard(product));
    });
    
    // Show message if no products found
    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="text-center">No products found in this category.</p>';
    }
}

// Create HTML for product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Build card HTML with image, info, and button
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <span class="product-icon" style="display:none;">${product.icon}</span>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="cart.addItem(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

// CART PAGE FUNCTIONS
function initCartPage() {
    renderCartPage();
    
    // Handle "Clear All" button
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart.clearCart();
            }
        });
    }
}

// Render cart page with items and totals
function renderCartPage() {
    const cartItems = storage.getCart();
    const container = document.getElementById('cart-items-container');
    const totalsDiv = document.getElementById('cart-totals');
    
    // Show empty cart message if no items
    if (cartItems.length === 0) {
        container.innerHTML = '<p class="text-center">Your cart is empty. <a href="products.html">Start shopping!</a></p>';
        if (totalsDiv) totalsDiv.style.display = 'none';
        return;
    }
    
    // Build cart table
    let tableHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add row for each cart item
    cartItems.forEach(item => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        tableHTML += `
            <tr>
                <td>${item.icon} ${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="cart.updateQuantity(${item.id}, this.value)" 
                           style="width: 60px; padding: 5px;">
                </td>
                <td>$${subtotal}</td>
                <td>
                    <button onclick="cart.removeItem(${item.id})" class="btn-secondary">Remove</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
    
    // Display totals
    const totals = cart.calculateTotals();
    if (totalsDiv) {
        totalsDiv.innerHTML = `
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${totals.subtotal}</span>
            </div>
            <div class="total-row">
                <span>Discount (5%):</span>
                <span>-$${totals.discount}</span>
            </div>
            <div class="total-row">
                <span>Tax (15%):</span>
                <span>$${totals.tax}</span>
            </div>
            <div class="total-row grand-total">
                <span>Total:</span>
                <span>$${totals.total}</span>
            </div>
        `;
        totalsDiv.style.display = 'block';
    }
}

// Make renderCartPage accessible to cart object
cart.renderCart = renderCartPage;

// CHECKOUT PAGE FUNCTIONS 
function initCheckoutPage() {
    const summaryDiv = document.getElementById('checkout-summary');
    const cartItems = storage.getCart();
    const totals = cart.calculateTotals();
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        summaryDiv.innerHTML = '<p>Your cart is empty. Please add items before checking out.</p>';
        document.getElementById('checkout-form').style.display = 'none';
        return;
    }
    
    // Display order summary
    let summaryHTML = '<h3>Order Summary</h3><ul>';
    cartItems.forEach(item => {
        summaryHTML += `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`;
    });
    summaryHTML += `</ul>
        <div class="total-row"><strong>Grand Total: $${totals.total}</strong></div>
    `;
    summaryDiv.innerHTML = summaryHTML;
    
    // Handle form submission
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();                                            // Prevent page reload
        processCheckout();
    });
    
    // Handle cancel button
    const cancelBtn = document.getElementById('cancel-checkout');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Cancel checkout?')) {
                window.location.href = 'cart.html';
            }
        });
    }
}

// Process checkout and create order
function processCheckout() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    
    // Create order object
    const orderData = {
        orderId: 'ORD' + Date.now(),                                   // Unique ID using timestamp
        date: new Date().toLocaleDateString(),
        customer: {
            name: formData.get('fullname'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            phone: formData.get('phone')
        },
        items: storage.getCart(),
        payment: {
            method: formData.get('payment-method'),
            cardName: formData.get('card-name'),
            cardNumber: formData.get('card-number')
        },
        totals: cart.calculateTotals()
    };
    
    // Save order
    storage.saveOrder(orderData);
    localStorage.setItem('giannis_current_order', JSON.stringify(orderData));
    
    // Clear cart and redirect
    localStorage.removeItem('giannis_cart');
    storage.updateCartCount();
    window.location.href = 'invoice.html';
}

//LOGIN FORM
function initLoginForm() {
    const form = document.getElementById('login-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!username) {
            validation.showError(document.getElementById('username'), 'Username is required');
            isValid = false;
        }
        
        if (!password) {
            validation.showError(document.getElementById('password'), 'Password is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check credentials
        const users = storage.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            storage.setCurrentUser(user);
            alert('Login successful! Welcome back, ' + user.fullname);
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password');
        }
    });
    
    // Clear errors on input
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validation.clearError(this);
        });
    });
}

//  REGISTRATION FORM
function initRegisterForm() {
    const form = document.getElementById('register-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const dob = document.getElementById('dob').value;
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate all fields
        let isValid = true;
        
        if (!fullname) {
            validation.showError(document.getElementById('fullname'), 'Full name is required');
            isValid = false;
        }
        
        if (!validation.isValidEmail(email)) {
            validation.showError(document.getElementById('email'), 'Please enter a valid email');
            isValid = false;
        } else if (validation.emailExists(email)) {
            // DUPLICATE PREVENTION - Check if email already exists
            validation.showError(document.getElementById('email'), 'Email already registered');
            isValid = false;
        }
        
        if (!dob) {
            validation.showError(document.getElementById('dob'), 'Date of birth is required');
            isValid = false;
        }
        
        if (!validation.isValidUsername(username)) {
            validation.showError(document.getElementById('username'), 'Username must be 3-20 characters (letters, numbers, underscore)');
            isValid = false;
        } else if (validation.usernameExists(username)) {
            // DUPLICATE PREVENTION - Check if username already exists
            validation.showError(document.getElementById('username'), 'Username already taken');
            isValid = false;
        }
        
        if (!validation.isValidPassword(password)) {
            validation.showError(document.getElementById('password'), 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            validation.showError(document.getElementById('confirm-password'), 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Create and save user
        const user = {
            fullname,
            email,
            dob,
            username,
            password,
            registeredDate: new Date().toISOString()
        };
        
        storage.saveUser(user);
        storage.setCurrentUser(user);
        
        alert('Registration successful! Welcome, ' + fullname);
        window.location.href = 'index.html';
    });
    
    // Clear errors on input
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validation.clearError(this);
        });
    });
}

//INVOICE PAGE
function loadInvoice() {
    const orderData = localStorage.getItem('giannis_current_order');
    
    if (!orderData) {
        document.getElementById('invoice-details').innerHTML = 
            '<p class="text-center">No order found. <a href="products.html">Continue shopping</a></p>';
        return;
    }
    
    const order = JSON.parse(orderData);
    const container = document.getElementById('invoice-details');
    
    // Build items table
    let itemsHTML = '';
    order.items.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        itemsHTML += `
            <tr>
                <td>${item.icon} ${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal}</td>
            </tr>
        `;
    });
    
    // Build complete invoice HTML
    container.innerHTML = `
        <div class="invoice-header">
            <h1>INVOICE</h1>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Date:</strong> ${order.date}</p>
        </div>
        
        <div class="invoice-details">
            <div class="invoice-section">
                <h3>Bill To:</h3>
                <p><strong>${order.customer.name}</strong></p>
                <p>${order.customer.address}</p>
                <p>${order.customer.city}</p>
                <p>Email: ${order.customer.email}</p>
                <p>Phone: ${order.customer.phone}</p>
            </div>
            <div class="invoice-section">
                <h3>Payment Method:</h3>
                <p>${order.payment.method}</p>
                <p>Card: **** **** **** ${order.payment.cardNumber.slice(-4)}</p>
            </div>
        </div>
        
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
        
        <div class="cart-total" style="margin-top: 2rem;">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${order.totals.subtotal}</span>
            </div>
            <div class="total-row">
                <span>Discount (5%):</span>
                <span>-$${order.totals.discount}</span>
            </div>
            <div class="total-row">
                <span>Tax (15%):</span>
                <span>$${order.totals.tax}</span>
            </div>
            <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>$${order.totals.total}</span>
            </div>
        </div>
        
        <div class="text-center mt-2">
            <button onclick="window.print()" class="btn-primary">Print Invoice</button>
            <a href="index.html" class="btn-secondary" style="display: inline-block; margin-left: 1rem; text-decoration: none;">Back to Home</a>
        </div>
    `;
}
