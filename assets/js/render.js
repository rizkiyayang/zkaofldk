function createPicture(image) {
  const picture = document.createElement("picture");

  if (image.avif) {
    const sourceAvif = document.createElement("source");
    sourceAvif.type = "image/avif";
    sourceAvif.srcset = image.avif;
    picture.appendChild(sourceAvif);
  }

  if (image.webp) {
    const sourceWebp = document.createElement("source");
    sourceWebp.type = "image/webp";
    sourceWebp.srcset = image.webp;
    picture.appendChild(sourceWebp);
  }

  const img = document.createElement("img");
  img.src = image.fallback || image.webp || image.avif;
  img.alt = image.alt || "";
  img.loading = "lazy";
  img.decoding = "async";

  if (image.width) img.width = image.width;
  if (image.height) img.height = image.height;

  picture.appendChild(img);
  return picture;
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function renderProductCollections(collections) {
  document.querySelectorAll("[data-product-collection]").forEach((container) => {
    const collectionName = container.dataset.productCollection;
    const sourceItems = collections[collectionName] || [];
    const items = collectionName === "setupJourney" ? sourceItems : shuffled(sourceItems);
    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const card = document.createElement("a");
      card.className = item.journey
        ? "affiliate-card journey-card"
        : "affiliate-card";
      card.href = item.url;
      card.target = "_blank";
      card.rel = item.affiliate
        ? "noopener noreferrer sponsored"
        : "noopener noreferrer";

      const imageWrap = document.createElement("div");
      imageWrap.className = "affiliate-image-wrap";
      imageWrap.appendChild(createPicture(item.image));

      const info = document.createElement("div");
      info.className = "affiliate-info";

      const name = document.createElement("div");
      name.className = "affiliate-name";
      name.textContent = item.name;

      const description = document.createElement("div");
      description.className = "affiliate-sub";
      description.textContent = item.description;

      info.append(name, description);
      card.append(imageWrap, info);
      fragment.appendChild(card);
    });

    container.replaceChildren(fragment);
  });
}

export function renderAgents(container, agents) {
  if (!container) return;
  const fragment = document.createDocumentFragment();

  agents.forEach((agent) => {
    const card = document.createElement("a");
    card.className = "agent-card";
    card.dataset.role = agent.role;
    card.setAttribute("aria-label", `${agent.name}, role ${agent.role}`);

    card.appendChild(createPicture(agent.image));

    const name = document.createElement("div");
    name.className = "agent-name";
    name.textContent = agent.name;
    card.appendChild(name);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

export function renderMaps(container, maps) {
  if (!container) return;
  const fragment = document.createDocumentFragment();

  maps.forEach((map) => {
    const card = document.createElement("div");
    card.className = "map-card";
    card.appendChild(createPicture(map.image));

    const name = document.createElement("div");
    name.className = "map-name";
    name.textContent = map.name;

    const description = document.createElement("div");
    description.className = "map-desc";
    description.textContent = map.description;

    card.append(name, description);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

export function renderWeapons(container, weapons) {
  if (!container) return;
  const fragment = document.createDocumentFragment();

  weapons.forEach((weapon) => {
    const card = document.createElement("div");
    card.className = "weapon-card";
    card.appendChild(createPicture(weapon.image));

    const name = document.createElement("div");
    name.className = "weapon-name";
    name.textContent = weapon.name;

    const description = document.createElement("div");
    description.className = "weapon-desc";
    description.textContent = weapon.description;

    card.append(name, description);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}
