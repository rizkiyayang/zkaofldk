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

const testimonialBox = document.querySelector(".testimonial");
const testimonialList = document.querySelector(".testimonial-list");

if (testimonialBox && testimonialList) {
  const originalItems = Array.from(testimonialList.children);

  const shuffledItems = [...originalItems].sort(() => Math.random() - 0.5);

  testimonialList.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    shuffledItems.forEach((item) => {
      testimonialList.appendChild(item.cloneNode(true));
    });
  }

  const oneSetHeight = testimonialList.scrollHeight / 3;

  let autoScroll;
  let currentScroll = oneSetHeight;

  testimonialBox.scrollTop = currentScroll;

  const normalizeScroll = () => {
    if (currentScroll >= oneSetHeight * 2) {
      currentScroll -= oneSetHeight;
    }

    if (currentScroll <= 0) {
      currentScroll += oneSetHeight;
    }

    testimonialBox.scrollTop = currentScroll;
  };

  const startAutoScroll = () => {
    clearInterval(autoScroll);

    autoScroll = setInterval(() => {
      currentScroll += 0.6;

      normalizeScroll();
    }, 22);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScroll);
  };

  startAutoScroll();

  testimonialBox.addEventListener("mouseenter", () => {
    currentScroll = testimonialBox.scrollTop;
    stopAutoScroll();
  });

  testimonialBox.addEventListener("scroll", () => {
    currentScroll = testimonialBox.scrollTop;
    normalizeScroll();
  });

  testimonialBox.addEventListener("mouseleave", () => {
    currentScroll = testimonialBox.scrollTop;
    startAutoScroll();
  });
}

const affiliateCarousel = document.getElementById("affiliateCarousel");
if (affiliateCarousel) {
  const affiliateCards = Array.from(affiliateCarousel.children);

  for (let i = affiliateCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [affiliateCards[i], affiliateCards[j]] = [
      affiliateCards[j],
      affiliateCards[i],
    ];
  }

  affiliateCarousel.innerHTML = "";

  affiliateCards.forEach((card) => {
    affiliateCarousel.appendChild(card);
  });

  affiliateCarousel.scrollLeft = 0;
}
const affiliatePrev = document.getElementById("affiliatePrev");

const affiliateNext = document.getElementById("affiliateNext");

if (affiliateCarousel && affiliatePrev && affiliateNext) {
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
}

/* AGENT CAROUSEL */

const agentCarousel = document.getElementById("agentCarousel");

const agentPrevBtn = document.querySelector(
  '.carousel-prev[data-target="agentCarousel"]',
);

const agentNextBtn = document.querySelector(
  '.carousel-next[data-target="agentCarousel"]',
);

const updateAgentArrows = () => {
  if (!agentCarousel || !agentPrevBtn || !agentNextBtn) return;
  const visibleAgents = Array.from(
    agentCarousel.querySelectorAll(".agent-card:not(.hide)"),
  );

  const visibleCount = visibleAgents.length;

  if (!visibleCount || visibleCount <= 2) {
    agentPrevBtn.classList.add("hidden");
    agentNextBtn.classList.add("hidden");

    agentCarousel.scrollLeft = 0;

    return;
  }

  const visibleWidth = visibleAgents.reduce((total, card) => {
    return total + card.offsetWidth;
  }, 0);

  const gap = 14 * Math.max(0, visibleCount - 1);

  const maxScroll = Math.max(
    0,
    Math.ceil(visibleWidth + gap - agentCarousel.clientWidth),
  );

  const currentScroll = Math.ceil(agentCarousel.scrollLeft);

  const isAtStart = currentScroll <= 2;
  const isAtEnd = currentScroll >= maxScroll - 2;

  agentPrevBtn.classList.toggle("hidden", isAtStart);
  agentNextBtn.classList.toggle("hidden", isAtEnd);
};

if (agentCarousel && agentPrevBtn && agentNextBtn) {
  updateAgentArrows();

  agentCarousel.addEventListener("scroll", updateAgentArrows, {
    passive: true,
  });

  window.addEventListener("resize", updateAgentArrows);

  agentPrevBtn.addEventListener("click", () => {
    agentCarousel.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  });

  agentNextBtn.addEventListener("click", () => {
    agentCarousel.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  });
}

