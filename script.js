document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const uploadForm = document.getElementById('uploadForm');
    const userInfo = document.getElementById('user-info');

    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const fdrID = document.getElementById('fdrID').value;
        
        // Perform login logic here (e.g., send request to backend)
        // Mocking a successful login for demonstration
        if (email.endsWith('@fdrmun.org')) {
            showUploadForm(email, fdrID, 'Chair', 'UNHRC', 3); // Example for Chair
        } else {
            showUploadForm(email, fdrID, 'USA', 'DISEC', 2); // Example for Delegate
        }
    }

    function handleRegister(event) {
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('regEmail').value;
        const fdrID = document.getElementById('regFdrID').value;

        // Perform registration logic here (e.g., send request to backend)
        // Mocking a successful registration for demonstration
        alert('Registration successful. You can now log in.');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }

    function handleUpload(event) {
        event.preventDefault();
        const file = document.getElementById('file').files[0];

        // Perform file upload logic here (e.g., send file to backend)
        alert('File uploaded successfully.');
    }

    function showUploadForm(email, fdrID, country, committee, papersRequired) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        uploadForm.style.display = 'block';

        userInfo.innerHTML = `
            <p>Email: ${email}</p>
            <p>FDR ID: ${fdrID}</p>
            <p>Country: ${country}</p>
            <p>Committee: ${committee}</p>
            <p>Position Papers Required: ${papersRequired}</p>
        `;
    }
});
