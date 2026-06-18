import { productCollections } from "/data/products.js";
import { renderProductCollections } from "/assets/js/render.js";
import { initCarousel } from "/assets/js/carousel.js";
import { initCommonPage } from "/assets/js/common.js";

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
