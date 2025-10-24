document.getElementById("runCheck").addEventListener("click", () => {
  const nivel = document.querySelector('input[name="nivel"]:checked').value;
  const extraSelector = document.getElementById("extraSelector").value.trim();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "ANALYZE", nivel, extraSelector },
      (response) => {
        const count = response && response.count ? response.count : 0;
        const resultEl = document.getElementById("result");
        resultEl.classList.add("active");
        resultEl.textContent = `${count} elements found`;
      }
    );
  });
});

document.getElementById("resetCheck").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "RESET" },
      (response) => {
        const resultEl = document.getElementById("result");
        resultEl.classList.remove("active");
        resultEl.textContent = '';
      }
    );
  });
});