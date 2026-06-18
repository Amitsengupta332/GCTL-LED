import "./style.css";
// import "./blogs/blogs-data.js";
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
  } catch (error) {
    console.error(error);
  }
}

async function loadNavbarFirst() {
  const navbarComponent = document.querySelector(
    '[data-component="/components/navbar.html"]',
  );

  if (!navbarComponent) return;

  await loadSingleComponent(navbarComponent);

  renderNavbar();
  initNavbar();
}

async function loadOtherComponents() {
  const components = Array.from(document.querySelectorAll("[data-component]"));

  const otherComponents = components.filter(
    (component) =>
      component.getAttribute("data-component") !== "/components/navbar.html",
  );

  await Promise.all(otherComponents.map(loadSingleComponent));
}

function initNavbar() {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!mobileMenuButton || !mobileMenu) return;

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
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
  const dropdownWidth = item.columns === 3 ? "w-[760px]" : "w-[520px]";
  const gridCols = item.columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return `
    <div class="group relative">
   <button
  type="button"
  class="flex items-center gap-1.5 py-2 transition hover:text-[#0050a8]"
>
  ${item.label}
  ${dropdownChevronIcon()}
</button>

     <div class="invisible absolute left-1/2 top-full ${dropdownWidth} -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
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
      <div class="relative flex h-[86px] items-center justify-center overflow-hidden rounded-lg border border-[#e6eefb] bg-[#f8fbff] p-2">
        ${
          image
            ? `
              <img
                src="${image}"
                alt="${title}"
                class="h-full w-full object-contain"
                onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');"
              />

              <div class="hidden text-center">
                <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-blue-100 bg-white text-[17px] text-[#0050a8]">
                  🖼
                </div>

                <p class="mt-1 text-[9px] font-bold text-[#0050a8]">
                  Image Missing
                </p>
              </div>
            `
            : `
              <div class="text-center">
                <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-blue-100 bg-white text-[17px] text-[#0050a8]">
                  🖼
                </div>

                <p class="mt-1 text-[9px] font-bold text-[#0050a8]">
                  Image Missing
                </p>
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
  class="flex items-center gap-1.5 py-2 transition hover:text-[#0050a8]"
>
  ${item.label}
  ${dropdownChevronIcon()}
</button>

      <div
        data-product-mega-tree
       class="invisible absolute left-1/2 top-full z-50 w-[1120px] max-w-[calc(100vw-32px)] -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
      >
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
          <div class="grid min-h-[430px] grid-cols-[230px_245px_minmax(0,1fr)]">

            <!-- LEFT SIDE CATEGORY -->
            <div class="border-r border-slate-100 bg-white p-3">
              <div class="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Product Category
              </div>

              <div class="max-h-[395px] overflow-y-auto pr-1">
                <div class="flex flex-col gap-1">
                  ${item.categories
                    .map((category, categoryIndex) => {
                      const isMainActive = categoryIndex === 0;

                      return `
                        <div>
                          <button
                            type="button"
                            data-tree-main-btn="${category.id}"
                            class="flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-[12px] font-bold transition ${
                              isMainActive
                                ? "border-[#bdd7ff] bg-[#eef5ff] text-[#0050a8]"
                                : "border-slate-100 bg-white text-slate-800 hover:border-[#bdd7ff] hover:bg-[#f5f9ff]"
                            }"
                          >
                            <span class="flex items-center gap-3">
                              <span class="flex h-7 w-7 items-center justify-center rounded-md bg-[#f1f6ff] text-[13px] text-[#0050a8]">
                                ${category.icon}
                              </span>
                              <span>${category.label}</span>
                            </span>

                            <span class="text-slate-400">›</span>
                          </button>

                          <div
                            data-tree-main-list="${category.id}"
                            class="${isMainActive ? "" : "hidden"} mt-1 space-y-1"
                          >
                            ${category.children
                              .map((sub, subIndex) => {
                                const subKey = `${category.id}__${sub.id}`;
                                const isSubActive =
                                  categoryIndex === 0 && subIndex === 0;

                                return `
                                  <button
                                    type="button"
                                    data-tree-sub-btn="${subKey}"
                                    class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold transition ${
                                      isSubActive
                                        ? "bg-blue-50 text-[#0050a8]"
                                        : "text-slate-600 hover:bg-blue-50 hover:text-[#0050a8]"
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
                      `;
                    })
                    .join("")}
                </div>
              </div>
            </div>

            <!-- MIDDLE GROUP -->
            <div class="border-r border-slate-100 bg-white p-4">
              ${item.categories
                .map((category) =>
                  category.children
                    .map((sub) => {
                      const subKey = `${category.id}__${sub.id}`;
                      const isActiveSub = subKey === firstSubKey;

                      return `
                        <div
                          data-tree-group-list="${subKey}"
                          class="${isActiveSub ? "" : "hidden"}"
                        >
                          <div class="mb-4">
                            <h3 class="text-[13px] font-bold text-slate-900">
                              ${sub.label}
                            </h3>

                            <p class="mt-1 text-[11px] leading-5 text-slate-500">
                              Select product size or display group
                            </p>
                          </div>

                          <div class="max-h-[365px] overflow-y-auto pr-1">
                            <div class="flex flex-col">
                              ${sub.groups
                                .map((group, groupIndex) => {
                                  const groupKey = `${category.id}__${sub.id}__${slugify(
                                    group.title,
                                  )}`;
                                  const isGroupActive =
                                    isActiveSub && groupIndex === 0;

                                  return `
                                    <button
                                      type="button"
                                      data-tree-group-btn="${groupKey}"
                                      class="group/mid flex w-full items-center justify-between border-b border-slate-100 px-2 py-3 text-left transition ${
                                        isGroupActive
                                          ? "border-[#bdd7ff] bg-[#eef5ff] text-[#0050a8]"
                                          : "border-slate-100 bg-white text-slate-700 hover:border-[#bdd7ff] hover:bg-[#f7fbff]"
                                      }"
                                    >
                                      <span>
                                        <span class="block text-[12px] font-bold leading-snug">
                                          ${group.title}
                                        </span>

                                        <span class="mt-1 block text-[10px] font-semibold text-slate-400">
                                          ${group.products.length} Products
                                        </span>
                                      </span>

                                      <span class="ml-2 text-[14px] text-slate-300 group-hover/mid:text-[#0050a8]">
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
                    .join(""),
                )
                .join("")}
            </div>

            <!-- RIGHT PRODUCT AREA -->
            <div class="bg-white p-4">
              ${item.categories
                .map((category) =>
                  category.children
                    .map((sub) =>
                      sub.groups
                        .map((group) => {
                          const groupKey = `${category.id}__${sub.id}__${slugify(
                            group.title,
                          )}`;
                          const isActiveGroup = groupKey === firstGroupKey;

                          return `
                            <div
                              data-tree-product-panel="${groupKey}"
                              class="${isActiveGroup ? "" : "hidden"} flex h-full flex-col"
                            >
                              <div class="mb-3 flex items-start justify-between gap-4">
                                <div>
                                  <h3 class="text-[14px] font-bold leading-snug text-slate-900">
                                    ${group.title}
                                  </h3>

                                  <p class="mt-1 text-[11px] leading-5 text-slate-500">
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
                                      const productTitle =
                                        getProductTitle(product);

                                      return `
                                        <a
                                          href="${createProductHref(sub.href, productTitle)}"
                                          class="group/card rounded-lg border border-slate-100 bg-white p-2 transition hover:border-[#bdd7ff] hover:shadow-md hover:shadow-slate-200/70"
                                        >
                                          ${renderProductImage(product)}

                                          <h4 class="mt-2 h-[32px] overflow-hidden text-[10px] font-bold leading-[16px] text-slate-900 group-hover/card:text-[#0050a8]">
                                            ${productTitle}
                                          </h4>   
                                        </a>
                                      `;
                                    })
                                    .join("")}
                                </div>
                              </div>

                              <!-- QUALITY ROW -->
                              <div class="mt-3 grid grid-cols-4 gap-3 border-t border-slate-100 pt-3">
                                <div class="flex items-center gap-2">
                                  <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] text-[#0050a8]">✓</span>
                                  <div>
                                    <h4 class="text-[10px] font-bold text-slate-900">Premium Quality</h4>
                                    <p class="text-[9px] text-slate-500">Top-tier products</p>
                                  </div>
                                </div>

                                <div class="flex items-center gap-2">
                                  <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] text-[#0050a8]">⚙</span>
                                  <div>
                                    <h4 class="text-[10px] font-bold text-slate-900">Latest Technology</h4>
                                    <p class="text-[9px] text-slate-500">Advanced features</p>
                                  </div>
                                </div>

                                <div class="flex items-center gap-2">
                                  <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] text-[#0050a8]">⚡</span>
                                  <div>
                                    <h4 class="text-[10px] font-bold text-slate-900">Energy Efficient</h4>
                                    <p class="text-[9px] text-slate-500">Lower power use</p>
                                  </div>
                                </div>

                                <div class="flex items-center gap-2">
                                  <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] text-[#0050a8]">☎</span>
                                  <div>
                                    <h4 class="text-[10px] font-bold text-slate-900">Global Support</h4>
                                    <p class="text-[9px] text-slate-500">24/7 assistance</p>
                                  </div>
                                </div>
                              </div>

                              <!-- HELP BANNER -->
                              <div class="mt-auto rounded-xl bg-gradient-to-r from-[#eef6ff] via-[#f8fbff] to-[#eaf3ff] px-4 py-3">
                                <div class="flex items-center justify-between gap-4">
                                  <div>
                                    <h3 class="text-[12px] font-bold text-slate-900">
                                      Need Help Choosing the Right Product?
                                    </h3>

                                    <p class="mt-1 max-w-[440px] text-[10px] leading-4 text-slate-500">
                                      Our experts can help you choose the perfect LED display, kiosk, video wall or digital signage solution.
                                    </p>
                                  </div>

                                  <a
                                    href="/contact.html"
                                    class="shrink-0 rounded-lg bg-[#0050a8] px-4 py-2 text-[10px] font-bold text-white hover:bg-[#003f87]"
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

      return `
        <a href="${item.href}" class="py-2 hover:text-[#0050a8]">
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
          <details class="rounded-xl">
            <summary class="cursor-pointer list-none rounded-xl px-3 py-3 hover:bg-blue-50">
              ${item.label}
            </summary>

            <div class="ml-3 flex flex-col gap-2 border-l border-slate-100 pl-3 text-[13px] text-slate-600">
              ${item.categories
                .map(
                  (category) => `
                    <details class="rounded-lg">
                      <summary class="cursor-pointer list-none rounded-lg py-2 font-bold text-slate-900">
                        ${category.label}
                      </summary>

                      <div class="ml-3 flex flex-col gap-1 border-l border-slate-100 pl-3">
                        ${category.children
                          .map(
                            (sub) => `
                              <details class="rounded-lg">
                                <summary class="cursor-pointer list-none py-2 font-semibold text-slate-700">
                                  ${sub.label}
                                </summary>

                                <div class="ml-3 flex flex-col gap-1 border-l border-slate-100 pl-3">
                                  ${sub.groups
                                    .map(
                                      (group) => `
                                        <details>
                                          <summary class="cursor-pointer list-none py-2 text-[12px] font-semibold text-slate-600">
                                            ${group.title}
                                          </summary>

                                          <div class="ml-3 flex flex-col gap-1 border-l border-slate-100 pl-3">
                                            ${group.products
                                              .map(
                                                (product) => `
                                                  <a
                                                 href="${createProductHref(
                                                   sub.href,
                                                   getProductTitle(product),
                                                 )}"
                                                    class="py-2 text-[12px] hover:text-[#0050a8]"
                                                  >
                                                    ${getProductTitle(product)}
                                                  </a>
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
          <details class="rounded-xl">
            <summary class="cursor-pointer list-none rounded-xl px-3 py-3 hover:bg-blue-50">
              ${item.label}
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
        <a href="${item.href}" class="rounded-xl px-3 py-3 hover:bg-blue-50">
          ${item.label}
        </a>
      `;
    })
    .join("");
}

function initProductMegaTree() {
  const megaMenus = document.querySelectorAll("[data-product-mega-tree]");
  if (!megaMenus.length) return;

  megaMenus.forEach((menu) => {
    const mainButtons = menu.querySelectorAll("[data-tree-main-btn]");
    const mainLists = menu.querySelectorAll("[data-tree-main-list]");
    const subButtons = menu.querySelectorAll("[data-tree-sub-btn]");
    const groupLists = menu.querySelectorAll("[data-tree-group-list]");
    const groupButtons = menu.querySelectorAll("[data-tree-group-btn]");
    const productPanels = menu.querySelectorAll("[data-tree-product-panel]");

    function hideMiddleAndRight() {
      groupLists.forEach((list) => {
        list.classList.add("hidden");
      });

      productPanels.forEach((panel) => {
        panel.classList.add("hidden");
      });

      subButtons.forEach((button) => {
        button.classList.remove("bg-blue-50", "text-[#0050a8]");
        button.classList.add("text-slate-600");
      });

      groupButtons.forEach((button) => {
        button.classList.remove(
          "border-[#bdd7ff]",
          "bg-[#eef5ff]",
          "text-[#0050a8]",
        );

        button.classList.add("border-slate-100", "bg-white", "text-slate-700");
      });
    }

    function closeAllMainLists() {
      mainLists.forEach((list) => {
        list.classList.add("hidden");
      });

      mainButtons.forEach((button) => {
        button.classList.remove(
          "border-[#bdd7ff]",
          "bg-[#eef5ff]",
          "text-[#0050a8]",
        );

        button.classList.add("border-slate-100", "bg-white", "text-slate-800");
      });
    }

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
        button.classList.toggle("text-slate-600", !isActive);
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

    function toggleMain(mainId) {
      const activeMainButton = menu.querySelector(
        `[data-tree-main-btn="${mainId}"]`,
      );

      const activeMainList = menu.querySelector(
        `[data-tree-main-list="${mainId}"]`,
      );

      if (!activeMainButton || !activeMainList) return;

      const isAlreadyOpen = !activeMainList.classList.contains("hidden");

      closeAllMainLists();

      if (isAlreadyOpen) {
        hideMiddleAndRight();
        return;
      }

      activeMainButton.classList.remove(
        "border-slate-100",
        "bg-white",
        "text-slate-800",
      );

      activeMainButton.classList.add(
        "border-[#bdd7ff]",
        "bg-[#eef5ff]",
        "text-[#0050a8]",
      );

      activeMainList.classList.remove("hidden");

      const firstSubButton = activeMainList.querySelector(
        "[data-tree-sub-btn]",
      );

      if (firstSubButton) {
        activateSub(firstSubButton.dataset.treeSubBtn);
      }
    }

    mainButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        toggleMain(button.dataset.treeMainBtn);
      });
    });

    subButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        activateSub(button.dataset.treeSubBtn);
      });
    });

    groupButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

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
        ? "h-2 w-6 rounded-full bg-[#0068c9] transition-all"
        : "h-2 w-2 rounded-full bg-blue-200 transition-all hover:bg-blue-300";

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

// function added

function isProductDetailsRoute() {
  return window.location.pathname.startsWith("/products/details/");
}

function mountProductDetailsLayout() {
  if (document.querySelector("#product-details-root")) return;

  document.body.innerHTML = `
    <div data-component="/components/navbar.html"></div>

    <main>
      <section id="product-details-root"></section>
    </main>

    <div data-component="/components/footer.html"></div>
  `;
}

// document.addEventListener("DOMContentLoaded", async () => {
//   const isDetailsPage = isProductDetailsRoute();

//   if (isDetailsPage) {
//     mountProductDetailsLayout();
//   }

//   await loadComponents();

//   renderNavbar();

//   initNavbar();
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
  const isDetailsPage = isProductDetailsRoute();

  if (isDetailsPage) {
    mountProductDetailsLayout();
  }

  await loadNavbarFirst();

  await loadOtherComponents();

  initCurrentYear();

  if (isDetailsPage) {
    initProductDetails();
    return;
  }

  initHeroSlider();
  initTestimonials();
  initIndustriesSlider();
  initProductSections();
  initProjectsSlider();
  initProjectTypeMultiSelect();
});
