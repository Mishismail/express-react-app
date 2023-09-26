const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const app = express();
const path = require('path');

app.use(express.json());

// Utility function - gets web project data
function getWebProjects() {
  try {
    const content = fs.readFileSync('webprojects.json', 'utf8'); // Specify encoding
    return JSON.parse(content);
  } catch (e) {
    console.error('Error reading webprojects.json:', e);
    return [];
  }
}

function addWebProject(webProject) {
  const webProjects = getWebProjects();
  const newWebProject = {
    id: uuid.v4(), // Generate a unique ID
    title: webProject.title,
    description: webProject.description,
    url: webProject.url,
  };
  webProjects.push(newWebProject);
  try {
    fs.writeFileSync('webprojects.json', JSON.stringify(webProjects));
  } catch (e) {
    console.error('Error writing webprojects.json:', e);
  }
}

function deleteWebProject(id) {
  const webProjects = getWebProjects();
  const index = webProjects.findIndex((project) => project.id === id);
  if (index !== -1) {
    webProjects.splice(index, 1);
    try {
      fs.writeFileSync('webprojects.json', JSON.stringify(webProjects));
    } catch (e) {
      console.error('Error writing webprojects.json:', e);
    }
    return true;
  }
  return false;
}

function updateWebProject(id, updatedProject) {
  const webProjects = getWebProjects();
  const index = webProjects.findIndex((project) => project.id === id);
  if (index !== -1) {
    webProjects[index] = { ...webProjects[index], ...updatedProject };
    try {
      fs.writeFileSync('webprojects.json', JSON.stringify(webProjects));
    } catch (e) {
      console.error('Error writing webprojects.json:', e);
    }
    return true;
  }
  return false;
}

// Serve the React app (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle requests that don't match the API routes by serving the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// GET request to retrieve all 'Web project' items
app.get('/api', (req, res) => {
  const webProjects = getWebProjects();
  res.json(webProjects);
});

// POST request to add a new 'Web project' item
app.post('/api', (req, res) => {
  const newWebProject = req.body;
  addWebProject(newWebProject);
  res.status(201).json({ message: 'Success, added web project', webProject: newWebProject });
});

// DELETE request to remove a 'Web project' item by ID
app.delete('/api/:id', (req, res) => {
  const projectId = req.params.id;
  const deleted = deleteWebProject(projectId);
  if (deleted) {
    res.status(200).json({ message: 'Web project deleted successfully' });
  } else {
    res.status(404).json({ message: 'Web project not found' });
  }
});

// PUT request to update the title, description, or url of a 'Web project' item by ID
app.put('/api/:id', (req, res) => {
  const projectId = req.params.id;
  const updatedProject = req.body;
  const updated = updateWebProject(projectId, updatedProject);
  if (updated) {
    res.json({ message: 'Success, updated web project', webProject: updatedProject });
  } else {
    res.status(404).json({ message: 'Web project not found' });
  }
});


const PORT = process.env.PORT || 8080;
   app.listen(PORT);


