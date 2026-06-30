import "./style.css";
// import "./blogs/blogs-data.js";
import "./videos-data.js";
import { initProductSections } from "./products/product-sections.js";
import { initProductDetails } from "./products/product-details.js";
import { navItems } from "./data/nav-data.js";
// async function loadComponents() {
//   const components = document.querySelectorAll("[data-component]");

//   for (const component of components) {
//     const filePath = component.getAttribute("data-component");

//     try {
//       const response = await fetch(filePath);

//       if (!response.ok) {
//         throw new Error(`Component not found: ${filePath}`);
//       }

//       const html = await response.text();
//       component.innerHTML = html;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

async function loadSingleComponent(component) {
  const filePath = component.getAttribute("data-component");
  if (!filePath) return;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Component not found: ${filePath}`);
    }

    const html = await response.text();
    component.innerHTML = html;

    // Important: loaded component আবার query-তে না আসে
    component.removeAttribute("data-component");
  } catch (error) {
    console.error(error);
  }
}

async function loadCriticalComponents() {
  const criticalComponents = Array.from(
    document.querySelectorAll('[data-component][data-critical="true"]'),
  );

  const navbarComponent = document.querySelector(
    '[data-component="/components/navbar.html"]',
  );

  const componentsToLoad = navbarComponent
    ? [
        navbarComponent,
        ...criticalComponents.filter(
          (component) => component !== navbarComponent,
        ),
      ]
    : criticalComponents;

  await Promise.all(componentsToLoad.map(loadSingleComponent));
}

async function loadNormalComponents() {
  const normalComponents = Array.from(
    document.querySelectorAll("[data-component]"),
  );

  await Promise.all(normalComponents.map(loadSingleComponent));
}

function loadNormalComponentsWhenIdle(callback) {
  const run = async () => {
    await loadNormalComponents();
    callback?.();
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 1200 });
  } else {
    setTimeout(run, 300);
  }
}

function initNavbar() {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const searchDropdown = document.getElementById("searchDropdown");

  if (!mobileMenuButton || !mobileMenu) return;

  function openMobileMenu() {
    mobileMenu.classList.remove("hidden");
    mobileMenuButton.setAttribute("aria-expanded", "true");

    searchDropdown?.classList.add("hidden");
  }

  function closeMobileMenu() {
    mobileMenu.classList.add("hidden");
    mobileMenuButton.setAttribute("aria-expanded", "false");
  }

  function toggleMobileMenu() {
    if (mobileMenu.classList.contains("hidden")) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  }

  mobileMenuButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  });

  mobileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  const topDetails = Array.from(
    mobileMenu.querySelectorAll("#mobileNav > details"),
  );

  topDetails.forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;

      topDetails.forEach((otherDetails) => {
        if (otherDetails !== details) {
          otherDetails.open = false;
        }
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !mobileMenuButton.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  });
}

function escapeHtml(text) {
  return String(text || "").replace(/[&<>"']/g, (match) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return map[match];
  });
}

function collectSearchItems() {
  const results = [];

  function pushResult(label, href, type) {
    if (!label || !href) return;

    results.push({
      label,
      href,
      type,
    });
  }

  navItems.forEach((item) => {
    if (item.href) {
      pushResult(item.label, item.href, "Page");
    }

    if (item.type === "dropdown") {
      item.items?.forEach((child) => {
        pushResult(child.label, child.href, item.label);
      });
    }

    if (item.type === "productMegaTree") {
      item.categories?.forEach((category) => {
        category.children?.forEach((sub) => {
          pushResult(sub.label, sub.href, item.label);

          sub.groups?.forEach((group) => {
            group.products?.forEach((product) => {
              const productTitle = getProductTitle(product);

              pushResult(
                productTitle,
                createProductHref(sub.href, productTitle),
                sub.label,
              );
            });
          });
        });
      });
    }
  });

  return results;
}

function initSearchDropdown() {
  const desktopSearchButton = document.getElementById("desktopSearchButton");
  const mobileSearchButton = document.getElementById("mobileSearchButton");
  const searchDropdown = document.getElementById("searchDropdown");
  const siteSearchInput = document.getElementById("siteSearchInput");
  const siteSearchResults = document.getElementById("siteSearchResults");
  const mobileMenu = document.getElementById("mobileMenu");

  const searchButtons = [desktopSearchButton, mobileSearchButton].filter(
    Boolean,
  );

  if (!searchButtons.length || !searchDropdown || !siteSearchResults) return;

  const allItems = collectSearchItems();

  function renderResults(query = "") {
    const searchText = query.trim().toLowerCase();

    const matchedItems = allItems
      .filter((item) => {
        if (!searchText) return true;

        return (
          item.label.toLowerCase().includes(searchText) ||
          item.type.toLowerCase().includes(searchText)
        );
      })
      .slice(0, 9);

    if (!matchedItems.length) {
      siteSearchResults.innerHTML = `
        <p class="px-3 py-3 text-[13px] text-slate-500">
          No product found.
        </p>
      `;
      return;
    }

    siteSearchResults.innerHTML = matchedItems
      .map(
        (item) => `
          <a
            href="${item.href}"
            class="block rounded-lg px-3 py-3 transition hover:bg-white hover:shadow-sm">
            <span class="block text-[13px] font-bold text-slate-900">
              ${escapeHtml(item.label)}
            </span>

            <span class="mt-0.5 block text-[11px] font-semibold text-[#0050a8]">
              ${escapeHtml(item.type)}
            </span>
          </a>
        `,
      )
      .join("");
  }

  function openSearch() {
    searchDropdown.classList.remove("hidden");
    mobileMenu?.classList.add("hidden");

    searchButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "true");
    });

    renderResults(siteSearchInput?.value || "");

    setTimeout(() => {
      siteSearchInput?.focus();
    }, 50);
  }

  function closeSearch() {
    searchDropdown.classList.add("hidden");

    searchButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function toggleSearch() {
    if (searchDropdown.classList.contains("hidden")) {
      openSearch();
    } else {
      closeSearch();
    }
  }

  searchButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSearch();
    });
  });

  siteSearchInput?.addEventListener("input", () => {
    renderResults(siteSearchInput.value);
  });

  searchDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    closeSearch();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearch();
    }
  });

  renderResults();
}

function initIndustriesSlider() {
  const slider = document.getElementById("industriesSlider");
  if (!slider) return;

  const prevBtn = document.getElementById("industriesPrevBtn");
  const nextBtn = document.getElementById("industriesNextBtn");
  const mobilePrevBtn = document.getElementById("industriesMobilePrevBtn");
  const mobileNextBtn = document.getElementById("industriesMobileNextBtn");

  function getScrollAmount() {
    const card = slider.querySelector("[data-industry-card]");
    if (!card) return 260;

    const gap = 16;
    return card.offsetWidth + gap;
  }

  function slideNext() {
    slider.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  }

  function slidePrev() {
    slider.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  }

  nextBtn?.addEventListener("click", slideNext);
  prevBtn?.addEventListener("click", slidePrev);
  mobileNextBtn?.addEventListener("click", slideNext);
  mobilePrevBtn?.addEventListener("click", slidePrev);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createProductHref(baseHref, productName) {
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

function getProductPrice(product) {
  if (typeof product === "object" && product?.price) return product.price;
  return "Call for Price";
}

function dropdownChevronIcon() {
  return `
    <svg
      class="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:rotate-180"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  `;
}

function renderSimpleDropdown(item) {
  const isActive = isNavItemActive(item);

  if (item.dropdownStyle === "media-list") {
    return `
      <div class="group relative">
        <button
          type="button"
          class="relative flex h-[76px] items-center gap-1.5 text-[14px] font-medium transition hover:text-[#0050a8]
          after:absolute after:bottom-0 after:left-0 after:h-[4px] after:rounded-full after:bg-[#0050a8] after:transition-all after:duration-300 group-hover:after:w-full
          ${isActive ? "text-[#0050a8] after:w-full" : "after:w-0"}"
        >
          ${item.label}
          ${dropdownChevronIcon()}
        </button>

       <div class="invisible absolute left-0 top-full z-50 w-[300px] pt-0 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/70">
            ${item.items
              .map(
                (child, index) => `
                  <a
                    href="${child.href}"
                    class="flex items-center justify-between gap-4 px-5 py-4 text-[14px] font-bold text-slate-900 transition hover:bg-[#f7fbff] hover:text-[#0050a8]
                    ${index !== item.items.length - 1 ? "border-b border-slate-100" : ""}"
                  >
                    <span>${child.label}</span>
                    <span class="text-[15px] text-[#0050a8]">→</span>
                  </a>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  const dropdownWidth = item.columns === 3 ? "w-[760px]" : "w-[560px]";
  const gridCols = item.columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return `
    <div class="group relative">
      <button
        type="button"
        class="relative flex h-[76px] items-center gap-1.5 text-[14px] font-medium transition hover:text-[#0050a8]
        after:absolute after:bottom-0 after:left-0 after:h-[4px] after:rounded-full after:bg-[#0050a8] after:transition-all after:duration-300 group-hover:after:w-full
        ${isActive ? "text-[#0050a8] after:w-full" : "after:w-0"}"
      >
        ${item.label}
        ${dropdownChevronIcon()}
      </button>

      <div class="invisible absolute left-1/2 top-full z-50 ${dropdownWidth} -translate-x-1/2 pt-0 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div class="grid ${gridCols} gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-200/70">
          ${item.items
            .map(
              (child) => `
                <a href="${child.href}" class="rounded-xl p-4 hover:bg-blue-50">
                  <h4 class="text-[14px] font-semibold text-slate-900">${child.label}</h4>
                  <p class="mt-1 text-[12px] leading-5 text-slate-500">${child.desc}</p>
                </a>
              `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderProductMegaTree(item) {
  const isActive = isNavItemActive(item);
  const firstMain = item.categories?.[0];
  const firstSub = firstMain?.children?.[0];
  const firstGroup = firstSub?.groups?.[0];

  const firstSubKey = `${firstMain?.id}__${firstSub?.id}`;
  const firstGroupKey = `${firstMain?.id}__${firstSub?.id}__${slugify(
    firstGroup?.title || "",
  )}`;

  function renderProductImage(product) {
    const image = getProductImage(product);
    const title = getProductTitle(product);

    return `
      <div class="relative flex h-[96px] items-center justify-center overflow-hidden rounded-lg border border-[#e6eefb] bg-[#f8fbff] p-2">
        ${
          image
            ? `
              <img
                data-mega-src="${image}"
                alt="${title}"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-contain"
                onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');"
              />

              <div class="hidden text-center">
                <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-blue-100 bg-white text-[17px] text-[#0050a8]">
                  🖼
                </div>
                <p class="mt-1 text-[9px] font-bold text-[#0050a8]">Image Missing</p>
              </div>
            `
            : `
              <div class="text-center">
                <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-blue-100 bg-white text-[17px] text-[#0050a8]">
                  🖼
                </div>
                <p class="mt-1 text-[9px] font-bold text-[#0050a8]">Image Missing</p>
              </div>
            `
        }
      </div>
    `;
  }

  return `
    <div class="group">
      <button
        type="button"
        class="relative flex h-[76px] items-center gap-1.5 text-[14px] font-medium transition hover:text-[#0050a8]
        after:absolute after:bottom-0 after:left-0 after:h-[4px] after:w-0 after:rounded-full after:bg-[#0050a8] after:transition-all after:duration-300 group-hover:after:w-full
          ${isActive ? "text-[#0050a8] after:w-full" : "after:w-0"}       
        "
      >
        ${item.label}
        ${dropdownChevronIcon()}
      </button>

      <div
        data-product-mega-tree
        class="invisible absolute left-1/2 top-full z-50 w-[1240px] max-w-[calc(100vw-32px)] -translate-x-1/2 pt-0 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
      >
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
          <div class="grid min-h-[470px] grid-cols-[300px_330px_minmax(0,1fr)]">

            <!-- LEFT SUBCATEGORY -->
            <div class="border-r border-slate-100 bg-white p-4">
              <div class="mb-4 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Product Menu
              </div>

              <div class="max-h-[410px] overflow-y-auto pr-1">
                <div class="flex flex-col gap-1.5">
                  ${firstMain.children
                    .map((sub, subIndex) => {
                      const subKey = `${firstMain.id}__${sub.id}`;
                      const isSubActive = subIndex === 0;

                      return `
                        <button
                          type="button"
                          data-tree-sub-btn="${subKey}"
                          class="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-[13px] font-semibold transition ${
                            isSubActive
                              ? "bg-blue-50 text-[#0050a8]"
                              : "text-slate-700 hover:bg-blue-50 hover:text-[#0050a8]"
                          }"
                        >
                          <span>${sub.label}</span>
                          <span class="text-slate-400">›</span>
                        </button>
                      `;
                    })
                    .join("")}
                </div>
              </div>
            </div>

            <!-- MIDDLE GROUP -->
            <div class="border-r border-slate-100 bg-white p-5">
              ${firstMain.children
                .map((sub) => {
                  const subKey = `${firstMain.id}__${sub.id}`;
                  const isActiveSub = subKey === firstSubKey;

                  return `
                    <div
                      data-tree-group-list="${subKey}"
                      class="${isActiveSub ? "" : "hidden"}"
                    >
                      <div class="mb-4">
                        <h3 class="text-[15px] font-bold text-slate-900">
                          ${sub.label}
                        </h3>

                        <p class="mt-1 text-[12px] leading-5 text-slate-500">
                          Hover product size or display group
                        </p>
                      </div>

                      <div class="max-h-[390px] overflow-y-auto pr-1">
                        <div class="flex flex-col">
                          ${sub.groups
                            .map((group, groupIndex) => {
                              const groupKey = `${firstMain.id}__${sub.id}__${slugify(
                                group.title,
                              )}`;
                              const isGroupActive =
                                isActiveSub && groupIndex === 0;

                              return `
                                <button
                                  type="button"
                                  data-tree-group-btn="${groupKey}"
                                  class="group/mid flex w-full items-center justify-between border-b border-slate-100 px-3 py-3.5 text-left transition ${
                                    isGroupActive
                                      ? "border-[#bdd7ff] bg-[#eef5ff] text-[#0050a8]"
                                      : "border-slate-100 bg-white text-slate-700 hover:border-[#bdd7ff] hover:bg-[#f7fbff] hover:text-[#0050a8]"
                                  }"
                                >
                                  <span>
                                    <span class="block text-[13px] font-bold leading-snug">
                                      ${group.title}
                                    </span>

                                    <span class="mt-1 block text-[11px] font-semibold text-slate-400">
                                      ${group.products.length} Products
                                    </span>
                                  </span>

                                  <span class="ml-2 text-[15px] text-slate-300 group-hover/mid:text-[#0050a8]">
                                    ›
                                  </span>
                                </button>
                              `;
                            })
                            .join("")}
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>

            <!-- RIGHT PRODUCT AREA -->
            <div class="bg-white p-5">
              ${firstMain.children
                .map((sub) =>
                  sub.groups
                    .map((group) => {
                      const groupKey = `${firstMain.id}__${sub.id}__${slugify(
                        group.title,
                      )}`;
                      const isActiveGroup = groupKey === firstGroupKey;

                      return `
                        <div
                          data-tree-product-panel="${groupKey}"
                          class="${isActiveGroup ? "" : "hidden"} flex h-full flex-col"
                        >
                          <div class="mb-4 flex items-start justify-between gap-4">
                            <div>
                              <h3 class="text-[15px] font-bold leading-snug text-slate-900">
                                ${group.title}
                              </h3>

                              <p class="mt-1 text-[12px] leading-5 text-slate-500">
                                Featured product variants
                              </p>
                            </div>

                            <a
                              href="${sub.href}"
                              class="shrink-0 rounded-md border border-blue-100 px-4 py-2 text-[11px] font-bold text-[#0050a8] hover:bg-blue-50"
                            >
                              View Category →
                            </a>
                          </div>

                          <div class="overflow-hidden">
                            <div class="grid grid-cols-5 gap-3">
                              ${group.products
                                .slice(0, 5)
                                .map((product) => {
                                  const productTitle = getProductTitle(product);

                                  return `
                                    <a
                                      href="${createProductHref(sub.href, productTitle)}"
                                      class="group/card rounded-lg border border-slate-100 bg-white p-2.5 transition hover:border-[#bdd7ff] hover:shadow-md hover:shadow-slate-200/70"
                                    >
                                      ${renderProductImage(product)}

                                      <h4 class="mt-2 h-[36px] overflow-hidden text-[11px] font-bold leading-[18px] text-slate-900 group-hover/card:text-[#0050a8]">
                                        ${productTitle}
                                      </h4>
                                    </a>
                                  `;
                                })
                                .join("")}
                            </div>
                          </div>

                          <!-- QUALITY ROW -->
                          <div class="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                            <div class="flex items-center gap-3">
                              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[15px] text-[#0050a8]">✓</span>
                              <div>
                                <h4 class="text-[12px] font-bold text-slate-900">Premium Quality</h4>
                                <p class="text-[10px] text-slate-500">Top-tier products</p>
                              </div>
                            </div>

                            <div class="flex items-center gap-3">
                              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[15px] text-[#0050a8]">⚙</span>
                              <div>
                                <h4 class="text-[12px] font-bold text-slate-900">Latest Technology</h4>
                                <p class="text-[10px] text-slate-500">Advanced features</p>
                              </div>
                            </div>

                            <div class="flex items-center gap-3">
                              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[15px] text-[#0050a8]">☎</span>
                              <div>
                                <h4 class="text-[12px] font-bold text-slate-900">Global Support</h4>
                                <p class="text-[10px] text-slate-500">24/7 assistance</p>
                              </div>
                            </div>
                          </div>

                          <!-- HELP BANNER -->
                          <div class="mt-auto rounded-xl bg-gradient-to-r from-[#eef6ff] via-[#f8fbff] to-[#eaf3ff] px-4 py-3">
                            <div class="flex items-center justify-between gap-4">
                              <div>
                                <h3 class="text-[13px] font-bold text-slate-900">
                                  Need Help Choosing the Right Product?
                                </h3>

                                <p class="mt-1 max-w-[440px] text-[11px] leading-4 text-slate-500">
                                  Our experts can help you choose the perfect LED display, kiosk, video wall or digital signage solution.
                                </p>
                              </div>

                              <a
                                href="/contact.html"
                                class="shrink-0 rounded-lg bg-[#0050a8] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#003f87]"
                              >
                                Contact Experts
                              </a>
                            </div>
                          </div>
                        </div>
                      `;
                    })
                    .join(""),
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function normalizeNavPath(path) {
  if (!path) return "/";

  return (
    path
      .replace(window.location.origin, "")
      .replace(/\/index\.html$/, "/")
      .replace(/\.html$/, "")
      .replace(/\/$/, "") || "/"
  );
}

function isSameNavPath(href) {
  if (!href || href.startsWith("http") || href.startsWith("#")) return false;

  const currentPath = normalizeNavPath(window.location.pathname);
  const targetPath = normalizeNavPath(
    new URL(href, window.location.origin).pathname,
  );

  return currentPath === targetPath;
}

// function isNavItemActive(item) {
//   const currentPath = normalizeNavPath(window.location.pathname);

//   if (isSameNavPath(item.href)) return true;

//   if (item.type === "dropdown") {
//     return item.items?.some((child) => isSameNavPath(child.href));
//   }

//   if (item.type === "productMegaTree") {
//     if (currentPath.startsWith("/products")) return true;

//     return item.categories?.some((category) =>
//       category.children?.some((sub) => isSameNavPath(sub.href)),
//     );
//   }

//   return false;
// }

function isNavItemActive(item) {
  const currentPath = normalizeNavPath(window.location.pathname);

  if (isSameNavPath(item.href)) return true;

  if (item.type === "dropdown") {
    return item.items?.some((child) => isSameNavPath(child.href)) || false;
  }

  if (item.type === "productMegaTree") {
    if (currentPath.startsWith("/products/details")) return false;

    return (
      item.categories?.some((category) =>
        category.children?.some((sub) => isSameNavPath(sub.href)),
      ) || false
    );
  }

  return false;
}
function renderDesktopNav() {
  const desktopNav = document.getElementById("desktopNav");
  if (!desktopNav) return;

  desktopNav.innerHTML = navItems
    .map((item) => {
      if (item.type === "productMegaTree") {
        return renderProductMegaTree(item);
      }

      if (item.type === "dropdown") {
        return renderSimpleDropdown(item);
      }

      const isActive = isNavItemActive(item);

      return `
        <a
          href="${item.href}"
          class="relative flex h-[76px] items-center text-[14px] font-medium transition hover:text-[#0050a8]
          after:absolute after:bottom-0 after:left-0 after:h-[4px] after:rounded-full after:bg-[#0050a8] after:transition-all after:duration-300 hover:after:w-full
          ${isActive ? "text-[#0050a8] after:w-full" : "after:w-0"}"
        >
          ${item.label}
        </a>
      `;
    })
    .join("");
}

function renderMobileNav() {
  const mobileNav = document.getElementById("mobileNav");
  if (!mobileNav) return;

  mobileNav.innerHTML = navItems
    .map((item) => {
      if (item.type === "productMegaTree") {
        return `
          <details class="group rounded-xl border border-transparent open:border-blue-100 open:bg-blue-50/40">
            <summary class="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 font-semibold hover:bg-blue-50">
              <span>${item.label}</span>
              <span class="transition group-open:rotate-180">⌄</span>
            </summary>

            <div class="mt-1 flex flex-col gap-1 px-2 pb-2">
              ${item.categories
                .flatMap((category) => category.children || [])
                .map(
                  (sub) => `
                    <details class="group/sub rounded-lg bg-white">
                      <summary class="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0050a8]">
                        <span>${sub.label}</span>
                        <span class="transition group-open/sub:rotate-180">⌄</span>
                      </summary>

                      <div class="ml-3 border-l border-slate-100 pl-3">
                        <a
                          href="${sub.href}"
                          class="block py-2 text-[12px] font-bold text-[#0050a8]">
                          View ${sub.label}
                        </a>

                        ${(sub.groups || [])
                          .slice(0, 8)
                          .map(
                            (group) => `
                              <details class="group/group">
                                <summary class="flex cursor-pointer list-none items-center justify-between py-2 text-[12px] font-semibold text-slate-600">
                                  <span>${group.title}</span>
                                  <span class="transition group-open/group:rotate-180">⌄</span>
                                </summary>

                                <div class="ml-3 flex flex-col gap-1 border-l border-slate-100 pl-3">
                                  ${(group.products || [])
                                    .slice(0, 4)
                                    .map((product) => {
                                      const productTitle =
                                        getProductTitle(product);

                                      return `
                                        <a
                                          href="${createProductHref(
                                            sub.href,
                                            productTitle,
                                          )}"
                                          class="py-2 text-[12px] text-slate-500 hover:text-[#0050a8]">
                                          ${productTitle}
                                        </a>
                                      `;
                                    })
                                    .join("")}
                                </div>
                              </details>
                            `,
                          )
                          .join("")}
                      </div>
                    </details>
                  `,
                )
                .join("")}
            </div>
          </details>
        `;
      }

      if (item.type === "dropdown") {
        return `
          <details class="group rounded-xl border border-transparent open:border-blue-100 open:bg-blue-50/40">
            <summary class="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 font-semibold hover:bg-blue-50">
              <span>${item.label}</span>
              <span class="transition group-open:rotate-180">⌄</span>
            </summary>

            <div class="ml-3 flex flex-col gap-1 border-l border-slate-100 pl-3 text-[13px] text-slate-600">
              ${item.items
                .map(
                  (child) => `
                    <a href="${child.href}" class="py-2 hover:text-[#0050a8]">
                      ${child.label}
                    </a>
                  `,
                )
                .join("")}
            </div>
          </details>
        `;
      }

      return `
        <a href="${item.href}" class="rounded-xl px-3 py-3 font-semibold hover:bg-blue-50">
          ${item.label}
        </a>
      `;
    })
    .join("");
}

function loadMegaMenuImages(menu) {
  const images = menu.querySelectorAll("img[data-mega-src]");

  images.forEach((img) => {
    if (img.dataset.loaded === "true") return;

    img.src = img.dataset.megaSrc;
    img.dataset.loaded = "true";
  });
}
function initProductMegaTree() {
  const megaMenus = document.querySelectorAll("[data-product-mega-tree]");
  if (!megaMenus.length) return;

  megaMenus.forEach((menu) => {
    const menuWrapper = menu.closest(".group");

    menuWrapper?.addEventListener(
      "mouseenter",
      () => {
        loadMegaMenuImages(menu);
      },
      { once: true },
    );

    menuWrapper?.addEventListener(
      "focusin",
      () => {
        loadMegaMenuImages(menu);
      },
      { once: true },
    );

    const subButtons = menu.querySelectorAll("[data-tree-sub-btn]");
    const groupLists = menu.querySelectorAll("[data-tree-group-list]");
    const groupButtons = menu.querySelectorAll("[data-tree-group-btn]");
    const productPanels = menu.querySelectorAll("[data-tree-product-panel]");

    function activateGroup(groupKey) {
      groupButtons.forEach((button) => {
        const isActive = button.dataset.treeGroupBtn === groupKey;

        button.classList.toggle("border-[#bdd7ff]", isActive);
        button.classList.toggle("bg-[#eef5ff]", isActive);
        button.classList.toggle("text-[#0050a8]", isActive);

        button.classList.toggle("border-slate-100", !isActive);
        button.classList.toggle("bg-white", !isActive);
        button.classList.toggle("text-slate-700", !isActive);
      });

      productPanels.forEach((panel) => {
        panel.classList.toggle(
          "hidden",
          panel.dataset.treeProductPanel !== groupKey,
        );
      });
    }

    function activateSub(subKey) {
      subButtons.forEach((button) => {
        const isActive = button.dataset.treeSubBtn === subKey;

        button.classList.toggle("bg-blue-50", isActive);
        button.classList.toggle("text-[#0050a8]", isActive);

        button.classList.toggle("text-slate-700", !isActive);
      });

      groupLists.forEach((list) => {
        list.classList.toggle("hidden", list.dataset.treeGroupList !== subKey);
      });

      const activeGroupList = menu.querySelector(
        `[data-tree-group-list="${subKey}"]`,
      );

      const firstGroupButton = activeGroupList?.querySelector(
        "[data-tree-group-btn]",
      );

      if (firstGroupButton) {
        activateGroup(firstGroupButton.dataset.treeGroupBtn);
      }
    }

    subButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        activateSub(button.dataset.treeSubBtn);
      });

      button.addEventListener("focus", () => {
        activateSub(button.dataset.treeSubBtn);
      });

      button.addEventListener("click", (e) => {
        e.preventDefault();
        activateSub(button.dataset.treeSubBtn);
      });
    });

    groupButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        activateGroup(button.dataset.treeGroupBtn);
      });

      button.addEventListener("focus", () => {
        activateGroup(button.dataset.treeGroupBtn);
      });

      button.addEventListener("click", (e) => {
        e.preventDefault();
        activateGroup(button.dataset.treeGroupBtn);
      });
    });
  });
}

function renderNavbar() {
  renderDesktopNav();
  renderMobileNav();
  initProductMegaTree();
}

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  const dotsWrapper = document.getElementById("heroDots");

  if (!slides.length || !dotsWrapper) return;

  let currentSlide = 0;
  let timer = null;
  const autoSlideDelay = 5500;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const desktopQuery = window.matchMedia("(min-width: 768px)");

  function isDesktopScreen() {
    return desktopQuery.matches;
  }

  function loadSlideImage(index) {
    const slide = slides[index];
    if (!slide) return;

    const img = slide.querySelector(".hero-img");
    if (!img) return;

    if (img.dataset.loaded === "true") return;

    const picture = img.closest("picture");

    if (picture) {
      const lazySources = picture.querySelectorAll("source[data-srcset]");

      lazySources.forEach((source) => {
        source.srcset = source.dataset.srcset;
      });
    }

    const lazySrc = img.dataset.src;

    if (lazySrc && !img.getAttribute("src")) {
      img.src = lazySrc;
    }

    img.dataset.loaded = "true";
  }

  function preloadNextImage(index) {
    // Mobile PageSpeed ভালো রাখার জন্য mobile-এ next image preload করবো না।
    if (!isDesktopScreen()) return;

    const nextIndex = (index + 1) % slides.length;

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        loadSlideImage(nextIndex);
      });
    } else {
      setTimeout(() => {
        loadSlideImage(nextIndex);
      }, 900);
    }
  }

  function loadCurrentAndNext(index) {
    loadSlideImage(index);
    preloadNextImage(index);
  }

  function updateHeroDot(dot, isActive) {
    dot.className = isActive
      ? "group flex h-7 w-10 items-center justify-center rounded-full"
      : "group flex h-7 w-7 items-center justify-center rounded-full";

    dot.setAttribute("aria-current", isActive ? "true" : "false");

    dot.innerHTML = `
      <span class="${
        isActive
          ? "block h-2.5 w-8 rounded-full bg-[#0068c9] transition-all"
          : "block h-2.5 w-2.5 rounded-full bg-blue-200 transition-all group-hover:bg-blue-300"
      }"></span>
    `;
  }

  dotsWrapper.innerHTML = "";

  slides.forEach((_, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

    updateHeroDot(dot, index === 0);

    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });

    dotsWrapper.appendChild(dot);
  });

  const dots = Array.from(dotsWrapper.querySelectorAll("button"));

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    loadCurrentAndNext(currentSlide);

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;

      slide.classList.toggle("opacity-100", isActive);
      slide.classList.toggle("visible", isActive);
      slide.classList.toggle("z-10", isActive);

      slide.classList.toggle("opacity-0", !isActive);
      slide.classList.toggle("invisible", !isActive);
      slide.classList.toggle("z-0", !isActive);
      slide.classList.toggle("pointer-events-none", !isActive);
    });

    dots.forEach((dot, dotIndex) => {
      updateHeroDot(dot, dotIndex === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    if (!isDesktopScreen() || prefersReducedMotion) return;

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
  const root = document.querySelector("[data-gctl-reviews]");
  if (!root) return;

  if (root.dataset.testimonialsReady === "true") return;
  root.dataset.testimonialsReady = "true";

  const stage = root.querySelector("[data-review-stage]");
  const dotsWrapper = root.querySelector("[data-review-dots]");
  const prevButtons = root.querySelectorAll("[data-review-prev]");
  const nextButtons = root.querySelectorAll("[data-review-next]");

  if (!stage || !dotsWrapper) return;

  const reviews = [
    {
      name: "Michael Thompson",
      role: "Project Director",
      country: "United States",
      flag: "🇺🇸",
      avatar: "/images/testimonials/client-01.avif",
      text: "GCTL supported our commercial LED display project with clear planning, professional communication, and reliable installation. The screen quality, brightness, and overall finishing helped us deliver a premium visual experience for our business environment.",
    },
    {
      name: "Emily Carter",
      role: "Head of Event Production",
      country: "The UK",
      flag: "🇬🇧",
      avatar: "/images/testimonials/client-02.avif",
      text: "For our event productions, we needed LED screens that were easy to assemble, stable during long programs, and visually powerful. GCTL provided a dependable solution with smooth performance and responsive support whenever our team needed help.",
    },
    {
      name: "David Trem",
      role: "Creative Director",
      country: "The US",
      flag: "🇺🇸",
      avatar: "/images/testimonials/client-03.avif",
      text: "Our advertising campaigns depend on displays that look sharp from every angle. GCTL helped us choose the right indoor and outdoor LED solutions, and the final result improved both campaign visibility and client satisfaction.",
    },
    {
      name: "James Will",
      role: "Technical Director",
      country: "Australia",
      flag: "🇦🇺",
      avatar: "/images/testimonials/client-04.avif",
      text: "As a system integration team, we care about stability, compatibility, and support. GCTL provided LED display hardware that integrated smoothly with our control system and reduced installation complexity for our technical team.",
    },
    {
      name: "Lisa Becky",
      role: "Retail Operations Manager",
      country: "Germany",
      flag: "🇩🇪",
      avatar: "/images/testimonials/client-05.avif",
      text: "Our retail locations needed clear LED displays for product promotion and brand presentation. GCTL understood our store requirements, suggested suitable screen sizes, and completed installation with very little disruption to daily operations.",
    },
    {
      name: "Pierre Dubo",
      role: "Senior Architect",
      country: "France",
      flag: "🇫🇷",
      avatar: "/images/testimonials/client-06.avif",
      text: "We needed LED screens that matched a clean architectural interior without looking bulky. GCTL provided a slim, modern display solution that blended nicely with our design concept and delivered excellent visual quality.",
    },
    {
      name: "Khalid Rahman",
      role: "CEO",
      country: "Qatar",
      flag: "🇶🇦",
      avatar: "/images/testimonials/client-07.avif",
      text: "For outdoor advertising, brightness and durability are extremely important. GCTL guided us through the right LED display options and delivered a solution that performs reliably in demanding outdoor conditions.",
    },
    {
      name: "Carlos RL",
      role: "Event Technical Manager",
      country: "Spain",
      flag: "🇪🇸",
      avatar: "/images/testimonials/client-08.avif",
      text: "Our event team needed lightweight LED equipment that could be installed quickly and perform smoothly during live shows. GCTL provided a practical rental display solution with excellent refresh rate and strong visual impact.",
    },
    {
      name: "Benjamin Tanni",
      role: "Project Manager",
      country: "Singapore",
      flag: "🇸🇬",
      avatar: "/images/testimonials/client-09.avif",
      text: "GCTL helped us complete multiple display projects on a tight schedule. Their team was organized, supportive, and focused on practical solutions, which made the whole process much easier for our project team.",
    },
    {
      name: "Mohammad AL",
      role: "Technical Director",
      country: "Saudi Arabia",
      flag: "🇸🇦",
      avatar: "/images/testimonials/client-10.avif",
      text: "We needed dependable LED display products with clear technical guidance and after-sales support. GCTL provided a balanced solution with good performance, practical installation advice, and reliable communication.",
    },
    {
      name: "John Mkhize",
      role: "Network Operations Manager",
      country: "South Africa",
      flag: "🇿🇦",
      avatar: "/images/testimonials/client-11.avif",
      text: "Our outdoor billboard network requires screens that can stay bright and stable throughout changing weather. GCTL provided a durable LED display solution that supports our business needs with consistent performance.",
    },
    {
      name: "Abdullah Ahmed",
      role: "Chief Event Designer",
      country: "UAE",
      flag: "🇦🇪",
      avatar: "/images/testimonials/client-12.avif",
      text: "For large events and entertainment projects, visual performance matters a lot. GCTL delivered LED displays with strong brightness, solid structure, and helpful technical support during planning and installation.",
    },
  ];

  let currentIndex = 0;
  let autoTimer = null;
  let touchStartX = 0;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function getInitials(name = "") {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function getWrappedDiff(index) {
    const total = reviews.length;
    let diff = (index - currentIndex + total) % total;

    if (diff > total / 2) {
      diff -= total;
    }

    return diff;
  }

  function createReviewCard(review, index) {
    const card = document.createElement("article");

    card.dataset.reviewCard = String(index);
    card.className =
      "absolute left-1/2 top-0 w-full origin-center overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.13)] transition-[opacity,transform,filter] duration-500 ease-out";

    card.innerHTML = `
      <div class="grid gap-5 p-4 sm:p-6 md:grid-cols-[216px_minmax(0,1fr)] md:gap-9">
        <div class="relative h-[300px] overflow-hidden rounded-[6px] bg-gradient-to-br from-slate-100 to-slate-300 md:h-[284px]">
          <img
            src="${review.avatar}"
            alt="${escapeHtml(review.name)}"
            loading="${index === 0 ? "eager" : "lazy"}"
            decoding="async"
            class="h-full w-full object-cover"
          />

          <div
            data-avatar-fallback
            class="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300"
          >
            <span class="flex h-20 w-20 items-center justify-center rounded-full bg-[#0057d8] text-[24px] font-bold text-white">
              ${escapeHtml(getInitials(review.name))}
            </span>
          </div>
        </div>

        <div class="flex min-w-0 flex-col justify-center md:py-1">
          <div class="text-[28px] font-black leading-none text-[#df1633]">
            “
          </div>

          <p class="mt-2 text-[12px] leading-[2.05] text-slate-600 sm:text-[13px]">
            ${escapeHtml(review.text)}
          </p>

          <div class="mt-3 flex items-end justify-between gap-3">
            <div>
              <h3 class="text-[14px] font-extrabold leading-tight text-[#0057d8]">
                ${escapeHtml(review.name)}
              </h3>

              <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                ${escapeHtml(review.role)}
              </p>
            </div>

            <div class="flex shrink-0 items-center gap-2 text-[13px] text-slate-700">
              <span class="text-[14px]">${review.flag}</span>
              <span>${escapeHtml(review.country)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const img = card.querySelector("img");
    const fallback = card.querySelector("[data-avatar-fallback]");

    img?.addEventListener("error", () => {
      img.classList.add("hidden");
      fallback?.classList.remove("hidden");
    });

    return card;
  }

  function createDot(index) {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("aria-label", `Go to review ${index + 1}`);
    dot.className =
      "h-2 w-2 rounded-full bg-slate-400/70 transition-all duration-300 hover:bg-[#df1633]";

    dot.addEventListener("click", () => {
      goToReview(index);
      restartAutoSlide();
    });

    return dot;
  }

  stage.innerHTML = "";
  dotsWrapper.innerHTML = "";

  const cards = reviews.map((review, index) => {
    const card = createReviewCard(review, index);
    stage.appendChild(card);
    return card;
  });

  const dots = reviews.map((_, index) => {
    const dot = createDot(index);
    dotsWrapper.appendChild(dot);
    return dot;
  });

function updateSlider() {
    const isSmallScreen = window.matchMedia("(max-width: 639px)").matches;

    cards.forEach((card, index) => {
      const diff = getWrappedDiff(index);
      const absDiff = Math.abs(diff);

      let opacity = 0;
      let scale = 0.9;
      let x = 0;
      let rotate = 0;
      let zIndex = 0;

      if (absDiff === 0) {
        opacity = 1;
        scale = 1;
        x = 0;
        rotate = 0;
        zIndex = 30;
      } else if (absDiff === 1) {
        opacity = 0.6;
        scale = 0.95;
        x = diff > 0 ? (isSmallScreen ? 12 : 35) : isSmallScreen ? -12 : -35;
        rotate = diff > 0 ? 2 : -2;
        zIndex = 20;
      } else if (absDiff === 2) {
        opacity = 0.25;
        scale = 0.90;
        x = diff > 0 ? (isSmallScreen ? 24 : 65) : isSmallScreen ? -24 : -65;
        rotate = diff > 0 ? 4 : -4;
        zIndex = 10;
      }

      card.style.opacity = String(opacity);
      card.style.zIndex = String(zIndex);
      card.style.pointerEvents = absDiff === 0 ? "auto" : "none";
      // Removed heavy blur filter for better low-end mobile hardware scrolling performance
      card.style.transform = `translateX(calc(-50% + ${x}px)) scale(${scale}) rotate(${rotate}deg)`;

      card.setAttribute("aria-hidden", absDiff === 0 ? "false" : "true");
    });

    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.className = isActive
        ? "h-2 w-5 rounded-full bg-[#df1633] transition-all duration-300"
        : "h-2 w-2 rounded-full bg-slate-400/70 transition-all duration-300 hover:bg-[#df1633]";
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function goToReview(index) {
    currentIndex = (index + reviews.length) % reviews.length;
    updateSlider();
  }

  function nextReview() {
    goToReview(currentIndex + 1);
  }

  function prevReview() {
    goToReview(currentIndex - 1);
  }

  function startAutoSlide() {
    if (prefersReducedMotion) return;

    stopAutoSlide();
    autoTimer = setInterval(nextReview, 5200);
  }

  function stopAutoSlide() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      nextReview();
      restartAutoSlide();
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      prevReview();
      restartAutoSlide();
    });
  });

  stage.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0]?.clientX || 0;
    },
    { passive: true },
  );

  stage.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0]?.clientX || 0;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) < 45) return;

      if (diff > 0) {
        nextReview();
      } else {
        prevReview();
      }

      restartAutoSlide();
    },
    { passive: true },
  );

  root.addEventListener("mouseenter", stopAutoSlide);
  root.addEventListener("mouseleave", startAutoSlide);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });

  window.addEventListener("resize", updateSlider);

  updateSlider();
  startAutoSlide();
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

// function added

function isProductDetailsRoute() {
  return window.location.pathname.startsWith("/products/details/");
}

function mountProductDetailsLayout() {
  if (document.querySelector("#product-details-root")) return;

  document.body.innerHTML = `
    <div
      data-component="/components/navbar.html"
      data-critical="true"
      class="min-h-[102px] lg:min-h-[110px]"
    ></div>

    <main>
      <section id="product-details-root"></section>
    </main>

    <div data-component="/components/footer.html"></div>
  `;
}

function isVideoDetailsRoute() {
  return window.location.pathname.startsWith("/videos/");
}

function mountVideoDetailsLayout() {
  if (document.querySelector("#videosDetailsRoot")) return;

  document.body.innerHTML = `
    <div
      data-component="/components/navbar.html"
      data-critical="true"
      class="min-h-[102px] lg:min-h-[110px]"
    ></div>

    <main>
      <div data-component="/pages/videos-details.html"></div>
    </main>

    <div data-component="/components/footer.html"></div>
  `;
}

// document.addEventListener("DOMContentLoaded", async () => {
//   const isDetailsPage = isProductDetailsRoute();

//   if (isDetailsPage) {
//     mountProductDetailsLayout();
//   }

//   await loadNavbarFirst();

//   await loadOtherComponents();

//   initCurrentYear();

//   if (isDetailsPage) {
//     initProductDetails();
//     return;
//   }

//   initHeroSlider();
//   initTestimonials();
//   initIndustriesSlider();
//   initProductSections();
//   initProjectsSlider();
//   initProjectTypeMultiSelect();
// });

document.addEventListener("DOMContentLoaded", async () => {
  const isProductDetailsPage = isProductDetailsRoute();
  const isVideoDetailsPage = isVideoDetailsRoute();

  if (isProductDetailsPage) {
    mountProductDetailsLayout();
  }

  if (isVideoDetailsPage) {
    mountVideoDetailsLayout();
  }

  // 1) Navbar + Hero first, same time
  await loadCriticalComponents();

  // 2) Above-the-fold init
  renderNavbar();
  initNavbar();
  initSearchDropdown();
  initHeroSlider();

  if (isProductDetailsPage) {
    initProductDetails();

    loadNormalComponentsWhenIdle(() => {
      initCurrentYear();
    });

    return;
  }

  if (isVideoDetailsPage) {
    loadNormalComponentsWhenIdle(() => {
      initCurrentYear();
    });

    return;
  }

  // 3) Below-the-fold components পরে load হবে
  loadNormalComponentsWhenIdle(() => {
    initCurrentYear();
    initTestimonials();
    initIndustriesSlider();
    initProductSections();
    initProjectsSlider();
    initProjectTypeMultiSelect();
  });
});
