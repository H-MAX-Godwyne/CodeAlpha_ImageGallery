
const gallery = document.getElementById("gallery");
const photoButtons = [
  ...document.querySelectorAll(".photo-button")
];
const filterButtons = [
  ...document.querySelectorAll(".filter-btn")
];

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const photoCounter = document.getElementById("photoCounter");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const emptyMessage = document.getElementById("emptyMessage");

let currentIndex = 0;
let visiblePhotos = [];
let lastFocusedElement = null;

// Read photo information from the HTML.
const photos = photoButtons.map((button, index) => {
  const image = button.querySelector("img");
  const item = button.closest(".gallery-item");

  return {
    index,
    button,
    item,
    image,
    src: image.src,
    alt: image.alt,
    title: button.querySelector(".photo-title").textContent,
    category: item.dataset.category
  };
});

// Filter photos by category.
function filterPhotos(category) {
  filterButtons.forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  photos.forEach(photo => {
    const matches =
      category === "all" || photo.category === category;

    photo.item.hidden = !matches;
  });

  visiblePhotos = photos.filter(photo => !photo.item.hidden);

  emptyMessage.hidden = visiblePhotos.length > 0;

  // If the open photo becomes hidden, close the viewer.
  if (
    !lightbox.hidden &&
    !visiblePhotos.some(photo => photo.index === currentIndex)
  ) {
    closeLightbox();
  }
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterPhotos(button.dataset.filter);
  });
});

// Open a photo in the lightbox.
function openLightbox(index) {
  const photo = photos.find(item => item.index === index);

  if (!photo) return;

  lastFocusedElement = document.activeElement;
  currentIndex = index;

  updateLightbox();

  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  closeBtn.focus();
}

// Update the image and caption.
function updateLightbox() {
  const photo = photos.find(item => item.index === currentIndex);

  if (!photo) return;

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;

  const position = visiblePhotos.findIndex(
    item => item.index === currentIndex
  );

  photoCounter.textContent =
    `${position + 1} of ${visiblePhotos.length}`;

  prevBtn.disabled = visiblePhotos.length < 2;
  nextBtn.disabled = visiblePhotos.length < 2;
}

// Navigate between currently visible photos.
function movePhoto(direction) {
  if (visiblePhotos.length < 2) return;

  let position = visiblePhotos.findIndex(
    photo => photo.index === currentIndex
  );

  if (position === -1) position = 0;

  position =
    (position + direction + visiblePhotos.length) %
    visiblePhotos.length;

  currentIndex = visiblePhotos[position].index;

  updateLightbox();
}

function closeLightbox() {
  if (lightbox.hidden) return;

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Connect gallery images to the lightbox.
photoButtons.forEach(button => {
  button.addEventListener("click", () => {
    openLightbox(Number(button.dataset.index));
  });
});

closeBtn.addEventListener("click", closeLightbox);

prevBtn.addEventListener("click", () => {
  movePhoto(-1);
});

nextBtn.addEventListener("click", () => {
  movePhoto(1);
});

// Close when clicking the dark background.
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard controls: Escape, arrows and focus navigation.
document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    movePhoto(-1);
  } else if (event.key === "ArrowRight") {
    movePhoto(1);
  } else if (event.key === "Tab") {
    // Keep keyboard focus inside the photo viewer.
    const focusable = [closeBtn, prevBtn, nextBtn].filter(
      element => !element.disabled
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  }
});

// Display the current year automatically.
document.getElementById("year").textContent =
  new Date().getFullYear();

// Initialise the gallery.
filterPhotos("all");
