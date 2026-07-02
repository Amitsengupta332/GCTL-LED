const gctlVideos = [
  {
    title: "Indoor LED Display Solution Showcase",
    slug: "indoor-led-display-solution-showcase",
    category: "LED Display",
    date: "Jun 20, 2026",
    uploadDate: "2026-06-20",
    duration: "2:35",
    durationISO: "PT2M35S",
    image:
      "/images/video/thumbs/futuristic_tech_showroom_with_digital_displays.avif",
    excerpt:
      "Explore indoor LED display visuals for showroom, retail and corporate environments.",
    seoDescription:
      "Watch GCTL LED indoor LED display solution showcase for showrooms, retail stores, corporate lobbies, meeting rooms and commercial display projects.",
    youtubeId: "IHWKd7tThYU",
    videoUrl: "",
    content: [
      "This video showcases how indoor LED display solutions can improve brand presentation, customer engagement and visual communication.",
      "Indoor LED screens are commonly used in showrooms, retail stores, corporate lobbies, meeting rooms and commercial spaces.",
      "A professional indoor LED setup should deliver bright visuals, smooth playback, accurate color and stable long-term performance.",
      "GCTL LED helps businesses choose suitable screen size, pixel pitch, installation style and display configuration based on project requirements.",
    ],
  },
  {
    title: "Digital Signage for Retail Stores",
    slug: "digital-signage-for-retail-stores",
    category: "Digital Signage",
    date: "Jun 18, 2026",
    uploadDate: "2026-06-18",
    duration: "1:58",
    durationISO: "PT1M58S",
    image: "/images/video/thumbs/modern_boutique_with_digital_displays.avif",
    excerpt:
      "See how digital signage helps retail stores promote offers, products and brand campaigns.",
    seoDescription:
      "Watch GCTL LED digital signage video for retail stores, shopping malls, showrooms, supermarkets and commercial promotion displays.",
    youtubeId: "EqA5-EkqUm8",
    videoUrl: "",
    content: [
      "Retail digital signage helps businesses display offers, product videos, seasonal campaigns and promotional messages in a more attractive way.",
      "Compared with printed posters, digital signage is easier to update and more eye-catching for customers.",
      "This type of display works well for boutiques, malls, supermarkets, showrooms and premium retail environments.",
      "GCTL LED digital signage solutions can support product promotion, brand communication, customer engagement and in-store advertising.",
    ],
  },
  {
    title: "LCD Video Wall for Control Rooms",
    slug: "lcd-video-wall-for-control-rooms",
    category: "LCD Video Wall",
    date: "Jun 15, 2026",
    uploadDate: "2026-06-15",
    duration: "3:10",
    durationISO: "PT3M10S",
    image: "/images/video/thumbs/high_tech_control_room_atmosphere.avif",
    excerpt:
      "A quick look at LCD video wall usage for monitoring, command centers and control rooms.",
    seoDescription:
      "Watch GCTL LED LCD video wall showcase for control rooms, security monitoring centers, command centers and operation rooms.",
    youtubeId: "ZkGwwWalv9Q",
    videoUrl: "",
    content: [
      "LCD video walls are widely used in control rooms, security monitoring centers and command centers.",
      "They allow multiple data sources, camera feeds and dashboards to be shown on one large visual surface.",
      "A proper video wall setup should include quality panels, controller support, strong mounting and easy maintenance access.",
      "GCTL LED helps organizations plan video wall layouts for monitoring, surveillance, operation control and professional visual management.",
    ],
  },
  {
    title: "Outdoor LED Billboard Advertising Display",
    slug: "outdoor-led-billboard-advertising-display",
    category: "Advertising Billboard",
    date: "Jun 12, 2026",
    uploadDate: "2026-06-12",
    duration: "2:42",
    durationISO: "PT2M42S",
    image: "/images/video/thumbs/urban_nightscape_with_glowing_billboard.avif",
    excerpt:
      "Watch how outdoor LED billboards create high-impact brand visibility in city locations.",
    seoDescription:
      "Watch GCTL LED outdoor billboard advertising display video for roadsides, rooftops, shopping areas and high-visibility city advertising locations.",
    youtubeId: "JswTCA6WD3k",
    videoUrl: "",
    content: [
      "Outdoor LED billboards are designed for high visibility in roads, rooftops, shopping areas and city advertising zones.",
      "Brightness, waterproof protection, cabinet durability and viewing distance are important for outdoor billboard performance.",
      "A well-planned LED billboard can help brands reach a large audience with continuous visual impact.",
      "GCTL LED outdoor display solutions are suitable for commercial advertising, brand campaigns, public messaging and large-format digital promotion.",
    ],
  },
  {
    title: "Outdoor LED Billboard Installation Process",
    slug: "outdoor-led-billboard-installation-process",
    category: "Advertising Billboard",
    date: "Jun 10, 2026",
    uploadDate: "2026-06-10",
    duration: "3:20",
    durationISO: "PT3M20S",
    image:
      "/images/video/thumbs/outdoor_led_billboard_installation_process.avif",
    excerpt:
      "See the basic installation process for outdoor LED billboard display projects.",
    seoDescription:
      "Watch outdoor LED billboard installation process video for large-format advertising displays, modular structure planning and commercial billboard setup.",
    youtubeId: "S17GKspZMPs",
    videoUrl: "",
    content: [
      "Outdoor LED billboard installation requires proper structure planning, cabinet alignment, power connection and signal configuration.",
      "A strong installation setup helps improve display stability, service access and long-term outdoor performance.",
      "For commercial advertising projects, planning the viewing distance, screen size and brightness level is very important.",
      "GCTL LED can support businesses with outdoor LED billboard planning, product selection, installation guidance and technical consultation.",
    ],
  },
  {
    title: "Transparent LED Display Solution Showcase",
    slug: "transparent-led-display-solution-showcase",
    category: "LED Display",
    date: "Jun 08, 2026",
    uploadDate: "2026-06-08",
    duration: "2:25",
    durationISO: "PT2M25S",
    image:
      "/images/video/thumbs/transparent_led_display_solution_showcase.avif",
    excerpt:
      "Explore transparent LED display solutions for glass walls, retail fronts and premium commercial spaces.",
    seoDescription:
      "Watch transparent LED display solution video for glass wall digital signage, retail storefronts, showroom displays and premium commercial environments.",
    youtubeId: "uh4Kis0q4mU",
    videoUrl: "",
    content: [
      "Transparent LED displays are useful for glass walls, retail windows, showrooms and modern commercial environments.",
      "They help businesses present digital content while keeping visibility through the glass surface.",
      "This display type can create a premium visual effect for product promotion, brand campaigns and architectural display projects.",
      "GCTL LED can help plan transparent LED display projects based on glass size, viewing distance, brightness needs and installation style.",
    ],
  },
];

