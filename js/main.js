const openModalBtn = document.getElementById("open-modal-btn");
const modalContainer = document.getElementById("modal-container");
const modal = document.getElementById("modal");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const gitToken = "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"; // ovo inače nebi tu bilo
const resultsContainer = document.getElementById("results-container");

openModalBtn.onclick = () => {
  modalContainer.style.visibility = "visible";
};

modalContainer.onclick = () => {
  modalContainer.style.visibility = "hidden";
};

modal.onclick = (e) => {
  e.stopPropagation();
};

const createElementWithProps = (el, props) =>
  Object.assign(
    document.createElement(el),
    typeof props === "string" ? { textContent: props } : props
  );

const renderResult = ({ name, stargazers_count, license, html_url }) => {
  const result = document.createElement("div");
  result.classList.add("result");

  const repoName = createElementWithProps("strong", name);
  const repoStars = createElementWithProps("span", `Stars: ${stargazers_count}`);
  const repoLicense = createElementWithProps("span", `License: ${license.key}`);
  const visitRepo = createElementWithProps("a", {
    textContent: "go to repo",
    href: html_url,
  });

  result.append(repoName, repoStars, repoLicense, visitRepo);

  return result;
};

const renderResults = (results) => {
  resultsContainer.innerHTML = "";

  if (results.length) {
    for (let result of results) {
      resultsContainer.appendChild(renderResult(result));
    }
  } else resultsContainer.innerHTML = "No results found";
};

searchBtn.onclick = async () => {
  const searchValue = searchInput.value;

  try {
    const data = await fetch(
      `https://api.github.com/search/repositories?q=${searchValue}&sort=stars&order=desc&per_page=3`,
      {
        headers: {
          authorization: gitToken,
        },
      }
    );

    const repos = await data.json();
    renderResults(repos.items);
  } catch (error) {
    resultsContainer.innerHTML = error;
  }
};
