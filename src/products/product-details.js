import { productSections } from "./product-sections-data.js";
import { navItems } from "../data/nav-data.js";
 

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function productDetailsHref(productName) {
  return `/products/details/${slugify(productName)}.html`;
}

function getProductTitle(product) {
  if (typeof product === "string") return product;
  return product.name || product.title || "";
}

function getProductImage(product) {
  if (typeof product === "object" && product?.image) return product.image;
  return "";
}

function getProductImages(product) {
  if (typeof product !== "object" || !product) return [];

  if (Array.isArray(product.images) && product.images.length) {
    return product.images.filter(Boolean);
  }

  if (product.image) return [product.image];

  return [];
}

function getProductPrice(product) {
  if (typeof product === "object" && product?.price) return product.price;
  return "Call for Price";
}

function getProductDesc(product, fallback = "") {
  if (typeof product === "object" && product?.desc) return product.desc;
  return fallback;
}

function makeSku(name) {
  return `GCTL-${slugify(name).slice(0, 6).toUpperCase()}`;
}

function getCurrentProductSlug() {
  const lastPart = window.location.pathname.split("/").filter(Boolean).pop();
  return (lastPart || "").replace(/\.html$/, "");
}

function normalizeProduct(product, meta = {}) {
  const name = getProductTitle(product);
  const productObject = typeof product === "object" && product ? product : {};

  return {
    name,
    slug: slugify(name),
    href: productDetailsHref(name),
    desc:
      getProductDesc(product) ||
      meta.desc ||
      `Professional ${meta.category || "LED display"} solution for commercial use.`,
    image: getProductImage(product),
    images: getProductImages(product),
    price: getProductPrice(product),
    sku: productObject.sku || makeSku(name),
    badge: productObject.badge || "",
    badgeClass: productObject.badgeClass || "",
    category: meta.category || "Products",
    categoryLink: meta.categoryLink || "/products.html",
    group: meta.group || "",
  };
}

function collectSectionProducts() {
  return productSections.flatMap((section) =>
    section.products.map((product) =>
      normalizeProduct(product, {
        category: section.title,
        categoryLink: section.link,
      }),
    ),
  );
}

function collectNavbarProducts() {
  const products = [];

  navItems.forEach((item) => {
    if (item.type !== "productMegaTree") return;

    item.categories?.forEach((mainCategory) => {
      mainCategory.children?.forEach((subCategory) => {
        subCategory.groups?.forEach((group) => {
          group.products?.forEach((product) => {
            products.push(
              normalizeProduct(product, {
                category: subCategory.label,
                categoryLink: subCategory.href,
                group: group.title,
                desc:
                  product.desc ||
                  `${product.name} is a professional ${subCategory.label} solution for commercial display, advertising and business use.`,
              }),
            );
          });
        });
      });
    });
  });

  return products;
}
function getAllProducts() {
  const productMap = new Map();

  [...collectSectionProducts(), ...collectNavbarProducts()].forEach(
    (product) => {
      const oldProduct = productMap.get(product.slug);

      if (!oldProduct) {
        productMap.set(product.slug, product);
        return;
      }

      productMap.set(product.slug, {
        ...product,
        ...oldProduct,
        image: oldProduct.image || product.image,
        images: oldProduct.images?.length ? oldProduct.images : product.images,
        desc: oldProduct.desc || product.desc,
        price: oldProduct.price || product.price,
        category: oldProduct.category || product.category,
        categoryLink: oldProduct.categoryLink || product.categoryLink,
      });
    },
  );

  return Array.from(productMap.values());
}

function productBadge(product) {
  if (!product.badge) return "";

  return `
    <span class="absolute left-4 top-4 z-10 rounded ${product.badgeClass} px-2 py-1 text-[10px] font-semibold uppercase text-white">
      ${product.badge}
    </span>
  `;
}

