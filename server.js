const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const dataFilePath = './seeds.json';

app.use(express.json());
app.use(cors());

// Get all seeds
app.get('/seeds', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file.");
        }

        try {
            const seeds = data ? JSON.parse(data) : []; // Initialize an empty array if the file is empty
            res.json(seeds);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Error parsing JSON.");
        }
    });
});

// Add a new seed
app.post('/seeds', (req, res) => {
    const newSeed = req.body;

    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file.");
        }

        const seeds = JSON.parse(data);
        seeds.push(newSeed);

        fs.writeFile(dataFilePath, JSON.stringify(seeds, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Error writing file.");
            }
            res.send("Seed added successfully.");
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});