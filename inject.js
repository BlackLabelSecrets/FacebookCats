const seenPosts = new Set();

// checks the wall and replaces content with openai every 4 seconds
async function run(data) {
  if (!data || !data?.openai_key) {
    return;
  }

  const container = document.querySelector(".x1hc1fzr.x1unhpq9.x6o7n8i");

  container.querySelectorAll(".x1lliihq").forEach(async (element) => {
    const name = element.querySelector("h4 strong span");
    const text = element.querySelector("[dir='auto']");
    const nameLink = element.querySelector(".xt0psk2");
    const bigText = element.querySelector(
      ".xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs",
    );

    if (!seenPosts.has(element)) {
      if (name) {
        name.textContent = await fetchOpenAI(data, name.textContent, "name");
      }

      if (name && nameLink) {
        nameLink.textContent = name.textContent;
      }

      if (text) {
        text.textContent = await fetchOpenAI(data, text.textContent, "post");
      }

      if (bigText) {
        bigText.textContent = await fetchOpenAI(
          data,
          bigText.textContent,
          "post",
        );
      }

      seenPosts.add(element);
    }
  });
}

// fetches the data from openai to insert onto the page
async function fetchOpenAI(data, content, type) {
  const url = "https://api.openai.com/v1/chat/completions";
  const bearer = "Bearer " + data.openai_key;
  let prompt = "";

  if (type === "name") {
    prompt =
      "Rewrite this name and only return the name as plain text, here is the name: " +
      content;
  } else {
    prompt =
      "Rewrite the following text and only return the rewritten text as plain text, here is the content: " +
      content;
  }

  return await fetch(url, {
    method: "POST",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: data.openai_model,
      messages: [
        {
          role: "system",
          content:
            "You are RewriterGPT. Your role is to rewrite text that is given to you and return the rewritten text only. You will rewrite the text using your personality and instructions here: " +
            data.prompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data["choices"][0].message.content;
    })
    .catch((error) => {
      console.log("Something bad happened: " + error);
    });
}

// on load check if we have data in storage, if so run the script
chrome.storage.sync.get(["fb_cat_data"], function (result) {
  if (result.fb_cat_data) {
    setInterval(() => {
      run(result.fb_cat_data);
    }, 4000);
  }
});
