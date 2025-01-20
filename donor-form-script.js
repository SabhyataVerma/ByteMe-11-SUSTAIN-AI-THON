document.getElementById("donorForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Collect the donor data from the form
    let donorData = {
        restaurantName: document.getElementById("restaurantName").value,
        foodType: document.getElementById("foodType").value,
        quantity: document.getElementById("quantity").value,
        location: document.getElementById("location").value,
        expirationDate: document.getElementById("expirationDate").value,
        priority: document.getElementById("priority").value,
        contactInfo: document.getElementById("contactInfo").value
    };

    console.log("Donor data to be sent:", donorData); // Log the data being sent to the backend

    // Send data to the backend
    fetch('http://localhost:3000/donor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData)
    })
    .then(response => response.json())  // Ensure the response is parsed as JSON
    .then(data => {
        console.log("Response from backend:", data);  // Log the response from backend
        if (data.success) {
            alert("Donor information submitted successfully!");
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
