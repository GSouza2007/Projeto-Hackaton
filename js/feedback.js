const stars = document.querySelectorAll('.star');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('mouseover', function() {
        const rating = this.dataset.rating;
        highlightStars(rating);
    });

    star.addEventListener('mouseout', function() {
        highlightStars(currentRating);
    });

    star.addEventListener('click', function() {
        currentRating = this.dataset.rating;
        highlightStars(currentRating);
    });
});

function highlightStars(rating) {
    stars.forEach(star => {
        const starRating = star.dataset.rating;
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

document.querySelector('.feedback-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const feedbackText = this.querySelector('textarea').value;
    if (currentRating === 0 && !feedbackText.trim()) {
        alert('Por favor, dê uma avaliação ou deixe um comentário.');
        return;
    }

    const popup = document.querySelector('.feedback-popup');
    popup.style.display = 'block';
    
    this.querySelector('textarea').value = '';
    currentRating = 0;
    highlightStars(0);

    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
});

function setActiveTab() {
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = new URL(link.href).pathname;
        if (currentPath === href) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('load', setActiveTab);