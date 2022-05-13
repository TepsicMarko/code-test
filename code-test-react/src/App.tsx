import { useState } from "react";
import "./App.css";
import Modal from "./components/Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const opneModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App">
      <button onClick={opneModal}>open modal</button>
      <Modal isOpen={isModalOpen} close={closeModal} />
    </div>
  );
}

export default App;
