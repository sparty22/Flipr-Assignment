async function fetchUsers() {
    try {
        console.log('Fetching users...');
        const response = await fetch('http://localhost:3000/admin/users');
        console.log('Response:', response);

        if (!response.ok) {
            throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }

        const users = await response.json();
        console.log('Users:', users);

        const tableBody = document.querySelector('#user-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td>${user.area}</td>
                <td>
                    <button class="delete-button" data-id="${user._id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error occurred in fetchUsers:', err);
        alert('An error occurred while fetching users.');
    }
}

// Show Add User Modal
document.querySelector('#add-user-button').addEventListener('click', () => {
    document.querySelector('#add-user-modal').style.display = 'block';
});

// Close Add User Modal
document.addEventListener('click', (event) => {
    if (event.target.id === 'add-user-modal' || event.target.className === 'close-modal') {
        document.querySelector('#add-user-modal').style.display = 'none';
    }
});

// Submit Add User Form
document.querySelector('#add-user-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/admin/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const newUser = await response.json();
            alert('User added successfully!');
            document.querySelector('#add-user-modal').style.display = 'none';
            addUserToTable(newUser); // Add the new user dynamically
        } else {
            alert('Error adding user.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred while adding the user.');
    }
});

// Delete User
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const userId = event.target.getAttribute('data-id');
        console.log('Attempting to delete user with ID:', userId); // Debug log

        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:3000/admin/delete-user/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('User deleted successfully!');
                    event.target.closest('tr').remove(); // Remove row from table
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message || 'Error deleting user.'}`);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred while deleting the user.');
            }
        }
    }
});

// Dynamically Add User to Table
function addUserToTable(user) {
    const tableBody = document.querySelector('#user-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.mobile}</td>
        <td>${user.area}</td>
        <td>
            <button class="delete-button" data-id="${user._id}">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', fetchUsers);
