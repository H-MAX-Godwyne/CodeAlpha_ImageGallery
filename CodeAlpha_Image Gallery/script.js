
const images = document.querySelectorAll(".gallery img");
const filters = document.querySelectorAll(".filter");

const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("largeImage");

const closeBtn = document.getElementById("close");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let currentIndex = 0;
let visibleImages = Array.from(images);

// Open an image
images.forEach((image) => {
    image.addEventListener("click", () => {
        visibleImages = Array.from(images).filter(
            img => !img.classList.contains("hidden")
        );

        currentIndex = visibleImages.indexOf(image);

        largeImage.src = image.src;
        largeImage.alt = image.alt;
        lightbox.classList.add("show");
    });
});

// Close the large image
closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
});

// Show the next image
nextBtn.addEventListener("click", () => {
    currentIndex =
        (currentIndex + 1) % visibleImages.length;

    showImage();
});

// Show the previous image
prevBtn.addEventListener("click", () => {
    currentIndex =
        (currentIndex - 1 + visibleImages.length)
        % visibleImages.length;

    showImage();
});

function showImage() {
    const image = visibleImages[currentIndex];

    largeImage.src = image.src;
    largeImage.alt = image.alt;
}

// Filter images by category
filters.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.dataset.filter;

        filters.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        images.forEach((image) => {
            if (
                category === "all" ||
                image.dataset.category === category
            ) {
                image.classList.remove("hidden");
            } else {
                image.classList.add("hidden");
            }
        });
    });
});

// Close when clicking the dark background
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        lightbox.classList.remove("show");
    }
});

// Close using the Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        lightbox.classList.remove("show");
    }
});
