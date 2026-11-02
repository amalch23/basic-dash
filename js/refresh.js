// Actualisation automatique avec setInterval, et bouton Pause / Reprendre.

export function startAutoRefresh(task, delay) {
  const button = document.getElementById("pause");
  const clock = document.getElementById("last-update");
  let timer = null; // null = en pause

  const showTime = () => {
    clock.textContent = new Date().toLocaleTimeString("fr-FR");
  };

  const tick = () => {
    task();
    showTime();
  };

  const start = () => {
    timer = setInterval(tick, delay);
    button.textContent = "⏸ Pause";
    button.setAttribute("aria-pressed", "false");
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
    button.textContent = "▶ Reprendre";
    button.setAttribute("aria-pressed", "true");
  };

  button.addEventListener("click", () => (timer ? stop() : start()));
  showTime();
  start();
}
