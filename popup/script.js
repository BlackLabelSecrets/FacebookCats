// on page loaded
document.addEventListener("DOMContentLoaded", () => {
  // click #save button, save to local storage and show notice
  document.querySelector("#save").addEventListener("click", (e) => {
    const data = {
      prompt: document.querySelector("#prompt").value,
      openai_key: document.querySelector("#openai_key").value,
      openai_model: document.querySelector("#openai_model").value,
    };
    chrome.storage.sync.set({ fb_cat_data: data }, function () {
      showNotice("Saved -- make sure to reload Facebook to see changes!");
    });
  });

  // tab switching
  document.querySelectorAll(".tab-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".tab-link")
        .forEach((el) => el.classList.remove("active"));
      e.target.classList.add("active");

      document
        .querySelectorAll(".tab")
        .forEach((el) => (el.style.display = "none"));
      console.log(
        e.target.dataset.tab,
        document.querySelector(`.tab[data-tab=${e.target.dataset.tab}]`),
      );
      document.querySelector(
        `.tab[data-tab=${e.target.dataset.tab}]`,
      ).style.display = "block";
    });
  });

  // on load of popup, get the value from storage and set the value of the textarea
  chrome.storage.sync.get(["fb_cat_data"], function (result) {
    if (result?.fb_cat_data) {
      document.querySelector("#prompt").value = result.fb_cat_data.prompt;
      document.querySelector("#openai_key").value =
        result.fb_cat_data.openai_key;
      document.querySelector("#openai_model").value =
        result.fb_cat_data.openai_model || "gpt-3.5-turbo-1106";
    }
  });
});

// Show notice at top of popup for 2 seconds
function showNotice(message) {
  document.querySelector("#notice").innerHTML = message;
  document.querySelector("#notice").style.display = "block";
  setTimeout(() => {
    document.querySelector("#notice").style.display = "none";
  }, 2000);
}
