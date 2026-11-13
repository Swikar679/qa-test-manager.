CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Not Started',
    description TEXT,
    steps TEXT,
    expected TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);