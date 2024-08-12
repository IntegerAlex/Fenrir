import express from "express";
import path from "path";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userName, buildCommand, runCommand, repoLink, entryPoint } = req.body;
  const projectName = repoLink.split("/").pop().split(".")[0];
  console.log(projectName, repoLink, entryPoint);
  //if(!buildCommand){
  //	buildCommand = 	"npm install"
  //}
  //if(!runCommand){
  //	runCommand = "node"
  //}
  //res.send("<p>Debugging... please Wait</p>");
  await fetch("http://localhost:8080/v1/runContainer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: userName,
      projectName: projectName,
      repoLink: repoLink,
      buildCommand: !buildCommand ? "npm install" : buildCommand,
      runCommand: !runCommand ? "node" : runCommand,
      entryPoint: entryPoint,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const containerId = data.containerId;
      res.send(`<p>Container ID: ${containerId}</p>`);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.send("Error");
    });
});
//db.addContainer(containerId , projectName , repoLink , entryPoint)

//res.send("<p>Deploying... please Wait</p>");
router.get("/deployments", async (req, res) => {
  db.getContainers().then((containers) => {
    const deployments = [];
    for (const container of containers) {
      deployments.push(`<p>Container ID: ${container.containerId}</p>`);
    }
    res.send(deployments.join(""));
  });
});

export default router;
