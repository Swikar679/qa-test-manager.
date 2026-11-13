
// API address of our Express backend.
const API_URL = "http://localhost:3000/api/testcases";

// Get the HTML elements we need.
const form = document.getElementById("testForm");
const formCard = document.getElementById("formCard");
const testCaseList = document.getElementById("testCaseList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");

const emptyState = document.getElementById("emptyState");

// Test cases are now loaded from the backend, not localStorage.
let testCases = [];

// Track whether we are creating or editing a test case.
let editingId = null;

// Show today's date.
document.getElementById("today").textContent =
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

// Fetch test cases from the backend.
async function loadTestCases() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load test cases");
        }

        testCases = await response.json();
        renderTestCases();

    } catch (error) {
        console.error("Error loading test cases:", error);
        alert("Could not load test cases. Check whether the backend is running.");
    }
}

// Update the dashboard numbers.
function updateDashboard() {
    document.getElementById("totalCount").textContent = testCases.length;

    document.getElementById("passedCount").textContent =
        testCases.filter(test => test.status === "Passed").length;

    document.getElementById("failedCount").textContent =
        testCases.filter(test => test.status === "Failed").length;

    document.getElementById("pendingCount").textContent =
        testCases.filter(test => test.status === "Not Started").length;
}

// Display test cases in the table.
function renderTestCases() {
    const search = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    const filteredCases = testCases.filter(test => {
        const matchesSearch =
            test.title.toLowerCase().includes(search) ||
            String(test.id).toLowerCase().includes(search);

        const matchesStatus =
            selectedStatus === "All" || test.status === selectedStatus;

        const matchesPriority =
            selectedPriority === "All" || test.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    testCaseList.innerHTML = "";

    emptyState.classList.toggle("hidden", filteredCases.length !== 0);

    filteredCases.forEach(test => {
        const row = document.createElement("tr");

        const caseCell = document.createElement("td");
        const title = document.createElement("div");
        const id = document.createElement("div");

        title.className = "case-title";
        title.textContent = test.title;

        id.className = "case-id";
        id.textContent = `TC-${test.id}`;

        caseCell.append(title, id);

        const priorityCell = document.createElement("td");
        const priority = document.createElement("span");

        priority.className = `priority priority-${test.priority}`;
        priority.textContent = test.priority;
        priorityCell.appendChild(priority);

        const statusCell = document.createElement("td");
        const status = document.createElement("span");

        status.className =
            `status status-${test.status.replaceAll(" ", "-")}`;

        status.textContent = test.status;
        statusCell.appendChild(status);

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.className = "action-button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editTestCase(test.id));

        const deleteButton = document.createElement("button");
        deleteButton.className = "action-button delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTestCase(test.id));

        actionCell.append(editButton, deleteButton);

        row.append(caseCell, priorityCell, statusCell, actionCell);
        testCaseList.appendChild(row);
    });

    updateDashboard();
}

// Open the form for a new test case.
function openForm() {
    editingId = null;
    form.reset();

    document.getElementById("formTitle").textContent = "Create a test case";
    document.getElementById("saveButton").textContent = "Save Test Case";

    formCard.classList.remove("hidden");
    document.getElementById("title").focus();
}

// Close and reset the form.
function closeForm() {
    formCard.classList.add("hidden");
    form.reset();
    editingId = null;
}

// Create or update a test case through the API.
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const testData = {
        title: document.getElementById("title").value.trim(),
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
        description: document.getElementById("description").value.trim(),
        steps: document.getElementById("steps").value.trim(),
        expected: document.getElementById("expected").value.trim()
    };

    if (!testData.title) return;

    try {
        const isEditing = editingId !== null;

        const response = await fetch(
            isEditing ? `${API_URL}/${editingId}` : API_URL,
            {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(testData)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save test case");
        }

        await response.json();

        closeForm();

        // Get the latest records from the database.
        await loadTestCases();

    } catch (error) {
        console.error("Error saving test case:", error);
        alert("Could not save test case. Please check the backend.");
    }
});

// Load an existing test case into the form.
function editTestCase(id) {
    const test = testCases.find(item => item.id === id);

    if (!test) return;

    editingId = id;

    document.getElementById("title").value = test.title;
    document.getElementById("priority").value = test.priority;
    document.getElementById("status").value = test.status;
    document.getElementById("description").value = test.description || "";
    document.getElementById("steps").value = test.steps || "";
    document.getElementById("expected").value = test.expected || "";

    document.getElementById("formTitle").textContent = "Edit test case";
    document.getElementById("saveButton").textContent = "Update Test Case";

    formCard.classList.remove("hidden");
    formCard.scrollIntoView({ behavior: "smooth" });
}

// Delete a test case through the API.
async function deleteTestCase(id) {
    const confirmed = confirm("Are you sure you want to delete this test case?");

    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete test case");
        }

        await loadTestCases();

    } catch (error) {
        console.error("Error deleting test case:", error);
        alert("Could not delete test case. Please check the backend.");
    }
}

// Connect buttons and filters.
document.getElementById("showFormButton").addEventListener("click", openForm);
document.getElementById("closeFormButton").addEventListener("click", closeForm);
document.getElementById("cancelButton").addEventListener("click", closeForm);

searchInput.addEventListener("input", renderTestCases);
statusFilter.addEventListener("change", renderTestCases);
priorityFilter.addEventListener("change", renderTestCases);

// Load records when the page opens.
loadTestCases();
