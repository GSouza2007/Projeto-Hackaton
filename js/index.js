let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // Quando o usuário desce a de nav sobe 
        header.style.transform = 'translateY(-100%)';
    } else {
        // Quando o usuário sobe a nav desce 
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

//hamburguer

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".navbar");

    hamburger.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
});