import React, { useEffect, useState } from 'react';
import Navbar from '../src/Navbar';

function Dashboard() {
  const [deployments, setDeployments] = useState([]);
  const [formData, setFormData] = useState({
    repoLink: '',
    userName: '',
    buildCommand: '',
    runCommand: '',
    entryPoint: ''
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch deployments on component mount
  useEffect(() => {
    async function fetchDeployments() {
      try {
        const res = await fetch('/htmx/deployments');
        if (res.ok) {
          const data = await res.json();
          setDeployments(data);
        }
      } catch (error) {
        console.error('Error fetching deployments', error);
      }
    }
    fetchDeployments();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeploySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    try {
      const res = await fetch('/htmx/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResponseMessage(data.message || 'Deployment triggered');
    } catch (error) {
      setResponseMessage('Error deploying application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Navbar />
      </header>
      <main className="dashboard-main">
        <aside className="deployments-container">
          <h2>Deployments</h2>
          <div id="deployments-list">
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="deployment-item"
                onClick={() =>
                  window.location.assign(`/htmx/deployment/${deployment.id}`)
                }
                style={{ cursor: 'pointer' }}
              >
                <h3>{deployment.deployment_name}</h3>
                <p>Status: {deployment.status}</p>
              </div>
            ))}
          </div>
        </aside>
        <section className="project-setup-container">
          <form id="project-setup-form" onSubmit={handleDeploySubmit}>
            <div className="form-group">
              <label>Select Repository:</label>
              <select
                name="repoLink"
                value={formData.repoLink}
                onChange={handleFormChange}
              >
                <option value="">Select a repository</option>
                {/* Populate these options as needed */}
                <option value="repo1">Repo 1</option>
                <option value="repo2">Repo 2</option>
              </select>
            </div>
            <input
              type="hidden"
              name="userName"
              value={formData.userName}
              onChange={handleFormChange}
            />
            <div className="form-group">
              <label>Build Command:</label>
              <input
                type="text"
                name="buildCommand"
                placeholder="npm build"
                value={formData.buildCommand}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>Run Command:</label>
              <input
                type="text"
                name="runCommand"
                placeholder="npm start"
                value={formData.runCommand}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>Entry Point:</label>
              <input
                type="text"
                name="entryPoint"
                placeholder="dist/index.html"
                value={formData.entryPoint}
                onChange={handleFormChange}
              />
            </div>
            <button type="submit" className="btn primary-btn">
              Deploy Application
            </button>
          </form>
          <div id="response-container">{responseMessage}</div>
          {loading && (
            <div id="loading-message" className="loading">
              Deploying...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

