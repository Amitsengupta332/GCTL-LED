const gctlBlogs = [
  {
    title: "How to Choose the Right Digital Signage Display",
    slug: "how-to-choose-the-right-led-display",
    category: "Guide",
    date: "May 10, 2026",
    readTime: "5 min read",
    image: "/images/blog/a_wide_modern_tech_showroom_lobby_scene_overal.avif",
    excerpt:
      "Key factors to consider before investing in your next display solution.",
    content: [
      "Choosing the right digital signage display depends on your business goal, installation location, viewing distance and content type.",
      "For indoor use, you may need a high-resolution LED display, LCD video wall or interactive signage depending on the environment. For outdoor use, brightness, waterproof protection and strong cabinet quality are very important.",
      "Before buying, consider screen size, pixel pitch, brightness level, refresh rate, installation structure, maintenance access and long-term service support.",
      "A professional LED display solution should not only look attractive, but also perform reliably for daily business communication, advertising and brand visibility.",
    ],
  },
  {
    title: "Top 5 Digital Signage Trends in 2026",
    slug: "top-digital-signage-trends",
    category: "Trends",
    date: "May 22, 2026",
    readTime: "4 min read",
    image: "/images/blog/futuristic_tech_showroom_with_digital_displays.avif",
    excerpt: "Stay ahead with the latest trends shaping the display industry.",
    content: [
      "Digital signage is becoming smarter, brighter and more interactive. Businesses are using LED displays not only for advertising, but also for customer engagement and brand experience.",
      "In 2026, the most important trends include high-resolution LED walls, interactive touch displays, cloud-based content management, 3D anamorphic LED billboards and energy-efficient display systems.",
      "Retail stores, corporate offices, hospitals, showrooms, restaurants and public spaces are using signage to improve communication and customer attention.",
      "The future of digital signage is about flexible content, better visuals and easier remote control.",
    ],
  },
  {
    title: "How Retailers Boost Sales with Digital Signage",
    slug: "retail-sales-with-digital-signage",
    category: "Case Study",
    date: "Apr 18, 2026",
    readTime: "6 min read",
    image: "/images/blog/modern_boutique_with_digital_displays.avif",
    excerpt: "Real-world success stories and measurable retail display results.",
    content: [
      "Retail businesses use digital signage to promote offers, highlight products and create a more premium shopping experience.",
      "A well-placed LED display can attract attention from outside the store and influence buying decisions inside the store.",
      "Retail signage can show product videos, promotional banners, seasonal campaigns, menu boards, price updates and brand messages.",
      "When combined with the right content strategy, digital signage helps retailers increase visibility, improve customer engagement and support sales growth.",
    ],
  },
];

function getBlogLink(blog) {
  return `/blogs/${blog.slug}`;
}

function blogCard(blog) {
  const blogLink = getBlogLink(blog);

  return `
    <article class="group overflow-hidden rounded-[14px] bg-white shadow-[0_12px_35px_rgba(7,31,77,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(7,31,77,0.14)]">
      <a href="${blogLink}" class="block overflow-hidden bg-[#eaf2fb]">
        <img
          src="${blog.image}"
          alt="${blog.title}"
          loading="lazy"
          class="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </a>

      <div class="p-6">
        <span class="inline-flex rounded-[4px] bg-[#e9f4ff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#0068d9]">
          ${blog.category}
        </span>

        <h3 class="mt-4 min-h-[58px] text-[20px] font-black leading-[1.25] tracking-[-0.4px] text-[#071f4d]">
          <a href="${blogLink}" class="transition hover:text-[#0068d9]">
            ${blog.title}
          </a>
        </h3>

        <p class="mt-4 min-h-[54px] text-[14px] font-semibold leading-7 text-[#52657d]">
          ${blog.excerpt}
        </p>

        <div class="mt-5 flex items-center gap-3 text-[12px] font-bold text-[#6d7d8f]">
          <span>${blog.date}</span>
          <span>•</span>
          <span>${blog.readTime}</span>
        </div>

        <a
          href="${blogLink}"
          class="mt-5 inline-flex items-center gap-2 text-[13px] font-black text-[#0068d9] transition hover:gap-3"
        >
          Read More
          <span>→</span>
        </a>
      </div>
    </article>
  `;
}

