// Replace this with your Google Apps Script Web App URL after deploying
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsFbnD0AVIqshKx6TT0In1Xo-DQnP02mBZZs9kIGNfWUerxDF1izC-TiUZxPWRjQZBww/exec'; 

// DOM Elements
const perfumesGrid = document.getElementById('perfumes-grid');
const watchesGrid = document.getElementById('watches-grid');
const electronicsGrid = document.getElementById('electronics-grid');

const cartIcon = document.getElementById('cart-icon');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartGrandTotalEl = document.getElementById('cart-grand-total');
const proceedCheckoutBtn = document.getElementById('proceed-checkout');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutOverlay = document.getElementById('checkout-overlay');
const closeCheckoutBtn = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const checkoutTotalEl = document.getElementById('checkout-total');
const confirmOrderBtn = document.getElementById('confirm-order-btn');

const successModal = document.getElementById('success-modal');
const successOverlay = document.getElementById('success-overlay');
const closeSuccessBtn = document.getElementById('close-success');

// Cart State
let cart = [];
const DELIVERY_CHARGE = 0;

// Initialize
function init() {
  // Initialize EmailJS with the public key on page load
  emailjs.init("Z5A_tIHVtRwkAodda");
  renderProducts();
  setupEventListeners();
  initAnnouncementBar();
  initDraggableWhatsApp();
}

