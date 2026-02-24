const dynamicLine = document.querySelector("[data-type-dynamic]");
const introCore = document.querySelector(".intro-line--core");

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const weight = 420 + progress * 280; // variable font axis
  const stretch = 1 + progress * 0.12;

  if (dynamicLine) {
    dynamicLine.style.transform = `scaleX(${stretch})`;
    dynamicLine.style.letterSpacing = `${0.24 + progress * 0.3}em`;
    dynamicLine.style.fontVariationSettings = `"wght" ${weight}`;
  }

  if (introCore) {
    const scale = 1 + progress * 0.04;
    introCore.style.transform = `scale(${scale}) translateZ(0)`;
  }
});
