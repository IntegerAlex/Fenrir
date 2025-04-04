import React from "react";

const DeploymentForm = () => {
    return (
        <form id="project-setup-form">
            <div className="form-group">
                <label>Select Repository:</label>
                <select id="repoLink" name="repoLink">
                    <option>https://github.com/your-repo</option>
                </select>
            </div>
            <input type="hidden" id="userName" name="userName" />
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
            <button type="submit" className="btn primary-btn">Deploy Application</button>
            <div id="response-container"></div>
        </form>
    );
};

export default DeploymentForm;

