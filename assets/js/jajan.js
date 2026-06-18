import { jajanCollections } from "/data/jajan-products.js?v=20260619-livefix3";
import { renderProductCollections } from "/assets/js/render.js?v=20260619-livefix3";
import { initCarousel } from "/assets/js/carousel.js?v=20260619-livefix3";
import { initCommonPage } from "/assets/js/common.js?v=20260619-livefix3";

renderProductCollections(jajanCollections);
initCommonPage();

initCarousel({
  container: document.getElementById("jajanCarousel"),
  previous: document.getElementById("jajanPrev"),
  next: document.getElementById("jajanNext"),
  step: 220,
});
