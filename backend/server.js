
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Test whether the backend is running.
app.get("/", (req, res) => {
    res.json({
        message: "QA Test Manager API is running"
    });
});

// Retrieve all test cases.
app.get("/api/testcases", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM test_cases ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve test cases" });
    }
});

// Create a test case.
app.post("/api/testcases", async (req, res) => {
    try {
        const {
            title,
            priority,
            status,
            description,
            steps,
            expected
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "Test case title is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO test_cases
            (title, priority, status, description, steps, expected)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                title.trim(),
                priority || "Medium",
                status || "Not Started",
                description || "",
                steps || "",
                expected || ""
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create test case" });
    }
});

// Update a test case.
app.put("/api/testcases/:id", async (req, res) => {
    try {
        const {
            title,
            priority,
            status,
            description,
            steps,
            expected
        } = req.body;

        const result = await pool.query(
            `UPDATE test_cases
            SET title = $1,
                priority = $2,
                status = $3,
                description = $4,
                steps = $5,
                expected = $6
            WHERE id = $7
            RETURNING *`,
            [
                title,
                priority,
                status,
                description,
                steps,
                expected,
                req.params.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Test case not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update test case" });
    }
});

// Delete a test case.
app.delete("/api/testcases/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM test_cases WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Test case not found" });
        }

        res.json({ message: "Test case deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete test case" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
