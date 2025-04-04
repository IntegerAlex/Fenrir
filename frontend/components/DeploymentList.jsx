import React from "react";

const DeploymentList = () => {
    return (
        <div id="deployments-list">
            {/* Replace with dynamic fetch/render logic */}
            <div className="deployment-item">
                <h3>My App</h3>
                <p>Status: Running</p>
            </div>
            <div className="deployment-item">
                <h3>Test Site</h3>
                <p>Status: Building</p>
            </div>
        </div>
    );
};

export default DeploymentList;

