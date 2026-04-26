document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMACIÓN SCROLL (Aparición suave al bajar)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    });
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    // 2. ANIMACIÓN INICIAL DEL NAVBAR (Para que no aparezca de golpe)
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        setTimeout(() => {
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
        }, 100);
    }

    // 3. GALERÍA: CAMBIAR IMAGEN EN EL VISOR
    window.changeImage = function(src, title) {
        const mainImg = document.getElementById('main-display');
        const mainTitle = document.getElementById('viewer-title');
        
        if (mainImg) {
            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = src;
                if(mainTitle) mainTitle.innerText = title;
                mainImg.style.opacity = 1;
            }, 300);
        }
    };

    // 4. CARRUSEL 3D (Botones + Arrastre)
    const carousel = document.querySelector('.carousel-3d');
    const wrapper = document.getElementById('carouselWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentAngle = 0;
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;

    const rotateCarousel = (angle) => {
        if(carousel) carousel.style.transform = `rotateY(${angle}deg)`;
    };

    // Botones de giro
    if (carousel && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentAngle += 18; 
            rotateCarousel(currentAngle);
        });
        nextBtn.addEventListener('click', () => {
            currentAngle -= 18;
            rotateCarousel(currentAngle);
        });
    }

    // Lógica Drag & Swipe (Mouse y Dedo)
    if (wrapper && carousel) {
        // MOUSE
        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            startAngle = currentAngle;
            wrapper.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.pageX;
            const walk = (x - startX) * 0.5; 
            currentAngle = startAngle + walk;
            rotateCarousel(currentAngle);
        });
        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.cursor = 'grab';
        });

        // TOUCH (Móvil)
        wrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            startAngle = currentAngle;
        });
        wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 0.8; 
            currentAngle = startAngle + walk;
            rotateCarousel(currentAngle);
        });
        wrapper.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // 5. MODAL (LIGHTBOX - Pantalla Completa)
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const mainImg = document.getElementById('main-display');

    window.openModal = function() {
        if(modal && mainImg) {
            modal.style.display = "block";
            modalImg.src = mainImg.src;
            const titleEl = document.getElementById('viewer-title');
            if(titleEl) captionText.innerHTML = titleEl.innerText;
        }
    };

    window.closeModal = function() {
        if(modal) modal.style.display = "none";
    };

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") window.closeModal();
    });

    // 6. FORMULARIO Y CAPTCHA (Para la página de Contacto)
    window.toggleCaptcha = function(element) {
        element.classList.toggle('checked');
    };
    
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const captcha = document.querySelector('.fake-captcha');
            
            // Validación simple del captcha
            if (captcha && !captcha.classList.contains('checked')) {
                alert("🤖 Por favor, verifica que no eres un robot.");
                return;
            }
            
            alert("✅ ¡Mensaje enviado con éxito!");
            contactForm.reset();
            if(captcha) captcha.classList.remove('checked');
        });
    }

    // 7. IMÁGENES ROTAS (Protección)
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (this.src.includes('placehold.co')) return;
            this.src = 'https://placehold.co/600x400/111/333?text=Sin+Imagen';
        });
    });
    // 8. LOGICA PARA EL MODAL DE CORREO Y BOTON WHATSAPP
    window.openEmailModal = function() {
        const modal = document.getElementById('emailModal');
        if(modal) modal.style.display = 'block';
    };

    window.closeEmailModal = function() {
        const modal = document.getElementById('emailModal');
        if(modal) modal.style.display = 'none';
    };

    window.sendWhatsApp = function() {
        // Configuramos el número de 3Esfera (Formato internacional de Argentina: 54 + 9 + codigo de area + numero)
        const phone = "5493435314141"; 
        const message = "¡Hola 3Esfera! Me comunico desde la página web, me gustaría hacerles una consulta.";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Cerrar el modal si el usuario hace click afuera de la caja
    window.addEventListener('click', function(event) {
        const emailModal = document.getElementById('emailModal');
        // Usamos también imageModal por si el usuario está en la galería
        const imageModal = document.getElementById('imageModal'); 
        
        if (event.target == emailModal) {
            closeEmailModal();
        }
        if (event.target == imageModal && typeof closeModal === 'function') {
            closeModal();
        }
    });
    // 9. MENÚ HAMBURGUESA PARA MÓVILES
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            // Abre y cierra la persiana del menú
            navLinks.classList.toggle('active');
            
            // Cambia el icono de las 3 rayitas por una "X" y viceversa
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
});