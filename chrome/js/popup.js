document.getElementById("runCheck").addEventListener("click", () => {
  const nivel = document.querySelector('input[name="nivel"]:checked').value;
  const extraSelector = document.getElementById("extraSelector").value.trim();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (nivel, extraSelector) => {
        const minSize = nivel === "AA" ? 24 : 48;

        document.querySelectorAll(".wcag-target-highlight").forEach(el => el.classList.remove("wcag-target-highlight"));

        const selectors = extraSelector 
          ? extraSelector.split(",").map(s => s.trim()) 
          : ["a[href]", "button", "[role='button']", "input[type='button']", "input[type='submit']"];

        let count = 0;
        document.querySelectorAll(selectors.join(",")).forEach(el => {
          if (el.offsetParent === null) return;
          
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
      },
      args: [nivel, extraSelector],
    }, (results) => {
      const count = results[0].result;
      const resultEl = document.getElementById("result");
      resultEl.classList.add("active");
      resultEl.textContent = `${count} elements found
`;
    });
  });
});

// reset
document.getElementById("resetCheck").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        document.querySelectorAll(".wcag-target-highlight").forEach(el => el.classList.remove("wcag-target-highlight"));
        return 0;
      },
    }, (results) => {
      const resultEl = document.getElementById("result");
      resultEl.classList.remove("active");
    });
  });
});