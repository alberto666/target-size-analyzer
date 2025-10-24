(function() {
  if (window.hasRunTargetSizeValidator) return;
  window.hasRunTargetSizeValidator = true;

  function runAnalysis(nivel, extraSelector) {
    const minSize = nivel === "AA" ? 24 : 48;

    document.querySelectorAll(".wcag-target-highlight").forEach(el => {
      el.classList.remove("wcag-target-highlight");
    });

    const selectors = extraSelector 
      ? extraSelector.split(",").map(s => s.trim()) 
      : ["a[href]", "button", "[role='button']", "input[type='button']", "input[type='submit']"];

    let count = 0;
    document.querySelectorAll(selectors.join(",")).forEach(el => {
      if (el.offsetParent === null) return; // elemento invisible
      let rect = el.getBoundingClientRect();
      if (el.tagName === "A" && el.children.length === 1 && el.children[0].tagName === "IMG") {
        rect = el.children[0].getBoundingClientRect();
      }
      if (rect.width < minSize || rect.height < minSize) {
        el.classList.add("wcag-target-highlight");
        count++;
      }
    });
    return count;
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "RESET") {
      document.querySelectorAll(".wcag-target-highlight").forEach(el => {
        el.classList.remove("wcag-target-highlight");
      });
      sendResponse({ count: 0 });
    } else if (request.action === "ANALYZE") {
      const count = runAnalysis(request.nivel, request.extraSelector);
      sendResponse({ count });
    }
    return true; // indica que la respuesta será enviada
  });
})();