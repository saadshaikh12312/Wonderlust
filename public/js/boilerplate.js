// -------------------- new.ejs / show.ejs : JavaScript for disabling form submissions if there are invalid fields -------------------- 
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

function confirmDelete() {
    return confirm("Are you sure you want to delete this review?");
}

// -------------------- Auto-close Bootstrap alert after 5 seconds -------------------- 
let alert = document.querySelector(".flash");
if (alert) {
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 5000);
}

//  -------------------- a preview image icon on show page to show old image --------------------  
if (document.querySelector(".fa-eye")) {
    const eyeIcon = document.querySelector(".fa-eye");
    const previewImg = document.querySelector(".prv-img");
    eyeIcon.addEventListener("click", () => {
        const isVisible = previewImg.style.display === "inline-block";

        previewImg.style.display = isVisible ? "none" : "inline-block";
        eyeIcon.classList.toggle("fa-eye");
        eyeIcon.classList.toggle("fa-eye-slash");
    });
}

//  -------------------- gst switch button : show toatal price including gst -------------------- 
document.querySelector(".form-check-input").addEventListener("click", () => {
    let gstText = document.querySelectorAll(".card-text");
    gstText.forEach((ele) => {
        ele.children[2].classList.toggle("hide-item")
        ele.children[3].classList.toggle("hide-item")
    });
});

// -------------------- filter slider : added scrollbar for sliding filter icon on small screen size -------------------- 
const slider = document.querySelector(".filter-slider");
const leftBtn = document.querySelector(".scroll-btn.left");
const rightBtn = document.querySelector(".scroll-btn.right");

const SCROLL_AMOUNT = 200;

/* scroll actions */
leftBtn.addEventListener("click", () => {
    slider.scrollLeft -= SCROLL_AMOUNT;
});

rightBtn.addEventListener("click", () => {
    slider.scrollLeft += SCROLL_AMOUNT;
});

/* show / hide arrows */
function updateScrollButtons() {
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    leftBtn.style.display = slider.scrollLeft > 0 ? "block" : "none";
    rightBtn.style.display = slider.scrollLeft < maxScroll ? "block" : "none";
}

slider.addEventListener("scroll", updateScrollButtons);
window.addEventListener("resize", updateScrollButtons);
window.addEventListener("load", updateScrollButtons);

/* active filter state */
document.querySelectorAll(".filter-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelector(".filter-item.active")?.classList.remove("active");
        item.classList.add("active");
    });
});


//----------------------------- auto typing effect in search bar -----------------------------
const searchInput = document.querySelector(".search-input");

const words = [
    "Beach house",
    "Mountain stay",
    "Place",
    "City",
    "Location",
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
        // typing
        searchInput.placeholder = currentWord.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            setTimeout(() => (isDeleting = true), 1200);
        }
    } else {
        // deleting
        searchInput.placeholder = currentWord.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
}

typeEffect();