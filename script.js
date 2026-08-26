// --- 1. LANGUAGE & GEO REDIRECTION TRIGGER ---
function setLangAndNavigate(lang, targetUrl) {
    sessionStorage.setItem('manual_lang_override', lang);
    window.location.href = targetUrl;
}

(function handleLanguageRedirection() {
    const currentPath = window.location.pathname.toLowerCase();
    const isEnPage = currentPath.endsWith('en.html');
    const isCzPage = !isEnPage; // index.html or root /

    // Respect manual user selection in current session
    const manualLang = sessionStorage.getItem('manual_lang_override');
    if (manualLang === 'cs' && isCzPage) return;
    if (manualLang === 'en' && isEnPage) return;

    // Check browser languages (Instant check)
    const userLangs = Array.from(navigator.languages || [navigator.language || '']).map(l => l.toLowerCase());
    const isCzSkLanguage = userLangs.some(l => l.startsWith('cs') || l.startsWith('sk'));

    // Fast GeoIP check (Detects VPNs & foreign locations)
    fetch('https://get.geojs.io/v1/ip/country.json')
        .then(res => res.json())
        .then(data => {
            const country = (data.country || '').toUpperCase();
            const isCzSkGeo = (country === 'CZ' || country === 'SK');

            // If visitor is NOT in CZ/SK AND browser is NOT set to cs/sk:
            if (!isCzSkGeo && !isCzSkLanguage) {
                if (isCzPage && !manualLang) {
                    window.location.href = 'en.html';
                }
            }
        })
        .catch(() => {
            // Fallback to browser language if GeoIP API fails or is blocked
            if (!isCzSkLanguage && isCzPage && !manualLang) {
                window.location.href = 'en.html';
            }
        });
})();

// --- 2. TYPEWRITER EFFECT (Multi-Role Cycling) ---
const textElement = document.getElementById('typing-text');

if (textElement) {
    const roles = [
        "Head of Esports & Production",
        "Chief Operating Officer (COO / CPO)",
        "Senior Esport Broadcast Technical Designer",
        "Software Engineer (Avionics & Tools)",
        "Engineering & Product Manager (GameDev)"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next title
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();
}

// --- 3. CAROUSEL LOGIC (Infinite Nav Buttons + Drag & Touch Scroll) ---
const slider = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (slider) {
    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
            if (slider.scrollLeft >= maxScrollLeft - 15) {
                // Reached end -> smooth loop back to start
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: 360, behavior: 'smooth' });
            }
        });

        prevBtn.addEventListener('click', () => {
            if (slider.scrollLeft <= 15) {
                // Reached start -> smooth loop to end
                const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
                slider.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: -360, behavior: 'smooth' });
            }
        });
    }

    // Drag to scroll (Mouse)
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });
}