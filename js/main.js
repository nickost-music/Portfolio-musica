const translations = {
    es: {
        nav_home: "Inicio",
        nav_about: "Sobre Mí",
        nav_composer: "Compositor",
        nav_pianist: "Pianista",
        nav_contact: "Contacto",
        hero_title: "Compositor & Pianista",
        hero_subtitle: "Creando emociones a través del sonido",
        about_title: "Sobre Mí",
        about_text: "Soy un ingeniero de Sonido e Imagen de la universidad de Málaga. Me apasiona el sonido y la música. Estuve trabajando por un año en Fiverr y compuse la banda sonora de más de 20 proyectos con una media de 5 estrellas y máxima satisfacción por parte de los clientes. He compuesto música de muchos géneros. También he sido director del coro de la universidad por dos años en los cuales he mejorado mucho mis habilidades musicales y comunicativas.",
        composer_title: "Compositor de Bandas Sonoras",
        pianist_title: "Pianista",
        contact_title: "Contacto",
        contact_text: "¿Necesitas música original para tu proyecto o un pianista para tu evento? ¡Hablemos!",
        contact_btn: "Contáctame",
        pianist_services_title: "Servicios de Piano en Vivo",
        pianist_services_text: "La música en vivo tiene el poder de transformar cualquier evento en una memoria imborrable. Desde la solemne elegancia de una ceremonia de boda hasta el ambiente sofisticado de una gala corporativa o cóctel, mi repertorio se adapta para crear la atmósfera perfecta. Ofrezco interpretaciones que van desde lo clásico y emotivo hasta arreglos modernos, siempre con la sensibilidad y el refinamiento que tu ocasión merece.",
        service_weddings: "• Bodas & Ceremonias •",
        service_corporate: "• Eventos Corporativos •",
        service_gala: "• Cenas de Gala •"
    },
    en: {
        nav_home: "Home",
        nav_about: "About Me",
        nav_composer: "Composer",
        nav_pianist: "Pianist",
        nav_contact: "Contact",
        hero_title: "Composer & Pianist",
        hero_subtitle: "Crafting emotions through sound",
        about_title: "About Me",
        about_text: "I am a Sound and Image Engineer from the University of Malaga. I am passionate about sound and music. I worked for a year on Fiverr and composed the soundtrack for over 20 projects with a 5-star average and maximum client satisfaction. I have composed music across many genres. I also served as the university choir director for two years, where I greatly honed my musical and communicative skills.",
        composer_title: "Soundtrack Composer",
        pianist_title: "Pianist",
        contact_title: "Contact",
        contact_text: "Do you need original music for your project or a pianist for your event? Let's talk!",
        contact_btn: "Contact Me",
        footer_rights: "All rights reserved.",
        watch_on_youtube: "Watch on YouTube",
        testimonials_title: "What my clients say",
        testim_1: "\"Working with him was an absolute pleasure. He delivered exactly what I needed for my short film with incredible sound quality.\"",
        testim_2: "\"An incredible pianist. He made our wedding ceremony unforgettable. Very professional and talented.\"",
        testim_3: "\"5-star communication and a final result that exceeded my expectations. I will hire him again.\"",
        pianist_services_title: "Live Piano Services",
        pianist_services_text: "Live music has the power to transform any event into an indelible memory. From the solemn elegance of a wedding ceremony to the sophisticated ambiance of a corporate gala or cocktail party, my repertoire adapts to create the perfect atmosphere. I offer performances ranging from classical and emotional to modern arrangements, always with the sensitivity and refinement your occasion deserves.",
        service_weddings: "• Weddings & Ceremonies •",
        service_corporate: "• Corporate Events •",
        service_gala: "• Gala Dinners •"
    }
};

let currentLang = 'es';

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Update Toggle Button Text
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
        toggleBtn.textContent = lang === 'es' ? 'EN' : 'ES'; // Show the OTHER option
    }

    localStorage.setItem('preferredLang', lang);
}

function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

document.addEventListener('DOMContentLoaded', () => {
    // Check saved preference or browser default
    const saved = localStorage.getItem('preferredLang');
    const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';

    setLanguage(saved || browserLang);

    const toggleBtn = document.getElementById('lang-toggle-btn');
    toggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'es' ? 'en' : 'es';
        setLanguage(newLang);
    });

    // Trigger reveal once on load
    reveal();

    // Init Audio Player if on composer page
    if (document.getElementById('audio-player')) {
        // Dynamically load script if not present (or just rely on it being included in HTML)
        // For simplicity, we assume we added <script src="js/audio-player.js"></script> to HTML
        if (typeof initAudioPlayer === 'function') {
            initAudioPlayer();
        }
    }

    // Init Mobile Menu
    if (typeof initMobileMenu === 'function') {
        initMobileMenu();
    }
});
