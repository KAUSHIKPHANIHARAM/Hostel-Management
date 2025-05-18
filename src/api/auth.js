// src/api/auth.js
const API_BASE = 'http://localhost:5000';

export const registerUser = async (formObj) => {
    const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formObj),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to register');
    }

    return response.json();
};
