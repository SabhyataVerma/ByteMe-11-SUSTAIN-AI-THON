document.getElementById("recipientForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Collect the recipient data from the form
    let recipientData = {
        organizationName: document.getElementById("organizationName").value,
        foodType: document.getElementById("foodType").value,
        recipientLocation: document.getElementById("recipientLocation").value,
        maxCapacity: document.getElementById("maxCapacity").value,
        urgency: document.getElementById("urgency").value,
        contactInfo: document.getElementById("contactInfo").value
    };

    console.log("Recipient data to be sent:", recipientData); // Log the data being sent to the backend

    // Send data to the backend
    fetch('http://localhost:3000/recipient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipientData)
    })
    .then(response => response.json())  // Ensure the response is parsed as JSON
    .then(data => {
        console.log("Response from backend:", data);  // Log the response from backend
        if (data.success) {
            alert("Recipient information submitted successfully!");
            window.location.href = "results.html"; // Redirect to matches page
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error submitting data:", error);
        alert("Error submitting data: " + error.message);
    });
});
