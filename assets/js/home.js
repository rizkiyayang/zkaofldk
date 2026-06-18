import { productCollections } from "/data/products.js?v=20260619-history1";
import { agents } from "/data/agents.js?v=20260619-history1";
import { maps } from "/data/maps.js?v=20260619-history1";
import { weapons } from "/data/weapons.js?v=20260619-history1";
import {
  renderAgents,
  renderMaps,
  renderProductCollections,
  renderWeapons,
} from "/assets/js/render.js?v=20260619-history1";
import { initCarousel, initTestimonialScroller } from "/assets/js/carousel.js?v=20260619-history1";
import { initCommonPage } from "/assets/js/common.js?v=20260619-history1";

renderProductCollections(productCollections);
renderAgents(document.getElementById("agentCarousel"), agents);
renderMaps(document.getElementById("mapCarousel"), maps);
renderWeapons(document.getElementById("weaponCarousel"), weapons);
initCommonPage();
initTestimonialScroller();

initCarousel({
  container: document.getElementById("affiliateCarousel"),
  previous: document.getElementById("affiliatePrev"),
  next: document.getElementById("affiliateNext"),
  step: 220,
});

const agentCarousel = document.getElementById("agentCarousel");
const updateAgentButtons = initCarousel({
  container: agentCarousel,
  previous: document.querySelector('.carousel-prev[data-target="agentCarousel"]'),
  next: document.querySelector('.carousel-next[data-target="agentCarousel"]'),
  step: 320,
});

initCarousel({
  container: document.getElementById("mapCarousel"),
  previous: document.querySelector('.carousel-prev[data-target="mapCarousel"]'),
  next: document.querySelector('.carousel-next[data-target="mapCarousel"]'),
  step: 220,
});

initCarousel({
  container: document.getElementById("weaponCarousel"),
  previous: document.querySelector('.carousel-prev[data-target="weaponCarousel"]'),
  next: document.querySelector('.carousel-next[data-target="weaponCarousel"]'),
  step: 220,
});

const roleIcons = document.querySelectorAll(".role-icons img");
roleIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    if (icon.classList.contains("active")) return;
    roleIcons.forEach((item) => item.classList.remove("active"));
    icon.classList.add("active");

    const role = icon.dataset.role;
    document.querySelectorAll(".agent-card").forEach((agent) => {
      const visible = role === "all" || role === agent.dataset.role;
      agent.classList.toggle("hide", !visible);
      agent.classList.toggle("show", visible);
    });

    if (agentCarousel) agentCarousel.scrollLeft = 0;
    requestAnimationFrame(() => requestAnimationFrame(updateAgentButtons));
  });
});
