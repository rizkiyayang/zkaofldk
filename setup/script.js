document.querySelectorAll(".links a, .header-icons a").forEach((el) => {
  el.addEventListener("click", function () {
    el.classList.remove("release");
    void el.offsetWidth;
    el.classList.add("release");
  });
});

const avatarWrap = document.querySelector(".avatar-wrap");

if (avatarWrap) {
  setInterval(() => {
    avatarWrap.classList.remove("glitching");
    void avatarWrap.offsetWidth;
    avatarWrap.classList.add("glitching");

    setTimeout(() => {
      avatarWrap.classList.remove("glitching");
    }, 700);
  }, 3000);
}

const donateTrigger = document.querySelector(".donate-trigger");
const donateModal = document.getElementById("donateModal");
const closeDonateModal = document.getElementById("closeDonateModal");

if (donateTrigger && donateModal && closeDonateModal) {
  donateTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    donateModal.classList.add("active");
  });

  closeDonateModal.addEventListener("click", () => {
    donateModal.classList.remove("active");
  });

  donateModal.addEventListener("click", (e) => {
    if (e.target === donateModal) {
      donateModal.classList.remove("active");
    }
  });
}

/* AFFILIATE CAROUSELS */

const affiliateConfigs = [1, 2, 3, 4, 5];

affiliateConfigs.forEach((num) => {
  const affiliateCarousel = document.getElementById(`affiliateCarousel${num}`);

  const affiliatePrev = document.getElementById(`affiliatePrev${num}`);

  const affiliateNext = document.getElementById(`affiliateNext${num}`);

  if (!affiliateCarousel || !affiliatePrev || !affiliateNext) return;

  const affiliateCards = Array.from(affiliateCarousel.children);

  if (num !== 4) {
    for (let i = affiliateCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [affiliateCards[i], affiliateCards[j]] = [
        affiliateCards[j],
        affiliateCards[i],
      ];
    }
  }
  affiliateCarousel.innerHTML = "";

  affiliateCards.forEach((card) => {
    affiliateCarousel.appendChild(card);
  });

  affiliateCarousel.scrollLeft = 0;

  const updateAffiliateButtons = () => {
    const maxScroll = Math.max(
      0,
      Math.ceil(affiliateCarousel.scrollWidth - affiliateCarousel.clientWidth),
    );

    const currentScroll = Math.ceil(affiliateCarousel.scrollLeft);

    const isAtStart = currentScroll <= 2;
    const isAtEnd = currentScroll >= maxScroll - 2;
    const cannotScroll = maxScroll <= 2;

    affiliatePrev.classList.toggle("hidden", cannotScroll || isAtStart);

    affiliateNext.classList.toggle("hidden", cannotScroll || isAtEnd);
  };

  updateAffiliateButtons();

  affiliateCarousel.addEventListener("scroll", updateAffiliateButtons, {
    passive: true,
  });

  affiliatePrev.addEventListener("click", () => {
    affiliateCarousel.scrollBy({
      left: -220,
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      setTimeout(updateAffiliateButtons, 320);
    });
  });

  affiliateNext.addEventListener("click", () => {
    affiliateCarousel.scrollBy({
      left: 220,
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      setTimeout(updateAffiliateButtons, 320);
    });
  });
});
