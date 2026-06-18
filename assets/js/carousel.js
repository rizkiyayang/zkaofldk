function maxScroll(container) {
  return Math.max(0, Math.ceil(container.scrollWidth - container.clientWidth));
}

export function initCarousel({ container, previous, next, step = 220 }) {
  if (!container || !previous || !next) return () => {};

  const updateButtons = () => {
    const maximum = maxScroll(container);
    const current = Math.ceil(container.scrollLeft);
    const cannotScroll = maximum <= 2;

    previous.classList.toggle("hidden", cannotScroll || current <= 2);
    next.classList.toggle("hidden", cannotScroll || current >= maximum - 2);
  };

  const scroll = (amount) => {
    container.scrollBy({ left: amount, behavior: "smooth" });
    window.setTimeout(updateButtons, 340);
  };

  previous.addEventListener("click", () => scroll(-step));
  next.addEventListener("click", () => scroll(step));
  container.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons, { passive: true });

  container.querySelectorAll("img").forEach((image) => {
    if (!image.complete) image.addEventListener("load", updateButtons, { once: true });
  });

  requestAnimationFrame(updateButtons);
  return updateButtons;
}

export function initTestimonialScroller() {
  const box = document.querySelector(".testimonial");
  const list = document.querySelector(".testimonial-list");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!box || !list || reduceMotion.matches) return;

  const originals = Array.from(list.children);
  if (originals.length < 2) return;

  const shuffled = [...originals].sort(() => Math.random() - 0.5);
  const fragment = document.createDocumentFragment();

  // Tiga set cukup untuk loop dua arah; sebelumnya elemen digandakan berlebihan.
  for (let set = 0; set < 3; set += 1) {
    shuffled.forEach((item) => fragment.appendChild(item.cloneNode(true)));
  }
  list.replaceChildren(fragment);

  let timerId = null;
  let currentScroll = 0;
  let oneSetHeight = 0;

  const measure = () => {
    oneSetHeight = list.scrollHeight / 3;
    currentScroll = oneSetHeight;
    box.scrollTop = currentScroll;
  };

  const normalize = () => {
    if (currentScroll >= oneSetHeight * 2) currentScroll -= oneSetHeight;
    if (currentScroll <= 0) currentScroll += oneSetHeight;
    box.scrollTop = currentScroll;
  };

  const stop = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const start = () => {
    stop();
    if (document.hidden || reduceMotion.matches) return;
    timerId = window.setInterval(() => {
      currentScroll += 0.6;
      normalize();
    }, 22);
  };

  requestAnimationFrame(() => {
    measure();
    start();
  });

  box.addEventListener("mouseenter", () => {
    currentScroll = box.scrollTop;
    stop();
  });
  box.addEventListener("mouseleave", () => {
    currentScroll = box.scrollTop;
    start();
  });
  box.addEventListener(
    "scroll",
    () => {
      currentScroll = box.scrollTop;
      normalize();
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", start);
  reduceMotion.addEventListener?.("change", start);
}