// Render Products
function renderProducts() {
  const perfumes = products.filter(p => p.category === 'perfume');
  const watches = products.filter(p => p.category === 'watch');
  const electronics = products.filter(p => p.category === 'electronics');

  window.selectPerfumeSize = function(id, price, btn) {
    document.getElementById(`price-${id}`).innerText = `Rs. ${price}`;
    const container = document.getElementById(`sizes-${id}`);
    container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  perfumes.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    let sizeOptions = p.sizes.map((s, index) => 
      `<button class="size-btn ${index === 0 ? 'active' : ''}" data-size="${s.size}" data-price="${s.price}" onclick="selectPerfumeSize('${p.id}', ${s.price}, this)">${s.size}</button>`
    ).join('');

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.description}</p>
      <div class="size-toggles" id="sizes-${p.id}">
        ${sizeOptions}
      </div>
      <div class="product-price" id="price-${p.id}">Rs. ${p.sizes[0].price}</div>
      <button class="btn" onclick="addToCart('${p.id}', 'perfume')">Add to Cart</button>
    `;
    perfumesGrid.appendChild(card);
  });

  const watchBrands = [...new Set(watches.map(w => w.brand))];
  
  watchBrands.forEach(brand => {
    const brandHeading = document.createElement('h3');
    brandHeading.className = 'brand-section-heading';
    brandHeading.innerText = `${brand} Watches`;
    watchesGrid.appendChild(brandHeading);
    
    watches.filter(w => w.brand === brand).forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="brand-label">${p.brand}</div>
        <h4>${p.name}</h4>
        <div class="product-price">Rs. ${p.price}</div>
        <button class="btn" onclick="addToCart('${p.id}', 'watch')">Add to Cart</button>
      `;
      watchesGrid.appendChild(card);
    });
  });

  electronics.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.description}</p>
      <div class="product-price">Rs. ${p.price}</div>
      <button class="btn" onclick="addToCart('${p.id}', 'electronics')">Add to Cart</button>
    `;
    electronicsGrid.appendChild(card);
  });
}

// Add to Cart
window.addToCart = function(id, category) {
  const product = products.find(p => p.id === id);
  let price = 0;
  let cartItemName = product.name;

  if (category === 'perfume') {
    const container = document.getElementById(`sizes-${id}`);
    const activeBtn = container.querySelector('.size-btn.active');
    const size = activeBtn.getAttribute('data-size');
    price = parseInt(activeBtn.getAttribute('data-price'), 10);
    cartItemName = `${product.name} (${size})`;
  } else {
    price = product.price;
  }

  const existingItem = cart.find(item => item.name === cartItemName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: cartItemName,
      price: price,
      image: product.image,
      quantity: 1
    });
  }

  updateCartUI();
  openCart();
};

// Remove from Cart
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

// Update Cart UI
function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  let subtotal = 0;
  let totalQuantity = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    totalQuantity += item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">Qty: ${item.quantity}</div>
        <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartCount.innerText = totalQuantity;
  cartSubtotalEl.innerText = `Rs. ${subtotal}`;
  
  const grandTotal = subtotal > 0 ? subtotal + DELIVERY_CHARGE : 0;
  cartGrandTotalEl.innerText = `Rs. ${grandTotal}`;
  checkoutTotalEl.innerText = `Rs. ${grandTotal}`;
}

// Drawer & Modal Listeners
function setupEventListeners() {
  // Cart Drawer
  cartIcon.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Checkout Modal
  proceedCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    closeCart();
    checkoutModal.classList.add('show');
    checkoutOverlay.classList.add('show');
  });

  closeCheckoutBtn.addEventListener('click', closeCheckout);
  checkoutOverlay.addEventListener('click', closeCheckout);

  // Success Modal
  closeSuccessBtn.addEventListener('click', () => {
    successModal.classList.remove('show');
    successOverlay.classList.remove('show');
    window.location.hash = '';
    window.scrollTo(0,0);
  });

  // Form Submit
  checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('show');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('show');
}

function closeCheckout() {
  checkoutModal.classList.remove('show');
  checkoutOverlay.classList.remove('show');
}

// Handle Order Submission
async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();

  // Validate that all required fields are filled
  if (!name || !email || !phone || !address || !city) {
    alert("Please fill in all required fields.");
    return;
  }

  // Validate phone number (exactly 11 digits)
  if (phone.length !== 11 || !/^\d+$/.test(phone)) {
    alert("Phone number must be exactly 11 digits (e.g., 03447783981).");
    return;
  }

  confirmOrderBtn.disabled = true;
  confirmOrderBtn.innerText = 'Processing...';

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = subtotal + DELIVERY_CHARGE;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

  const orderData = {
    orderId: orderId,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    notes: document.getElementById('notes').value,
    products: cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
    quantity: totalQuantity,
    totalPrice: grandTotal,
    totalAmount: grandTotal,
    date: new Date().toLocaleString()
  };

  try {
    if (SCRIPT_URL) {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
        // Using text/plain avoids CORS preflight issues with Google Apps Script
      });
    } else {
      // Simulate network request if no URL provided
      console.log('No Script URL provided, simulating success.', orderData);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // EmailJS integration for order notification email
    try {
      const emailParams = {
        order_id: orderData.orderId,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        products: orderData.products,
        quantity: orderData.quantity,
        total_price: orderData.totalPrice
      };
      const emailResponse = await emailjs.send('service_fohar5y', 'template_eicxl6k', emailParams);
      console.log('EmailJS Success:', emailResponse.status, emailResponse.text);
    } catch (emailError) {
      console.error('EmailJS Failed:', emailError);
    }

    showSuccess(orderData);
  } catch (error) {
    console.error('Order submission failed:', error);
    alert('There was an issue processing your order. Please try again.');
  } finally {
    confirmOrderBtn.disabled = false;
    confirmOrderBtn.innerText = 'Confirm Order';
  }
}

function showSuccess(data) {
  closeCheckout();
  checkoutForm.reset();
  cart = [];
  updateCartUI();

  document.getElementById('success-order-id').innerText = data.orderId;
  document.getElementById('success-total').innerText = `Rs. ${data.totalAmount}`;
  document.getElementById('success-name').innerText = data.name;

  successModal.classList.add('show');
  successOverlay.classList.add('show');
}

// Announcement Bar logic
function initAnnouncementBar() {
  const announcementBar = document.getElementById('announcement-bar');
  const closeAnnouncementBtn = document.getElementById('close-announcement');
  
  if (!announcementBar) return;

  // Clear any legacy localStorage values to ensure the bar is visible again
  if (localStorage.getItem('announcement-dismissed') === 'true') {
    localStorage.removeItem('announcement-dismissed');
  }

  function updateAnnouncementHeight() {
    if (sessionStorage.getItem('announcement-dismissed') === 'true') {
      announcementBar.style.display = 'none';
      document.body.classList.remove('has-announcement');
      document.documentElement.style.setProperty('--announcement-height', '0px');
    } else {
      document.body.classList.add('has-announcement');
      const height = announcementBar.offsetHeight;
      document.documentElement.style.setProperty('--announcement-height', height + 'px');
    }
  }

  // Initial check
  updateAnnouncementHeight();

  // Watch window resize to handle text wrapping/responsiveness
  window.addEventListener('resize', updateAnnouncementHeight);

  if (closeAnnouncementBtn) {
    closeAnnouncementBtn.addEventListener('click', () => {
      sessionStorage.setItem('announcement-dismissed', 'true');
      announcementBar.style.display = 'none';
      document.body.classList.remove('has-announcement');
      document.documentElement.style.setProperty('--announcement-height', '0px');
    });
  }
}

// Draggable WhatsApp Button
function initDraggableWhatsApp() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;

  let isDragging = false;
  let startX, startY;
  let initialX, initialY;
  let hasMoved = false;

  // Prevent default browser link drag behavior
  btn.addEventListener('dragstart', (e) => e.preventDefault());

  function onStart(e) {
    isDragging = true;
    hasMoved = false;

    // Get client position (mouse or touch)
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;

    // Get computed top/left coordinates
    const rect = btn.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;

    // Switch dynamic absolute coordinates from right/bottom to top/left for inline updates
    btn.style.bottom = 'auto';
    btn.style.right = 'auto';
    btn.style.left = initialX + 'px';
    btn.style.top = initialY + 'px';

    // Disable css transition while dragging for instant cursor updates
    btn.style.transition = 'none';
  }

  function onMove(e) {
    if (!isDragging) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved = true;
    }

    let newLeft = initialX + dx;
    let newTop = initialY + dy;

    // Viewport boundaries checks
    const rect = btn.getBoundingClientRect();
    const minLeft = 10;
    const maxLeft = window.innerWidth - rect.width - 10;
    const minTop = 10;
    const maxTop = window.innerHeight - rect.height - 10;

    newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
    newTop = Math.max(minTop, Math.min(newTop, maxTop));

    btn.style.left = newLeft + 'px';
    btn.style.top = newTop + 'px';
  }

  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    // Restore transitions
    btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease';

    // Prevent navigation if drag action was active
    if (hasMoved) {
      const clickBlocker = (event) => {
        event.preventDefault();
        event.stopPropagation();
        btn.removeEventListener('click', clickBlocker, true);
      };
      btn.addEventListener('click', clickBlocker, true);
    }
  }

  // Mouse bindings
  btn.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  // Touch bindings
  btn.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
}

// Boot up
init();