function productCardImage(product) {
  if (!product.image) {
    return `
      <div class="flex h-full w-full items-center justify-center">
        <div class="text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-blue-100 bg-white text-[24px] text-[#0050a8]">
            🖼
          </div>

          <p class="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0050a8]">
            Image Missing
          </p>
        </div>
      </div>
    `;
  }

  return `
    <img
      src="${product.image}"
      alt="${product.name}"
      class="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
    />
  `;
}

/* Related product card: same style as your homepage product card */
function relatedCard(product) {
  return `
    <a
      href="${product.href}"
      class="group overflow-hidden rounded-[12px] border border-[#dbe8f5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,87,216,0.14)]"
    >
      <div class="relative h-[185px] bg-[#f3f8ff]">
        ${productBadge(product)}
        ${productCardImage(product)}
      </div>

      <div class="p-4">
        <h3 class="text-[16px] font-semibold text-[#0b1f33]">
          ${product.name}
        </h3>

        <p class="mt-2 text-[13px] leading-6 text-[#5d6b7a]">
          ${product.desc}
        </p>

        <span class="mt-4 inline-flex text-[13px] font-semibold text-[#0057d8]">
          Learn More →
        </span>
      </div>
    </a>
  `;
}

function galleryItems(product) {
  if (product.images?.length) {
    const images = product.images.filter(Boolean);

    if (images.length >= 4) return images.slice(0, 4);

    return [...images, ...Array(4 - images.length).fill(images[0])];
  }

  if (product.image) {
    return [product.image, product.image, product.image, product.image];
  }

  return [null, null, null, null];
}

function galleryView(image, productName) {
  if (!image) {
    return `
      <div class="flex h-full min-h-[430px] items-center justify-center bg-white">
        <div class="text-center">
          <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-blue-100 bg-[#f7fbff] text-[42px] text-[#0050a8]">
            🖼
          </div>

          <p class="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0050a8]">
            Product Image
          </p>

          <p class="mt-2 text-[13px] text-slate-500">
            Add image path in product data later
          </p>
        </div>
      </div>
    `;
  }

  return `
    <div
      data-product-zoom-wrap
      class="group relative flex h-full min-h-[430px] cursor-zoom-in items-center justify-center overflow-hidden bg-white p-8"
    >
      <img
        data-product-zoom-img
        src="${image}"
        alt="${productName}"
        class="max-h-[420px] w-full object-contain transition-transform duration-200 ease-out"
      />
    </div>
  `;
}

