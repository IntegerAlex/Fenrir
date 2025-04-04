import React, { useEffect, useState } from "react";

const DeploymentForm = () => {
    const [repositories, setRepositories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch repositories when component mounts
    useEffect(() => {
        fetch("/htmx/v1/repositories")
            .then((response) => response.json())
            .then((data) => {
                setRepositories(data.data.repositories);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching repositories:", error);
                setIsLoading(false);
            });
    }, []);

    // Handle form submission
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log("Form Data:", data);

        fetch("/htmx/v1/deploy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                const responseContainer = document.getElementById("response-container");
                responseContainer.innerHTML = `<p>${data.message}</p>`;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <form id="project-setup-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
                <label>Select Repository:</label>
                <select id="repoLink" name="repoLink" disabled={isLoading}>
                    {isLoading ? (
                        <option>Loading repos...</option>
                    ) : (
                        repositories.map((repo) => (
                            <option key={repo.url} value={repo.url}>
                                {repo.name}
                            </option>
                        ))
                    )}
                </select>
            </div>
            <div className="form-group">
                <label>Build Command:</label>
                <input type="text" id="buildCommand" name="buildCommand" placeholder="npm build" />
            </div>
            <div className="form-group">
                <label>Run Command:</label>
                <input type="text" id="runCommand" name="runCommand" placeholder="npm start" />
            </div>
            <div className="form-group">
                <label>Entry Point:</label>
                <input type="text" id="entryPoint" name="entryPoint" placeholder="dist/index.html" />
            </div>
            <button id="deploy" type="submit" className="btn primary-btn">
                Deploy Application
            </button>
            <div id="response-container"></div>
        </form>
    );
};

export default DeploymentForm;