function initBlogsPage() {
  const grid = document.getElementById("blogsGrid");
  const countText = document.getElementById("blogsCount");

  if (!grid || !countText) return;

  grid.innerHTML = gctlBlogs.map(blogCard).join("");
  countText.textContent = `Showing all ${gctlBlogs.length} blogs`;
}

function waitForBlogsPage() {
  if (document.getElementById("blogsGrid")) {
    initBlogsPage();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById("blogsGrid")) {
      observer.disconnect();
      initBlogsPage();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function getBlogSlugFromUrl() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const blogsIndex = parts.indexOf("blogs");

  if (blogsIndex === -1) return "";
  return parts[blogsIndex + 1] || "";
}

function findBlogBySlug(slug) {
  return gctlBlogs.find((blog) => blog.slug === slug);
}

function getRelatedBlogs(currentBlog) {
  return gctlBlogs.filter((blog) => blog.slug !== currentBlog.slug).slice(0, 3);
}

function renderBlogNotFound(root) {
  root.innerHTML = `
    <div class="mx-auto max-w-[1320px] px-4 py-20 text-center sm:px-6 lg:px-8">
      <div class="mx-auto max-w-[650px] rounded-[18px] bg-white p-10 shadow-[0_18px_55px_rgba(7,31,77,0.10)]">
        <p class="text-[13px] font-black uppercase tracking-[0.22em] text-[#0068d9]">
          Blog Not Found
        </p>

        <h1 class="mt-4 text-[34px] font-black tracking-[-1px] text-[#071f4d]">
          Sorry, this blog could not be found.
        </h1>

        <p class="mt-4 text-[15px] font-semibold leading-7 text-[#52657d]">
          The blog link may be wrong or the blog data may have been changed.
        </p>

        <a
          href="/blogs.html"
          class="mt-8 inline-flex h-12 items-center justify-center rounded-[8px] bg-[#0068d9] px-7 text-[13px] font-black text-white shadow-[0_10px_24px_rgba(0,104,217,0.22)] transition hover:bg-[#0058ba]"
        >
          Back to All Blogs
        </a>
      </div>
    </div>
  `;
}

function renderBlogDetails(root, blog) {
  const relatedBlogs = getRelatedBlogs(blog);

  root.innerHTML = `
    <section class="bg-[#f7fbff] text-[#071f4d]">
      <div class="relative overflow-hidden bg-[#071f4d]">
        <img
          src="${blog.image}"
          alt="${blog.title}"
          class="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div class="absolute inset-0 bg-gradient-to-r from-[#071f4d] via-[#071f4d]/90 to-[#071f4d]/50"></div>

        <div class="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div class="flex min-h-[390px] items-center py-14">
            <div class="max-w-[850px]">
              <div class="mb-5 flex flex-wrap items-center gap-3 text-[13px] font-semibold text-white/75">
                <a href="/index.html" class="hover:text-white">Home</a>
                <span class="text-white/45">›</span>
                <a href="/blogs.html" class="hover:text-white">Blogs</a>
                <span class="text-white/45">›</span>
                <span class="text-white">Details</span>
              </div>

              <a
                href="/blogs.html"
                class="mb-5 inline-flex h-11 items-center justify-center rounded-[8px] bg-white px-5 text-[13px] font-black text-[#0068d9] transition hover:bg-[#eef6ff]"
              >
                ← View All Blogs
              </a>

              <div>
                <span class="inline-flex rounded-[5px] bg-[#0068d9] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white">
                  ${blog.category}
                </span>
              </div>

              <h1 class="mt-5 max-w-[850px] text-[34px] font-black leading-[1.1] tracking-[-1.2px] text-white sm:text-[46px] lg:text-[52px]">
                ${blog.title}
              </h1>

              <div class="mt-5 flex items-center gap-3 text-[14px] font-bold text-white/85">
                <span>${blog.date}</span>
                <span>•</span>
                <span>${blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div class="grid gap-8 lg:grid-cols-[1fr_360px]">
          <article class="overflow-hidden rounded-[18px] bg-white shadow-[0_18px_55px_rgba(7,31,77,0.08)]">
            <img
              src="${blog.image}"
              alt="${blog.title}"
              class="h-[280px] w-full object-cover sm:h-[440px]"
            />

            <div class="p-7 sm:p-10">
              <p class="text-[12px] font-black uppercase tracking-[0.22em] text-[#0068d9]">
                Blog Details
              </p>

              <h2 class="mt-3 text-[30px] font-black leading-tight tracking-[-0.8px] text-[#071f4d]">
                ${blog.title}
              </h2>

              <div class="mt-4 flex flex-wrap items-center gap-3 text-[13px] font-bold text-[#697b90]">
                <span>${blog.category}</span>
                <span>•</span>
                <span>${blog.date}</span>
                <span>•</span>
                <span>${blog.readTime}</span>
              </div>

              <div class="mt-8 space-y-5">
                ${blog.content
                  .map(
                    (paragraph) => `
                      <p class="text-[16px] font-semibold leading-8 text-[#52657d]">
                        ${paragraph}
                      </p>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </article>

          <aside class="space-y-6">
            <div class="rounded-[18px] bg-white p-7 shadow-[0_18px_55px_rgba(7,31,77,0.08)]">
              <h3 class="text-[22px] font-black tracking-[-0.4px] text-[#071f4d]">
                View All Blogs
              </h3>

              <p class="mt-3 text-[14px] font-semibold leading-7 text-[#52657d]">
                Browse all guides, news and insights about LED display solutions.
              </p>

              <a
                href="/blogs.html"
                class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#0068d9] px-6 text-[13px] font-black text-white transition hover:bg-[#0058ba]"
              >
                View All Blogs →
              </a>
            </div>

            <div class="rounded-[18px] bg-gradient-to-br from-[#0068d9] to-[#071f4d] p-7 text-white shadow-[0_18px_55px_rgba(0,104,217,0.20)]">
              <h3 class="text-[24px] font-black tracking-[-0.5px]">
                Need LED Display Solution?
              </h3>

              <p class="mt-3 text-[14px] font-semibold leading-7 text-white/82">
                Talk with our experts for LED display, video wall, billboard and digital signage projects.
              </p>

              <a
                href="/contact.html"
                class="mt-6 inline-flex h-12 items-center justify-center rounded-[8px] bg-white px-6 text-[13px] font-black text-[#0068d9] transition hover:bg-[#eef6ff]"
              >
                Contact Our Experts →
              </a>
            </div>
          </aside>
        </div>

        <div class="mt-14">
          <div class="mb-7 flex items-end justify-between gap-4">
            <div>
              <p class="text-[12px] font-black uppercase tracking-[0.22em] text-[#0068d9]">
                More Insights
              </p>
              <h2 class="mt-3 text-[30px] font-black tracking-[-0.8px] text-[#071f4d]">
                Related Blogs
              </h2>
            </div>

            <a
              href="/blogs.html"
              class="hidden text-[13px] font-black text-[#0068d9] transition hover:text-[#0058ba] sm:inline-flex"
            >
              View All Blogs →
            </a>
          </div>

          <div class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            ${relatedBlogs.map(blogCard).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function initBlogsDetailsPage() {
  const root = document.getElementById("blogsDetailsRoot");
  if (!root) return;

  const slug = getBlogSlugFromUrl();
  const blog = findBlogBySlug(slug);

  if (!blog) {
    renderBlogNotFound(root);
    return;
  }

  document.title = `${blog.title} - GCTL LED`;
  renderBlogDetails(root, blog);
}

function waitForBlogsDetailsPage() {
  if (document.getElementById("blogsDetailsRoot")) {
    initBlogsDetailsPage();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById("blogsDetailsRoot")) {
      observer.disconnect();
      initBlogsDetailsPage();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

waitForBlogsPage();
waitForBlogsDetailsPage();