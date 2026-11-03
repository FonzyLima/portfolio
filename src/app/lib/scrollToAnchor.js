// Smooth-scrolls to an in-page target (e.g. "#footer") and moves focus there,
// so the next Tab continues from the target instead of the clicked link.
//
// Focus goes to the element named by the target's aria-labelledby (usually
// its heading) when there is one, otherwise to the target itself. Give that
// element tabIndex={-1} so it can take focus without joining the tab order.
//
// `event` is optional: pass the click event to cancel the native jump, or
// call it without one after the click has already been handled. Returns false
// (and leaves the event alone, so the native jump still happens) if the
// target doesn't exist.
export function scrollToAnchor(event, href) {
  const target = document.getElementById(href.replace(/^#/, ""));
  if (!target) return false;
  event?.preventDefault();

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });

  const labelId = target.getAttribute("aria-labelledby");
  const focusTarget = (labelId && document.getElementById(labelId)) || target;
  if (!focusTarget.hasAttribute("tabindex")) {
    focusTarget.setAttribute("tabindex", "-1");
  }
  focusTarget.focus({ preventScroll: true });
  return true;
}
