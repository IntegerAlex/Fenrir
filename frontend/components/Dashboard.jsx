import React, { useState } from "react";
import DeploymentList from "./DeploymentList";
import DeploymentForm from "./DeploymentForm";

const Dashboard = () => {
    const [showDeployFormOnly, setShowDeployFormOnly] = useState(false);

    return (
        <main className="dashboard-main">
            <div className="dashboard-header">
                <button
                    className="btn primary-btn"
                    onClick={() => setShowDeployFormOnly(!showDeployFormOnly)}
                >
                    {showDeployFormOnly ? "Show Deployments" : "Deploy"}
                </button>
            </div>

            <div className="dashboard-body" style={{ display: "flex", gap: "1rem" }}>
                {!showDeployFormOnly && (
                    <aside className="deployments-container" style={{ flex: "1" }}>
                        <h2>Deployments</h2>
                        <DeploymentList />
                    </aside>
                )}
                <section
                    className="project-setup-container"
                    style={{
                        flex: showDeployFormOnly ? "1" : "2",
                        transition: "flex 0.3s ease",
                    }}
                >
                    <DeploymentForm />
                </section>
            </div>
        </main>
    );
};

export default Dashboard;

