export const scrollToCenter = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  const targetY = absoluteTop - window.innerHeight / 2 + rect.height / 2;

  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: "smooth",
  });
};