function galleryThumb(image, productName, index) {
  return `
    <button
      type="button"
      data-product-thumb="${index}"
      class="flex h-[112px] w-full items-center justify-center border bg-white p-2 transition ${
        index === 0
          ? "border-[#0057d8]"
          : "border-[#dbe8f5] hover:border-[#0057d8]"
      }"
    >
      ${
        image
          ? `
            <img
              src="${image}"
              alt="${productName}"
              class="h-full w-full object-contain"
            />
          `
          : `
            <div class="text-center">
              <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-blue-100 bg-[#f7fbff] text-[17px] text-[#0050a8]">
                🖼
              </div>
            </div>
          `
      }
    </button>
  `;
}

function renderStars() {
  return `
    <div class="flex items-center gap-2">
      <div class="text-[15px] tracking-[2px] text-slate-300">
        ★★★★★
      </div>

      <span class="text-[12px] font-semibold text-slate-400">
        ( There are no reviews yet. )
      </span>
    </div>
  `;
}

function renderSocialButtons() {
  return `
    <div class="flex flex-wrap items-center gap-3">
      <button class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe8f5] text-[12px] font-semibold text-slate-600 hover:border-[#0057d8] hover:text-[#0057d8]">
        f
      </button>

      <button class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe8f5] text-[12px] font-semibold text-slate-600 hover:border-[#0057d8] hover:text-[#0057d8]">
        x
      </button>

      <button class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe8f5] text-[12px] font-semibold text-slate-600 hover:border-[#0057d8] hover:text-[#0057d8]">
        in
      </button>

      <button class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe8f5] text-[12px] font-semibold text-slate-600 hover:border-[#0057d8] hover:text-[#0057d8]">
        yt
      </button>

      <button class="ml-2 text-[12px] font-bold uppercase text-[#0b1f33] hover:text-[#0057d8]">
        ♡ Add to Wishlist
      </button>

      <button class="text-[12px] font-bold uppercase text-[#0b1f33] hover:text-[#0057d8]">
        ⌘ Compare
      </button>
    </div>
  `;
}

function renderTabs(product) {
  return `
    <section class="bg-white py-10">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div class="border-b border-[#dbe8f5]">
          <div class="flex flex-wrap gap-7">
            <button
              type="button"
              data-product-tab="description"
              class="border-b-2 border-[#0b1f33] pb-4 text-[12px] font-bold uppercase tracking-wide text-[#0b1f33]"
            >
              Description
            </button>

            <button
              type="button"
              data-product-tab="details"
              class="border-b-2 border-transparent pb-4 text-[12px] font-bold uppercase tracking-wide text-slate-500 hover:text-[#0b1f33]"
            >
              Details
            </button>

            <button
              type="button"
              data-product-tab="specifications"
              class="border-b-2 border-transparent pb-4 text-[12px] font-bold uppercase tracking-wide text-slate-500 hover:text-[#0b1f33]"
            >
              Specifications
            </button>
          </div>
        </div>

        <div class="pt-8">
          <div data-product-tab-panel="description">
            <p class="max-w-[860px] text-[14px] leading-8 text-slate-600">
              ${product.desc}
            </p>
          </div>

          <div data-product-tab-panel="details" class="hidden">
            <p class="max-w-[860px] text-[14px] leading-8 text-slate-600">
              ${product.name} is designed for commercial display usage including showroom, retail, office, advertising, information display and customer engagement.
            </p>
          </div>

          <div data-product-tab-panel="specifications" class="hidden">
            <div class="max-w-[760px] overflow-hidden rounded-2xl border border-[#dbe8f5]">
              <div class="grid grid-cols-[160px_1fr] border-b border-[#dbe8f5]">
                <div class="bg-[#f7fbff] p-4 text-[13px] font-bold text-[#0b1f33]">Product Name</div>
                <div class="p-4 text-[13px] text-slate-600">${product.name}</div>
              </div>

              <div class="grid grid-cols-[160px_1fr] border-b border-[#dbe8f5]">
                <div class="bg-[#f7fbff] p-4 text-[13px] font-bold text-[#0b1f33]">SKU</div>
                <div class="p-4 text-[13px] text-slate-600">${product.sku}</div>
              </div>

              <div class="grid grid-cols-[160px_1fr] border-b border-[#dbe8f5]">
                <div class="bg-[#f7fbff] p-4 text-[13px] font-bold text-[#0b1f33]">Category</div>
                <div class="p-4 text-[13px] text-slate-600">${product.category}</div>
              </div>

              <div class="grid grid-cols-[160px_1fr]">
                <div class="bg-[#f7fbff] p-4 text-[13px] font-bold text-[#0b1f33]">Price</div>
                <div class="p-4 text-[13px] text-slate-600">${product.price}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderNotFound(root) {
  root.innerHTML = `
    <section class="bg-[#f7fbff] py-24">
      <div class="mx-auto max-w-[900px] px-4 text-center">
        <h1 class="text-[34px] font-bold text-[#0b1f33]">
          Product Not Found
        </h1>

        <p class="mt-4 text-[15px] leading-7 text-slate-600">
          This product slug does not match your product data.
        </p>

        <a
          href="/"
          class="mt-8 inline-flex rounded-xl bg-[#0057d8] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#003f9e]"
        >
          Back to Home
        </a>
      </div>
    </section>
  `;
}

function renderProductDetails(root, product, allProducts) {
  const thumbs = galleryItems(product);

  let relatedProducts = allProducts
    .filter(
      (item) =>
        item.slug !== product.slug && item.category === product.category,
    )
    .slice(0, 4);

  if (!relatedProducts.length) {
    relatedProducts = allProducts
      .filter((item) => item.slug !== product.slug)
      .slice(0, 4);
  }

  root.innerHTML = `
    <section class="bg-white py-10">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div class="mb-8 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          <a href="/" class="hover:text-[#0057d8]">Home</a>
          <span class="mx-3">/</span>
          <a href="${product.categoryLink}" class="hover:text-[#0057d8]">
            ${product.category}
          </a>
          <span class="mx-3">/</span>
          <span class="text-slate-500">${product.name}</span>
        </div>

        <div class="grid gap-8 lg:grid-cols-[105px_minmax(0,1fr)_520px]">
          <div class="hidden flex-col gap-3 lg:flex">
            ${thumbs
              .map((image, index) => galleryThumb(image, product.name, index))
              .join("")}
          </div>

          <div>
            <div class="relative border border-transparent bg-white">
              <div id="product-main-view">
                ${galleryView(thumbs[0], product.name)}
              </div>

              <button
                type="button"
                data-product-prev
                class="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-[#dbe8f5] bg-white text-[20px] text-slate-500 shadow-sm hover:border-[#0057d8] hover:text-[#0057d8]"
              >
                ‹
              </button>

              <button
                type="button"
                data-product-next
                class="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-[#dbe8f5] bg-white text-[20px] text-slate-500 shadow-sm hover:border-[#0057d8] hover:text-[#0057d8]"
              >
                ›
              </button>
            </div>

            <div class="mt-4 flex gap-3 overflow-x-auto lg:hidden">
              ${thumbs
                .map((image, index) => galleryThumb(image, product.name, index))
                .join("")}
            </div>
          </div>

          <div class="pt-1">
            <h1 class="text-[28px] font-normal leading-tight text-[#1f2937] md:text-[32px]">
              ${product.name}
            </h1>

            <div class="mt-5">
              ${renderStars()}
            </div>

            <div class="mt-7">
              ${renderSocialButtons()}
            </div>

            <div class="mt-8 border-t border-[#dbe8f5] pt-8">
              <h2 class="text-[20px] font-normal text-[#0b1f33]">
                ${product.price}
              </h2>

              <p class="mt-3 text-[14px] leading-7 text-slate-600">
                ${product.desc}
              </p>

              <div class="mt-7 space-y-4 text-[13px] uppercase tracking-wide">
                <p>
                  <span class="font-bold text-[#0b1f33]">SKU:</span>
                  <span class="text-slate-500">${product.sku}</span>
                </p>

                <p>
                  <span class="font-bold text-[#0b1f33]">Category:</span>
                  <a href="${product.categoryLink}" class="text-slate-500 hover:text-[#0057d8]">
                    ${product.category}
                  </a>
                </p>
              </div>
            </div>

            <div class="mt-8 border-t border-[#dbe8f5] pt-6">
              <div class="flex flex-wrap gap-3">
                <div class="flex h-12 overflow-hidden border border-[#dbe8f5]">
                  <button
                    type="button"
                    data-qty-minus
                    class="w-12 text-[18px] text-slate-500 hover:bg-[#f7fbff]"
                  >
                    -
                  </button>

                  <input
                    data-qty-input
                    type="text"
                    value="1"
                    readonly
                    class="w-16 border-x border-[#dbe8f5] text-center text-[15px] font-bold outline-none"
                  />

                  <button
                    type="button"
                    data-qty-plus
                    class="w-12 text-[18px] text-slate-500 hover:bg-[#f7fbff]"
                  >
                    +
                  </button>
                </div>

                <a
                  href="tel:+8801847213869"
                  class="flex h-12 items-center justify-center bg-slate-500 px-9 text-[13px] font-bold uppercase text-white hover:bg-slate-700"
                >
                  Call Now
                </a>

                <a
                  href="https://wa.me/8801847213869"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex h-12 items-center justify-center bg-[#111827] px-9 text-[13px] font-bold uppercase text-white hover:bg-black"
                >
                  WhatsApp
                </a>
              </div>

              <p class="mt-5 text-[13px] text-slate-500">
                Need price? Call: +880 1847 213869
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${renderTabs(product)}

    <section class="bg-[#f7fbff] py-12">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div class="mb-6">
          <p class="text-[12px] font-bold uppercase tracking-[0.25em] text-[#0057d8]">
            Explore More
          </p>

          <h2 class="mt-2 text-[26px] font-semibold text-[#0b1f33]">
            Related Products
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          ${relatedProducts.map(relatedCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function initProductGallery(product) {
  const thumbs = galleryItems(product);
  const mainView = document.querySelector("#product-main-view");
  const thumbButtons = document.querySelectorAll("[data-product-thumb]");
  const prevBtn = document.querySelector("[data-product-prev]");
  const nextBtn = document.querySelector("[data-product-next]");

  if (!mainView || !thumbButtons.length) return;

  let activeIndex = 0;

  function updateActiveThumb() {
    thumbButtons.forEach((button) => {
      const isActive = Number(button.dataset.productThumb) === activeIndex;

      button.classList.toggle("border-[#0057d8]", isActive);
      button.classList.toggle("border-[#dbe8f5]", !isActive);
    });
  }

  function showImage(index) {
    activeIndex = (index + thumbs.length) % thumbs.length;

    mainView.innerHTML = galleryView(thumbs[activeIndex], product.name);

    updateActiveThumb();

    // important: every time image changes, zoom needs to be attached again
    initProductZoom();
  }

  thumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showImage(Number(button.dataset.productThumb));
    });
  });

  prevBtn?.addEventListener("click", () => {
    showImage(activeIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    showImage(activeIndex + 1);
  });

  // important: first page load zoom
  updateActiveThumb();
  initProductZoom();
}
function initProductZoom() {
  const zoomWrap = document.querySelector("[data-product-zoom-wrap]");
  const zoomImg = document.querySelector("[data-product-zoom-img]");

  if (!zoomWrap || !zoomImg) return;

  zoomWrap.addEventListener("mousemove", (e) => {
    const rect = zoomWrap.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    zoomImg.style.transformOrigin = `${x}% ${y}%`;
    zoomImg.style.transform = "scale(1.8)";
  });

  zoomWrap.addEventListener("mouseleave", () => {
    zoomImg.style.transformOrigin = "center center";
    zoomImg.style.transform = "scale(1)";
  });
}

function initProductTabs() {
  const tabButtons = document.querySelectorAll("[data-product-tab]");
  const tabPanels = document.querySelectorAll("[data-product-tab-panel]");

  if (!tabButtons.length || !tabPanels.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const activeTab = button.dataset.productTab;

      tabButtons.forEach((tabButton) => {
        const isActive = tabButton.dataset.productTab === activeTab;

        tabButton.classList.toggle("border-[#0b1f33]", isActive);
        tabButton.classList.toggle("text-[#0b1f33]", isActive);

        tabButton.classList.toggle("border-transparent", !isActive);
        tabButton.classList.toggle("text-slate-500", !isActive);
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle(
          "hidden",
          panel.dataset.productTabPanel !== activeTab,
        );
      });
    });
  });
}

function initQuantity() {
  const input = document.querySelector("[data-qty-input]");
  const minusBtn = document.querySelector("[data-qty-minus]");
  const plusBtn = document.querySelector("[data-qty-plus]");

  if (!input || !minusBtn || !plusBtn) return;

  minusBtn.addEventListener("click", () => {
    const currentValue = Number(input.value) || 1;
    input.value = Math.max(1, currentValue - 1);
  });

  plusBtn.addEventListener("click", () => {
    const currentValue = Number(input.value) || 1;
    input.value = currentValue + 1;
  });
}

export function initProductDetails() {
  const root = document.querySelector("#product-details-root");
  if (!root) return;

  const slug = getCurrentProductSlug();
  const allProducts = getAllProducts();
  const product = allProducts.find((item) => item.slug === slug);

  if (!product) {
    renderNotFound(root);
    return;
  }

  document.title = `${product.name} | GCTL LED Display Solutions`;

  renderProductDetails(root, product, allProducts);
  initProductGallery(product);
  initProductTabs();
  initQuantity();
}
