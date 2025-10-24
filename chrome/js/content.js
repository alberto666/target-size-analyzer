(function() {
  if (window.hasRunTargetSizeValidator) return;
  window.hasRunTargetSizeValidator = true;

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data.type === "RESET_VALIDATION") {
      document.querySelectorAll(".wcag-target-highlight").forEach(el => {
        el.classList.remove("wcag-target-highlight");
      });
      chrome.runtime.sendMessage({ type: "VALIDATION_RESULT", count: 0 });
      return;
    }

    if (event.data.type === "RUN_VALIDATION") {
      const { nivel, extraSelector } = event.data;
      const minSize = nivel === "AA" ? 24 : 48;

      document.querySelectorAll(".wcag-target-highlight").forEach(el => {
        el.classList.remove("wcag-target-highlight");
      });

      const selectors = extraSelector 
        ? extraSelector.split(",").map(s => s.trim()) 
        : ["a[href]", "button", "[role='button']", "input[type='button']", "input[type='submit']"];

      let count = 0;
      document.querySelectorAll(selectors.join(",")).forEach(el => {
        let rect = el.getBoundingClientRect();
        if (el.tagName === "A" && el.children.length === 1 && el.children[0].tagName === "IMG") {
          rect = el.children[0].getBoundingClientRect();
        }
        if (rect.width < minSize || rect.height < minSize) {
          el.classList.add("wcag-target-highlight");
          count++;
        }
      });

      chrome.runtime.sendMessage({ type: "VALIDATION_RESULT", count });
    }
  });
})();