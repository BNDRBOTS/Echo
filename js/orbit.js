const orbit = document.getElementById("orbit-cursor");

if (orbit) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;

  window.addEventListener("pointermove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    orbit.style.opacity = 1;
  });

  function loop() {
    const lerpFactor = 0.16;
    x += (targetX - x) * lerpFactor;
    y += (targetY - y) * lerpFactor;
    orbit.style.transform = `translate(${x - 11}px, ${y - 11}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  const interactive = document.querySelectorAll("button, a, .practice-pill, .case-node");
  interactive.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      orbit.style.transform += " scale(1.8)";
      orbit.style.background = "radial-gradient(circle, rgba(68,229,255,0.5), transparent 70%)";
    });
    el.addEventListener("mouseleave", () => {
      orbit.style.background = "transparent";
    });
  });
}
