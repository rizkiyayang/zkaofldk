export function initDonateModal() {
  const trigger = document.querySelector(".donate-trigger");
  const modal = document.getElementById("donateModal");
  const closeButton = document.getElementById("closeDonateModal");
  if (!trigger || !modal || !closeButton) return;

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-hidden", "true");

  const open = () => {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    closeButton.focus();
  };

  const close = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    trigger.focus();
  };

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    open();
  });
  closeButton.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) close();
  });
}
