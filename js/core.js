const scenes = Array.from(document.querySelectorAll(".scene"));
const options = { root: null, threshold: 0.3 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("scene--active");
    }
  });
}, options);

scenes.forEach((scene) => observer.observe(scene));

document.querySelectorAll("[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
