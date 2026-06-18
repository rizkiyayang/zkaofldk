import { jajanCollections } from "/data/jajan-products.js?v=20260619-jajansimple1";

function createPicture(image) {
  const picture = document.createElement("picture");

  if (image.avif) {
    const source = document.createElement("source");
    source.type = "image/avif";
    source.srcset = image.avif;
    picture.appendChild(source);
  }

  if (image.webp) {
    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = image.webp;
    picture.appendChild(source);
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

function renderJajanan() {
  const container = document.getElementById("jajanGrid");
  if (!container) return;

  const fragment = document.createDocumentFragment();

  jajanCollections.jajanFavorites.forEach((item, index) => {
    const card = document.createElement("a");
    card.className = "snack-card";
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer sponsored";

    const imageWrap = document.createElement("div");
    imageWrap.className = "snack-image";
    imageWrap.appendChild(createPicture(item.image));

    const content = document.createElement("div");
    content.className = "snack-content";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const action = document.createElement("span");
    action.className = "snack-action";
    action.textContent = index === 0 ? "Lihat Molreng di Shopee →" : "Lihat di Shopee →";

    content.append(title, description, action);
    card.append(imageWrap, content);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

renderJajanan();
