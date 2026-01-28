// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Animation
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  if (menuBtn) {
    // Update old hamburger icon to new animated version
    if (menuBtn.textContent === '☰') {
      menuBtn.innerHTML = '<div class="menu-icon"><span></span><span></span><span></span></div>';
      menuBtn.classList.add('menu-btn');
    }

    menuBtn.addEventListener('click', () => {
      nav?.classList.toggle('show');
      menuBtn.classList.toggle('active');
      
      // Close menu when clicking on a link
      if (nav?.classList.contains('show')) {
        document.querySelectorAll('.nav a').forEach(link => {
          link.addEventListener('click', () => {
            nav.classList.remove('show');
            menuBtn.classList.remove('active');
          });
        });
      }
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav && menuBtn && !nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('show')) {
      nav.classList.remove('show');
      menuBtn.classList.remove('active');
    }
  });

  // Parallax Effect
  const parallaxHero = document.getElementById('parallaxHero');
  if (parallaxHero) {
    const layers = parallaxHero.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      layers.forEach(layer => {
        const speed = layer.getAttribute('data-speed');
        const yPos = -(scrolled * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    });
  }

  // Scroll reveal with better performance
  const reveals = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  if ('IntersectionObserver' in window) {
    const revealOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, revealOptions);

    reveals.forEach(reveal => {
      revealOnScroll.observe(reveal);
    });
  } else {
    // Fallback for older browsers
    const revealOnScroll = () => {
      reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add('show');
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
  }

  // Car search with debouncing
  const search = document.getElementById('search');
  if (search) {
    let debounceTimer;
    
    search.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      
      debounceTimer = setTimeout(() => {
        const value = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.car, .car-card').forEach(car => {
          const text = car.textContent || car.innerText;
          const shouldShow = text.toLowerCase().includes(value);
          car.style.display = shouldShow ? 'block' : 'none';
          car.style.opacity = shouldShow ? '1' : '0';
          car.style.transform = shouldShow ? 'translateY(0)' : 'translateY(20px)';
          car.style.transition = 'all 0.3s ease';
        });
      }, 300);
    });
  }


  // Enhanced car data with images
  const carData = [
    {
      name: "Toyota Axio",
      price: "Ksh 950,000",
      year: "2018",
      transmission: "Automatic",
      fuel: "Petrol",
      image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600"
    },
    {
      name: "Mazda Demio",
      price: "Ksh 780,000",
      year: "2017",
      transmission: "Automatic",
      fuel: "Hybrid",
      image: "https://images.unsplash.com/photo-1566472241221-2fde4e4f4b8b?auto=format&fit=crop&w=600"
    },
    {
      name: "Subaru Forester",
      price: "Ksh 1,450,000",
      year: "2019",
      transmission: "AWD",
      fuel: "Turbo",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600"
    },
    {
      name: "Nissan Note",
      price: "Ksh 820,000",
      year: "2016",
      transmission: "Manual",
      fuel: "Petrol",
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600"
    },
    {
      name: "Toyota Premio",
      price: "Ksh 1,200,000",
      year: "2019",
      transmission: "Automatic",
      fuel: "Petrol",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600"
    },
    {
      name: "Honda Fit",
      price: "Ksh 850,000",
      year: "2017",
      transmission: "Automatic",
      fuel: "Petrol",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600"
    }
  ];

  // Load enhanced car listings on cars page - FIXED: Always load cars immediately
  const carList = document.getElementById('carList');
  if (carList && (window.location.pathname.includes('cars.html') || carList.classList.contains('cars-container'))) {
    // Clear existing content but keep any static content if it exists
    if (!carList.querySelector('.car-card')) {
      carList.innerHTML = '';
    }
    
    // Add cars-container class if not present
    carList.classList.add('cars-container');
    
    // Always load cars initially
    loadCars(carData);
    
    // Add search functionality
    const search = document.getElementById('search');
    if (search) {
      let debounceTimer;
      
      search.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        
        debounceTimer = setTimeout(() => {
          const value = e.target.value.toLowerCase().trim();
          
          if (value === '') {
            // If search is empty, show all cars
            loadCars(carData);
          } else {
            // Filter and show matching cars
            const filteredCars = carData.filter(car => 
              car.name.toLowerCase().includes(value) ||
              car.price.toLowerCase().includes(value) ||
              car.year.includes(value) ||
              car.transmission.toLowerCase().includes(value) ||
              car.fuel.toLowerCase().includes(value)
            );
            
            loadCars(filteredCars);
          }
        }, 300);
      });
    }
  }
  
  // Function to load cars into the container
  function loadCars(cars) {
    const carList = document.getElementById('carList');
    if (!carList) return;
    
    carList.innerHTML = '';
    
    if (cars.length === 0) {
      carList.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 15px;">
          <i class="fas fa-car" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
          <h3>No cars found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      `;
      return;
    }
    
    cars.forEach((car, index) => {
      const carElement = document.createElement('div');
      carElement.className = 'car-card reveal';
      carElement.style.animationDelay = `${index * 0.1}s`;
      carElement.innerHTML = `
        <div class="car-image" style="background-image: url('${car.image}')"></div>
        <div class="car-info">
          <h3>${car.name}</h3>
          <p class="price">${car.price}</p>
          <p class="details">${car.year} • ${car.transmission} • ${car.fuel}</p>
          <button class="btn inquire-btn" data-car="${car.name}" style="padding: 0.5rem 1.5rem; font-size: 0.9rem; margin-top: 0.5rem; width: 100%;">Inquire Now</button>
        </div>
      `;
      carList.appendChild(carElement);
    });
    
    // Re-initialize reveal animations for new cards
    const newReveals = carList.querySelectorAll('.reveal');
    newReveals.forEach(reveal => {
      const top = reveal.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        reveal.classList.add('show');
      }
    });
    
    // Add inquiry functionality after elements are created
    setTimeout(() => {
      document.querySelectorAll('.inquire-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const carName = e.target.getAttribute('data-car');
          const message = `Hello! I'm interested in the ${carName}. Can you provide more details?`;
          const whatsappUrl = `https://wa.me/254706193959?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        });
      });
    }, 100);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Add current year to footer
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('footer p, #currentYear').forEach(element => {
    if (element.textContent.includes('2026') || element.id === 'currentYear') {
      element.textContent = element.textContent.replace('2026', currentYear);
      if (element.id === 'currentYear') {
        element.textContent = currentYear;
      }
    }
  });

  // Initialize all reveal elements
  reveals.forEach(reveal => {
    const top = reveal.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      reveal.classList.add('show');
    }
  });
});
