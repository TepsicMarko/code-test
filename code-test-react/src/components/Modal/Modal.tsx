import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  close: () => void;
}

interface repos {
  name: string;
  stargazers_count: number;
  license: {
    [key: string]: string;
  };
  html_url: string;
}

const Modal = ({ isOpen, close }: ModalProps) => {
  const [input, setInput] = useState("");
  const [repos, setRepos] = useState<repos[]>([]);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const fetchRepos = async () => {
    if (input) {
      try {
        const data = await fetch(
          `https://api.github.com/search/repositories?q=${input}&sort=stars&order=desc&per_page=3`,
          {
            headers: {
              authorization: process.env.REACT_APP_GIT_TOKEN || "",
            },
          }
        );

        const repos = await data.json();

        setRepos(repos.items);
        !repos.items.length && setError("No repos found");
      } catch (error) {
        setError("No repos found");
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRepos();
  };

  useEffect(() => {
    if (!isOpen) {
      setRepos([]);
      setError("");
      setInput("");
    }
  }, [isOpen]);

  return isOpen ? (
    <div id="modal-container" onClick={close}>
      <div id="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Repository explorer</h2>
        <form className="modal-header" onSubmit={handleSubmit}>
          <input type="text" id="search-input" onChange={handleChange} />
          <button
            id="search-btn"
            onClick={fetchRepos}
            style={{ cursor: !input ? "not-allowed" : "" }}
          >
            search
          </button>
        </form>

        <main>
          <h3>Results</h3>
          <div id="results-container">
            {!repos.length
              ? error
                ? error
                : "search for repositorys"
              : repos.map(({ name, stargazers_count, license, html_url }) => (
                  <div key={name} className="result">
                    <strong>{name}</strong>
                    <span>Stars: {stargazers_count}</span>
                    <span>License: {license.key}</span>
                    <a href={html_url} target="_blank">
                      go to repo
                    </a>
                  </div>
                ))}
          </div>
        </main>
      </div>
    </div>
  ) : null;
};

export default Modal;