const VIDEOS_ALL_CATEGORY = "All Videos";
let activeVideoCategory = VIDEOS_ALL_CATEGORY;

function getOnlyVideoCategories() {
  return [...new Set(gctlVideos.map((video) => video.category))];
}

function getVideoCategories() {
  return [VIDEOS_ALL_CATEGORY, ...getOnlyVideoCategories()];
}

function getVideoLink(video) {
  return `/videos/${video.slug}`;
}

function getAbsoluteUrl(path = "") {
  return new URL(path, window.location.origin).href;
}

function setMetaAttribute(attributeName, attributeValue, content) {
  if (!content) return;

  let meta = document.head.querySelector(
    `meta[${attributeName}="${attributeValue}"]`,
  );

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

function setJsonLd(id, data) {
  let script = document.getElementById(id);

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

function updateVideoDetailsSeo(video) {
  const pageUrl = getAbsoluteUrl(`/videos/${video.slug}`);
  const title = `${video.title} | GCTL LED Video`;
  const description = video.seoDescription || video.excerpt;
  const thumbnailUrl = getAbsoluteUrl(video.image);

  document.title = title;

  setMetaAttribute("name", "description", description);
  setCanonical(pageUrl);

  setMetaAttribute("property", "og:type", "video.other");
  setMetaAttribute("property", "og:title", title);
  setMetaAttribute("property", "og:description", description);
  setMetaAttribute("property", "og:image", thumbnailUrl);
  setMetaAttribute("property", "og:url", pageUrl);

  setMetaAttribute("name", "twitter:card", "summary_large_image");
  setMetaAttribute("name", "twitter:title", title);
  setMetaAttribute("name", "twitter:description", description);
  setMetaAttribute("name", "twitter:image", thumbnailUrl);

  setJsonLd("video-details-schema", {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: video.uploadDate,
    duration: video.durationISO,
    embedUrl: video.youtubeId
      ? `https://www.youtube.com/embed/${video.youtubeId}`
      : undefined,
    contentUrl: video.videoUrl ? getAbsoluteUrl(video.videoUrl) : undefined,
    mainEntityOfPage: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "GCTL LED",
    },
  });

  setJsonLd("video-breadcrumb-schema", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: getAbsoluteUrl("/index.html"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Videos",
        item: getAbsoluteUrl("/videos.html"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: video.title,
        item: pageUrl,
      },
    ],
  });
}

