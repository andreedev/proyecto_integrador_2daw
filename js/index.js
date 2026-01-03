document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = "none");
        slides[index].style.display = "block";
    }

    prevBtn.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) currentIndex = slides.length - 1;
        showSlide(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex >= slides.length) currentIndex = 0;
        showSlide(currentIndex);
    });

    showSlide(currentIndex);
});