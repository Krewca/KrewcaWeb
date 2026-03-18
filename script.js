// --- 1. ROBUSTNÍ TYPEWRITER (Bez polí, jednoduchá logika) ---
const textElement = document.getElementById('typing-text');
const textToType = textElement ? (textElement.getAttribute('data-text') || "Head of Esports & Production") : "";
let idx = 0;

function typeWriter() {
    if (textElement && idx < textToType.length) {
        textElement.innerHTML += textToType.charAt(idx);
        idx++;
        setTimeout(typeWriter, 100);
    }
}

// --- 2. CAROUSEL LOGIKA (Tlačítka + Drag) ---
const slider = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (slider && prevBtn && nextBtn) {
    // Tlačítka
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 340, behavior: 'smooth' }); // 320px karta + 20px gap
    });
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -340, behavior: 'smooth' });
    });

    // Drag & Drop logika pro myš
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
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Rychlost posunu
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch logika pro mobilní zařízení
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('touchend', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('touchcancel', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('touchmove', (e) => {
        if(!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Rychlost posunu
        // Zabráníme defaultnímu scrollování stránky pouze pokud scrollujeme vodorovně
        // ale touch-action: pan-y v CSS už tohle většinou řeší.
        slider.scrollLeft = scrollLeft - walk;
    }, { passive: true });
}

// Spustit psaní po načtení
window.onload = typeWriter;