function videoCard(video) {
  const videoLink = getVideoLink(video);

  return `
    <article class="group overflow-hidden rounded-[14px] bg-white shadow-[0_12px_35px_rgba(7,31,77,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(7,31,77,0.14)]">
      <a href="${videoLink}" class="relative block overflow-hidden bg-[#eaf2fb]">
        <img
          src="${video.image}"
          alt="${video.title}"
          loading="lazy"
          class="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span class="absolute inset-0 bg-gradient-to-t from-[#071f4d]/65 via-transparent to-transparent"></span>

        <span class="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[20px] font-black text-[#0068d9] shadow-[0_12px_32px_rgba(7,31,77,0.22)] transition duration-300 group-hover:scale-110">
          ▶
        </span>

        <span class="absolute bottom-4 right-4 rounded-full bg-[#071f4d]/90 px-3 py-1 text-[11px] font-black text-white">
          ${video.duration}
        </span>
      </a>

      <div class="p-6">
        <span class="inline-flex rounded-[4px] bg-[#e9f4ff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#0068d9]">
          ${video.category}
        </span>

        <h3 class="mt-4 min-h-[58px] text-[20px] font-black leading-[1.25] tracking-[-0.4px] text-[#071f4d]">
          <a href="${videoLink}" class="transition hover:text-[#0068d9]">
            ${video.title}
          </a>
        </h3>

        <p class="mt-4 min-h-[54px] text-[14px] font-semibold leading-7 text-[#52657d]">
          ${video.excerpt}
        </p>

        <div class="mt-5 flex items-center gap-3 text-[12px] font-bold text-[#6d7d8f]">
          <span>${video.date}</span>
          <span>•</span>
          <span>${video.duration}</span>
        </div>

        <a
          href="${videoLink}"
          class="mt-5 inline-flex items-center gap-2 text-[13px] font-black text-[#0068d9] transition hover:gap-3"
        >
          Watch Video
          <span>→</span>
        </a>
      </div>
    </article>
  `;
}

function homeVideoCard(video) {
  const videoLink = getVideoLink(video);

  return `
    <a
      href="${videoLink}"
      class="group relative min-h-[220px] overflow-hidden rounded-[12px] border border-[#dbe8f5] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#1677ff]/70 hover:shadow-[0_18px_45px_rgba(22,119,255,0.12)]">
      <img
        src="${video.image}"
        alt="${video.title}"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />

      <div class="absolute inset-0 bg-gradient-to-r from-[#06213e]/90 via-[#0d4d8a]/45 to-[#ffffff]/10"></div>

      <span class="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-[17px] font-black text-[#0068d9] shadow-[0_10px_28px_rgba(7,31,77,0.22)]">
        ▶
      </span>

      <div class="relative z-10 flex min-h-[220px] max-w-[72%] flex-col justify-between p-6">
        <div>
          <span class="mb-4 inline-flex rounded bg-[#0057d8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
            ${video.category}
          </span>

          <h3 class="text-[19px] font-semibold leading-snug text-white">
            ${video.title}
          </h3>

          <p class="mt-3 text-[13px] leading-6 text-[#d8e8f7]">
            ${video.excerpt}
          </p>
        </div>

        <div class="mt-5 flex items-center gap-3 text-[12px] text-[#d0e2f2]">
          <span>${video.date}</span>
          <span>•</span>
          <span>${video.duration}</span>
        </div>
      </div>
    </a>
  `;
}

