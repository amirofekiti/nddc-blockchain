import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { fetchProjects, approveProject, releaseFunds, addProject } from "./utils/contractLocal"; // ✅ Correct Import
import contractABI from "./utils/contractABI.json"; // ✅ Correct Import

function App() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // ✅ Fetch Projects from Contract
  const loadProjects = async () => {
    console.log("🔄 Fetching projects...");
    const data = await fetchProjects();
    console.log("📊 Projects received:", data);
    setProjects(data || []);
  };

  // ✅ Load projects when component mounts
  useEffect(() => {
    loadProjects();
  }, []);

  // ✅ Handle New Project Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount) {
      console.error("❌ Please enter both title and amount");
      return;
    }

    console.log("📝 Adding project:", { title, amount });
    await addProject(title, amount);
    setTitle("");
    setAmount("");
    loadProjects(); // Refresh projects after adding
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">NDDC Transparency DApp</h1>
      <ConnectButton />
      
      {/* Refresh Projects Button */}
      <button onClick={loadProjects} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Refresh Projects
      </button>

      {/* Projects List */}
      <div className="w-full max-w-2xl bg-white p-6 mt-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        {projects.length === 0 ? (
          <p>No projects available</p>
        ) : (
          projects.map((project, index) => (
            <div key={index} className="p-4 border-b">
              <h3 className="text-lg font-bold">{project.title}</h3>
              <p>Requested Amount: {project.amount} ETH</p>
              <p>Status: {project.approved ? "Approved ✅" : "Pending ⏳"}</p>

              <button
                className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
                onClick={() => approveProject(index)}
              >
                Approve Project
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                onClick={() => releaseFunds(index)}
              >
                Release Funds
              </button>
            </div>
          ))
        )}
      </div>

      {/* Form to Add a New Project */}
      <div className="w-full max-w-md bg-white p-6 mt-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add a New Project</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Title"
            className="w-full p-2 border mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount (ETH)"
            className="w-full p-2 border mb-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
