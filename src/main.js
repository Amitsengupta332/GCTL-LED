import "./style.css";
import { initProductSections } from "./products/product-sections.js";
async function loadComponents() {
  const components = document.querySelectorAll("[data-component]");

  for (const component of components) {
    const filePath = component.getAttribute("data-component");

    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Component not found: ${filePath}`);
      }

      const html = await response.text();
      component.innerHTML = html;
    } catch (error) {
      console.error(error);
    }
  }
}

function initNavbar() {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!mobileMenuButton || !mobileMenu) return;

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  const dotsWrapper = document.getElementById("heroDots");

  if (!slides.length || !dotsWrapper) return;

  let currentSlide = 0;
  let timer = null;
  const autoSlideDelay = 5000;

  dotsWrapper.innerHTML = "";

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

    dot.className =
      index === 0
        ? "h-2.5 w-8 rounded-full bg-[#0068c9] transition-all"
        : "h-2.5 w-2.5 rounded-full bg-blue-200 transition-all hover:bg-blue-300";

    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });

    dotsWrapper.appendChild(dot);
  });

  const dots = dotsWrapper.querySelectorAll("button");

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;

      slide.classList.toggle("opacity-100", isActive);
      slide.classList.toggle("visible", isActive);
      slide.classList.toggle("z-10", isActive);

      slide.classList.toggle("opacity-0", !isActive);
      slide.classList.toggle("invisible", !isActive);
      slide.classList.toggle("z-0", !isActive);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentSlide;

      dot.className = isActive
        ? "h-2.5 w-8 rounded-full bg-[#0068c9] transition-all"
        : "h-2.5 w-2.5 rounded-full bg-blue-200 transition-all hover:bg-blue-300";
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    timer = setInterval(nextSlide, autoSlideDelay);
  }

  function stopAutoSlide() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });

  showSlide(0);
  startAutoSlide();
}

function initTestimonials() {
  const track = document.querySelector("[data-testimonial-track]");
  if (!track) return;

  const nextButtons = document.querySelectorAll("[data-testimonial-next]");
  const prevButtons = document.querySelectorAll("[data-testimonial-prev]");

  function slideNext() {
    const width = track.clientWidth;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (track.scrollLeft >= maxScroll - 10) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: width, behavior: "smooth" });
    }
  }

  function slidePrev() {
    const width = track.clientWidth;

    if (track.scrollLeft <= 10) {
      track.scrollTo({
        left: track.scrollWidth - track.clientWidth,
        behavior: "smooth",
      });
    } else {
      track.scrollBy({ left: -width, behavior: "smooth" });
    }
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", slideNext);
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", slidePrev);
  });
}

function initProjectsSlider() {
  const slider = document.getElementById("projectsSlider");
  const prevBtn = document.getElementById("projectsPrevBtn");
  const nextBtn = document.getElementById("projectsNextBtn");

  if (!slider || !prevBtn || !nextBtn) return;

  const getScrollAmount = () => {
    const card = slider.querySelector("[data-project-card]");
    if (!card) return 320;

    const gap = 16;
    return card.offsetWidth + gap;
  };

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  });
}

function initCurrentYear() {
  const yearElements = document.querySelectorAll("[data-current-year]");
  const currentYear = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });
}

function initProjectTypeMultiSelect() {
  const multiSelects = document.querySelectorAll("[data-multi-select]");

  if (!multiSelects.length) return;

  multiSelects.forEach(function (multiSelect) {
    if (multiSelect.dataset.multiSelectReady === "true") return;
    multiSelect.dataset.multiSelectReady = "true";

    const button = multiSelect.querySelector("[data-multi-select-button]");
    const menu = multiSelect.querySelector("[data-multi-select-menu]");
    const text = multiSelect.querySelector("[data-multi-select-text]");
    const arrow = multiSelect.querySelector("[data-multi-select-arrow]");
    const checkboxes = Array.from(
      multiSelect.querySelectorAll('input[type="checkbox"]'),
    );

    if (!button || !menu || !text || !checkboxes.length) return;

    function openMenu() {
      menu.classList.remove("hidden");
      button.setAttribute("aria-expanded", "true");

      if (arrow) {
        arrow.classList.add("rotate-180");
      }
    }

    function closeMenu() {
      menu.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");

      if (arrow) {
        arrow.classList.remove("rotate-180");
      }
    }

    function toggleMenu() {
      if (menu.classList.contains("hidden")) {
        openMenu();
      } else {
        closeMenu();
      }
    }

    function updateSelectedText() {
      const selected = checkboxes
        .filter(function (checkbox) {
          return checkbox.checked;
        })
        .map(function (checkbox) {
          return checkbox.value;
        });

      if (!selected.length) {
        text.textContent = "Select project type";
        text.classList.add("text-[#8b98aa]");
        button.classList.remove("border-red-400");
        return;
      }

      text.classList.remove("text-[#8b98aa]");
      button.classList.remove("border-red-400");

      if (selected.length === 1) {
        text.textContent = selected[0];
      } else if (selected.length === 2) {
        text.textContent = selected.join(", ");
      } else {
        text.textContent = `${selected.length} project types selected`;
      }
    }

    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      toggleMenu();
    });

    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", updateSelectedText);
    });

    const form = multiSelect.closest("form");

    if (form) {
      form.addEventListener("submit", function (e) {
        const hasSelectedItem = checkboxes.some(function (checkbox) {
          return checkbox.checked;
        });

        if (!hasSelectedItem) {
          e.preventDefault();

          button.classList.add("border-red-400");
          text.textContent = "Please select at least one project type";
          text.classList.remove("text-[#8b98aa]");

          openMenu();
        }
      });
    }

    document.addEventListener("click", function (e) {
      if (!multiSelect.contains(e.target)) {
        closeMenu();
      }
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    updateSelectedText();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();

  initNavbar();
  initHeroSlider();
  initTestimonials();
  initProductSections();
  initProjectsSlider();
  initCurrentYear();
  initProjectTypeMultiSelect();
});