function videoCategoryButton(category) {
  const isActive = category === activeVideoCategory;

  return `
    <button
      type="button"
      data-video-category="${category}"
      class="shrink-0 rounded-[8px] px-5 py-3 text-[13px] font-black transition ${
        isActive
          ? "bg-[#0068d9] text-white shadow-[0_10px_24px_rgba(0,104,217,0.20)]"
          : "bg-transparent text-[#071f4d] hover:bg-[#eef6ff] hover:text-[#0068d9]"
      }"
    >
      ${category === VIDEOS_ALL_CATEGORY ? "☰ All Videos" : category}
    </button>
  `;
}

function initVideoCategorySliderButtons() {
  const categoriesWrapper = document.getElementById("videosCategories");
  const prevBtn = document.getElementById("videosCategoryPrev");
  const nextBtn = document.getElementById("videosCategoryNext");

  if (!categoriesWrapper || !prevBtn || !nextBtn) return;
  if (categoriesWrapper.dataset.sliderReady === "true") return;

  categoriesWrapper.dataset.sliderReady = "true";

  prevBtn.addEventListener("click", () => {
    categoriesWrapper.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    categoriesWrapper.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  });
}

function getFilteredVideos() {
  if (activeVideoCategory === VIDEOS_ALL_CATEGORY) return gctlVideos;

  return gctlVideos.filter((video) => video.category === activeVideoCategory);
}

function renderVideoCategories() {
  const categoriesWrapper = document.getElementById("videosCategories");
  if (!categoriesWrapper) return;

  categoriesWrapper.innerHTML = getVideoCategories()
    .map(videoCategoryButton)
    .join("");

  const buttons = categoriesWrapper.querySelectorAll("[data-video-category]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeVideoCategory = button.getAttribute("data-video-category");

      const url = new URL(window.location.href);

      if (activeVideoCategory === VIDEOS_ALL_CATEGORY) {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", activeVideoCategory);
      }

      window.history.replaceState({}, "", url);

      renderVideoCategories();
      renderVideosGrid();
    });
  });
}

function renderVideosGrid() {
  const grid = document.getElementById("videosGrid");
  const countText = document.getElementById("videosCount");

  if (!grid || !countText) return;

  const filteredVideos = getFilteredVideos();

  grid.innerHTML = filteredVideos.map(videoCard).join("");

  if (activeVideoCategory === VIDEOS_ALL_CATEGORY) {
    countText.textContent = `Showing all ${gctlVideos.length} videos`;
  } else {
    countText.textContent = `Showing ${filteredVideos.length} video in ${activeVideoCategory}`;
  }
}

function initVideosPage() {
  const grid = document.getElementById("videosGrid");
  const countText = document.getElementById("videosCount");

  if (!grid || !countText) return;

  const params = new URLSearchParams(window.location.search);
  const categoryFromUrl = params.get("category");

  if (categoryFromUrl && getOnlyVideoCategories().includes(categoryFromUrl)) {
    activeVideoCategory = categoryFromUrl;
  } else {
    activeVideoCategory = VIDEOS_ALL_CATEGORY;
  }

  renderVideoCategories();
  renderVideosGrid();
  initVideoCategorySliderButtons();
}

