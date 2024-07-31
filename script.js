    document.addEventListener("DOMContentLoaded", function() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.animation = 'fadeUp 1s forwards';
        });
    });
