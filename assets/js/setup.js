import { productCollections } from "/data/products.js?v=20260619-livefix3";
import { renderProductCollections } from "/assets/js/render.js?v=20260619-livefix3";
import { initCarousel } from "/assets/js/carousel.js?v=20260619-livefix3";
import { initCommonPage } from "/assets/js/common.js?v=20260619-livefix3";

renderProductCollections(productCollections);
initCommonPage();

[1, 2, 3, 4, 5].forEach((number) => {
  initCarousel({
    container: document.getElementById(`affiliateCarousel${number}`),
    previous: document.getElementById(`affiliatePrev${number}`),
    next: document.getElementById(`affiliateNext${number}`),
    step: 220,
  });
});
