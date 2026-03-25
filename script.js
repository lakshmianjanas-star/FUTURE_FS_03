document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  const navExtra = document.querySelector('.nav-extra');
  const navbar = document.getElementById('navbar');

  function toggleMenu() {
    menuToggle.classList.toggle('is-active');
    navLinks.classList.toggle('active');
    
    // Quick fix for the button in mobile menu
    if (navLinks.classList.contains('active')) {
      const extraBtn = document.createElement('li');
      extraBtn.className = 'mobile-only-btn';
      extraBtn.innerHTML = '<a href="#visit" class="btn primary" onclick="document.getElementById(\'mobile-menu\').click()">Visit Us</a>';
      if(!navLinks.querySelector('.mobile-only-btn')) {
        navLinks.appendChild(extraBtn);
      }
    } else {
      const extraBtn = navLinks.querySelector('.mobile-only-btn');
      if (extraBtn) extraBtn.remove();
    }
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Sticky Navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal, .reveal-card, .reveal-left, .reveal-right');

  function revealElements() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', revealElements);
  // Trigger once on load
  revealElements();

  // Product Filtering
  const filterBtns = document.querySelectorAll('.collection-filter .btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => {
          b.classList.remove('active', 'secondary');
          b.classList.add('outline');
        });
        
        // Add active class to clicked
        btn.classList.add('active', 'secondary');
        btn.classList.remove('outline');
        
        const filterValue = btn.getAttribute('data-filter');
        
        productCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Shopping Cart Logic
  let cart = [];
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total-price');
  const cartCountEls = document.querySelectorAll('#cart-count');

  window.toggleCart = function(e) {
    if (e) e.preventDefault();
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.toggle('open');
      cartOverlay.classList.toggle('open');
    }
  };

  window.addToCart = function(title, price) {
    cart.push({ title, price });
    updateCartUI();
    
    // Show cart when item added
    if (!cartSidebar.classList.contains('open')) {
      window.toggleCart();
    }
  };

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
  };

  function updateCartUI() {
    // Update count
    cartCountEls.forEach(el => {
      el.textContent = cart.length;
    });
    
    // Render items
    if (cart.length === 0) {
      if(cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
      if(cartTotalEl) cartTotalEl.textContent = '$0.00';
      return;
    }
    
    if(cartItemsContainer) {
      cartItemsContainer.innerHTML = '';
      let total = 0;
      
      cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div class="cart-item-info">
            <span class="cart-item-title">${item.title}</span>
            <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
          </div>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(itemEl);
      });
      
      if(cartTotalEl) cartTotalEl.textContent = '$' + total.toFixed(2);
    }
  }
});
