import { productSections } from "./product-sections-data.js"; 

function productBadge(product) {
  if (!product.badge) return "";

  return `
    <span class="absolute left-4 top-4 z-10 rounded ${product.badgeClass} px-2 py-1 text-[10px] font-semibold uppercase text-white">
      ${product.badge}
    </span>
  `;
}

function productImage(product) {
  if (!product.image) return "";

  return `
    <img
      src="${product.image}"
      alt="${product.name}"
      class="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
    />
  `;
}

function productSlug(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function productDetailsHref(productName) {
  return `/products/details/${productSlug(productName)}.html`;
}

function productCard(product, sectionLink) {
  const productLink = product.link || productDetailsHref(product.name);

  return `
    <a
      href="${productLink}"
      class="group overflow-hidden rounded-[12px] border border-[#dbe8f5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,87,216,0.14)]"
    >
      <div class="relative h-[185px] bg-white">
        ${productBadge(product)}
        ${productImage(product)}
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

function productSection(section) {
  return `
    <section class="${section.bg} py-10">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div class="mb-5 flex items-center justify-between gap-4">
          <h2 class="text-[26px] font-semibold text-[#0b1f33]">
            ${section.title}
          </h2>

          <a
            href="${section.link}"
            class="text-[13px] font-semibold text-[#0057d8] hover:text-[#0b1f33]"
          >
            View All Products →
          </a>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          ${section.products
            .map((product) => productCard(product, section.link))
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function initProductSections() {
  const root = document.querySelector("#product-sections-root");
  if (!root) return;

  root.innerHTML = productSections.map(productSection).join("");
}