function waitForVideosPage() {
  if (document.getElementById("videosGrid")) {
    initVideosPage();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById("videosGrid")) {
      observer.disconnect();
      initVideosPage();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function renderHomeVideosSection() {
  const grid = document.getElementById("homeVideosGrid");
  if (!grid) return;

  grid.innerHTML = gctlVideos.slice(0, 3).map(homeVideoCard).join("");
}

function waitForHomeVideosSection() {
  if (document.getElementById("homeVideosGrid")) {
    renderHomeVideosSection();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById("homeVideosGrid")) {
      observer.disconnect();
      renderHomeVideosSection();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function getVideoSlugFromUrl() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const videosIndex = parts.indexOf("videos");

  if (videosIndex === -1) return "";
  return parts[videosIndex + 1] || "";
}

function findVideoBySlug(slug) {
  return gctlVideos.find((video) => video.slug === slug);
}

function getRelatedVideos(currentVideo) {
  const sameCategoryVideos = gctlVideos.filter(
    (video) =>
      video.slug !== currentVideo.slug &&
      video.category === currentVideo.category,
  );

  const otherVideos = gctlVideos.filter(
    (video) =>
      video.slug !== currentVideo.slug &&
      video.category !== currentVideo.category,
  );

  return [...sameCategoryVideos, ...otherVideos].slice(0, 3);
}

function videoCategoriesSidebar(currentCategory) {
  return `
    <div class="rounded-[18px] bg-white p-7 shadow-[0_18px_55px_rgba(7,31,77,0.08)]">
      <h3 class="text-[22px] font-black tracking-[-0.4px] text-[#071f4d]">
        Video Categories
      </h3>

      <div class="mt-5 divide-y divide-[#e4edf8]">
        ${getOnlyVideoCategories()
          .map(
            (category) => `
              <a
                href="/videos.html?category=${encodeURIComponent(category)}"
                class="flex items-center justify-between py-3 text-[13px] font-bold transition ${
                  category === currentCategory
                    ? "text-[#0068d9]"
                    : "text-[#40556d] hover:text-[#0068d9]"
                }"
              >
                <span>${category}</span>
                <span class="text-[#9aaabd]">›</span>
              </a>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function videoEmbed(video) {
  if (video.youtubeId) {
    return `
      <div class="aspect-video w-full overflow-hidden bg-[#071f4d]">
        <iframe
          src="https://www.youtube.com/embed/${video.youtubeId}"
          title="${video.title}"
          class="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    `;
  }

  if (video.videoUrl) {
    return `
      <video
        src="${video.videoUrl}"
        poster="${video.image}"
        controls
        playsinline
        preload="metadata"
        class="aspect-video w-full bg-[#071f4d] object-cover"
      ></video>
    `;
  }

  return `
    <div class="relative aspect-video w-full overflow-hidden bg-[#071f4d]">
      <img
        src="${video.image}"
        alt="${video.title}"
        class="h-full w-full object-cover opacity-60"
      />

      <div class="absolute inset-0 grid place-items-center text-center">
        <div class="rounded-[14px] bg-white px-6 py-4 shadow-xl">
          <p class="text-[13px] font-black text-[#071f4d]">
            Video source missing
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderVideoNotFound(root) {
  root.innerHTML = `
    <div class="mx-auto max-w-[1320px] px-4 py-20 text-center sm:px-6 lg:px-8">
      <div class="mx-auto max-w-[650px] rounded-[18px] bg-white p-10 shadow-[0_18px_55px_rgba(7,31,77,0.10)]">
        <p class="text-[13px] font-black uppercase tracking-[0.22em] text-[#0068d9]">
          Video Not Found
        </p>

        <h1 class="mt-4 text-[34px] font-black tracking-[-1px] text-[#071f4d]">
          Sorry, this video could not be found.
        </h1>

        <p class="mt-4 text-[15px] font-semibold leading-7 text-[#52657d]">
          The video link may be wrong or the video data may have been changed.
        </p>

        <a
          href="/videos.html"
          class="mt-8 inline-flex h-12 items-center justify-center rounded-[8px] bg-[#0068d9] px-7 text-[13px] font-black text-white shadow-[0_10px_24px_rgba(0,104,217,0.22)] transition hover:bg-[#0058ba]"
        >
          Back to All Videos
        </a>
      </div>
    </div>
  `;
}

function renderVideoDetails(root, video) {
  const relatedVideos = getRelatedVideos(video);

  root.innerHTML = `
    <section class="bg-[#f7fbff] text-[#071f4d]">
      <div class="relative overflow-hidden bg-[#071f4d]">
        <img
          src="${video.image}"
          alt="${video.title}"
          class="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div class="absolute inset-0 bg-gradient-to-r from-[#071f4d] via-[#071f4d]/90 to-[#071f4d]/50"></div>

        <div class="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div class="flex min-h-[390px] items-center py-14">
            <div class="max-w-[850px]">
              <div class="mb-5 flex flex-wrap items-center gap-3 text-[13px] font-semibold text-white/75">
                <a href="/index.html" class="hover:text-white">Home</a>
                <span class="text-white/45">›</span>
                <a href="/videos.html" class="hover:text-white">Videos</a>
                <span class="text-white/45">›</span>
                <span class="text-white">Details</span>
              </div>

              <a
                href="/videos.html"
                class="mb-5 inline-flex h-11 items-center justify-center rounded-[8px] bg-white px-5 text-[13px] font-black text-[#0068d9] transition hover:bg-[#eef6ff]"
              >
                ← View All Videos
              </a>

              <div>
                <span class="inline-flex rounded-[5px] bg-[#0068d9] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white">
                  ${video.category}
                </span>
              </div>

              <h1 class="mt-5 max-w-[850px] text-[34px] font-black leading-[1.1] tracking-[-1.2px] text-white sm:text-[46px] lg:text-[52px]">
                ${video.title}
              </h1>

              <div class="mt-5 flex w-full max-w-[520px] flex-wrap items-center gap-4 rounded-full bg-white px-4 py-3 shadow-[0_10px_34px_rgba(7,31,77,0.08)] ring-1 ring-[#edf3fb]">
                <span class="grid h-11 w-11 place-items-center rounded-full bg-[#e8f3ff] text-[16px] font-black text-[#0068d9]">
                  ▶
                </span>

                <span>
                  <span class="block text-[13px] font-black text-[#111111]">
                    GCTL LED Video
                  </span>

                  <span class="mt-0.5 block text-[12px] font-semibold text-[#697b90]">
                    ${video.date}
                  </span>
                </span>

                <span class="ml-auto whitespace-nowrap text-[13px] font-black text-[#111111]">
                  ${video.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div class="grid gap-8 lg:grid-cols-[1fr_360px]">
          <article class="overflow-hidden rounded-[18px] bg-white shadow-[0_18px_55px_rgba(7,31,77,0.08)]">
            ${videoEmbed(video)}

            <div class="p-7 sm:p-10">
              <div class="flex flex-wrap items-center gap-3 text-[12px] font-bold text-[#6d7d8f]">
                <span>${video.date}</span>
                <span>•</span>
                <span>${video.duration}</span>
                <span>•</span>
                <span>${video.category}</span>
              </div>

              <h2 class="mt-6 text-[30px] font-black tracking-[-0.8px] text-[#071f4d]">
                Video Overview
              </h2>

              <p class="mt-4 text-[16px] font-semibold leading-8 text-[#52657d]">
                ${video.excerpt}
              </p>

              <div class="mt-8 space-y-5">
                ${(video.content || [])
                  .map(
                    (paragraph) => `
                      <p class="text-[16px] font-semibold leading-8 text-[#52657d]">
                        ${paragraph}
                      </p>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          </article>

          <aside class="space-y-6">
            ${videoCategoriesSidebar(video.category)}

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
                More Videos
              </p>

              <h2 class="mt-3 text-[30px] font-black tracking-[-0.8px] text-[#071f4d]">
                Related Videos
              </h2>
            </div>

            <a
              href="/videos.html"
              class="hidden text-[13px] font-black text-[#0068d9] transition hover:text-[#0058ba] sm:inline-flex"
            >
              View All Videos →
            </a>
          </div>

          <div class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            ${relatedVideos.map(videoCard).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function initVideosDetailsPage() {
  const root = document.getElementById("videosDetailsRoot");
  if (!root) return;

  const slug = getVideoSlugFromUrl();
  const video = findVideoBySlug(slug);

  if (!video) {
    renderVideoNotFound(root);
    return;
  }

  updateVideoDetailsSeo(video);
  renderVideoDetails(root, video);
}

function waitForVideosDetailsPage() {
  if (document.getElementById("videosDetailsRoot")) {
    initVideosDetailsPage();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById("videosDetailsRoot")) {
      observer.disconnect();
      initVideosDetailsPage();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function initVideoSystem() {
  waitForHomeVideosSection();
  waitForVideosPage();
  waitForVideosDetailsPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVideoSystem);
} else {
  initVideoSystem();
}