const infiniteCarousels = document.querySelectorAll(".infinite-carousel");

infiniteCarousels.forEach((carousel) => {
  const originalCards = Array.from(carousel.children);

  const shuffledCards = [...originalCards];

  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
  }

  carousel.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    shuffledCards.forEach((card) => {
      carousel.appendChild(card.cloneNode(true));
    });
  }

  requestAnimationFrame(() => {
    const oneSetWidth = carousel.scrollWidth / 4;
    let currentScroll = oneSetWidth;
    carousel.scrollLeft = currentScroll;
    let isNormalizing = false;
    const normalize = () => {
      if (isNormalizing) return;
      if (currentScroll >= oneSetWidth * 3 - 40) {
        isNormalizing = true;
        carousel.style.scrollBehavior = "auto";
        currentScroll -= oneSetWidth;
        carousel.scrollLeft = currentScroll;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            carousel.style.scrollBehavior = "smooth";
            isNormalizing = false;
          });
        });
      }
      if (currentScroll <= 40) {
        isNormalizing = true;
        carousel.style.scrollBehavior = "auto";
        currentScroll += oneSetWidth;
        carousel.scrollLeft = currentScroll;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            carousel.style.scrollBehavior = "smooth";
            isNormalizing = false;
          });
        });
      }
    };
    carousel.addEventListener(
      "scroll",
      () => {
        if (isNormalizing) return;
        currentScroll = carousel.scrollLeft;
        normalize();
      },
      { passive: true },
    );
    const prevBtn = document.querySelector(
      `.carousel-prev[data-target="${carousel.id}"]`,
    );
    const nextBtn = document.querySelector(
      `.carousel-next[data-target="${carousel.id}"]`,
    );
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentScroll -= 260;
        carousel.scrollTo({
          left: currentScroll,
          behavior: "smooth",
        });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentScroll += 260;
        carousel.scrollTo({
          left: currentScroll,
          behavior: "smooth",
        });
      });
    }
  });
});

/* FINITE CAROUSELS */

const finiteConfigs = [
  {
    id: "mapCarousel",
    amount: 220,
  },
  {
    id: "weaponCarousel",
    amount: 220,
  },
];

finiteConfigs.forEach((config) => {
  const carousel = document.getElementById(config.id);

  const prevBtn = document.querySelector(
    `.carousel-prev[data-target="${config.id}"]`,
  );

  const nextBtn = document.querySelector(
    `.carousel-next[data-target="${config.id}"]`,
  );

  if (!carousel || !prevBtn || !nextBtn) return;

  const updateButtons = () => {
    const maxScroll = Math.max(
      0,
      Math.ceil(carousel.scrollWidth - carousel.clientWidth),
    );

    const currentScroll = Math.ceil(carousel.scrollLeft);

    const isAtStart = currentScroll <= 2;
    const isAtEnd = currentScroll >= maxScroll - 2;
    const cannotScroll = maxScroll <= 2;

    prevBtn.classList.toggle("hidden", cannotScroll || isAtStart);

    nextBtn.classList.toggle("hidden", cannotScroll || isAtEnd);
  };

  updateButtons();

  carousel.addEventListener("scroll", updateButtons, {
    passive: true,
  });

  prevBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: -config.amount,
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: config.amount,
      behavior: "smooth",
    });
  });
});

// ROLE FILTER
const roleIcons = document.querySelectorAll(".role-icons img");
const agents = document.querySelectorAll(".agent-card");

roleIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    if (icon.classList.contains("active")) return;

    roleIcons.forEach((i) => i.classList.remove("active"));

    icon.classList.add("active");

    const role = icon.dataset.role;

    agents.forEach((agent) => {
      const agentRole = agent.dataset.role;

      if (role === "all" || role === agentRole) {
        agent.classList.remove("hide");

        agent.classList.remove("show");

        void agent.offsetWidth;

        agent.classList.add("show");
      } else {
        agent.classList.add("hide");
        agent.classList.remove("show");
      }
    });

    if (agentCarousel) {
      agentCarousel.scrollLeft = 0;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          agentCarousel.offsetWidth;

          setTimeout(() => {
            updateAgentArrows();
          }, 60);
        });
      });

      setTimeout(() => {
        updateAgentArrows();
      }, 120);
    }
  });
});
