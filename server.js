const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Function to read CSV and convert it to JSON
function readCSV(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    const headers = data[0].split(',');
    const rows = data.slice(1).filter(row => row.trim() !== ''); // Remove empty rows

    return rows.map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
        }, {});
    });
}

// Function to write updated data back to a CSV file
function writeCSV(filePath, data, headers) {
    const csvData = [headers.join(','), ...data.map(row => headers.map(header => row[header]).join(','))].join('\n');
    fs.writeFileSync(filePath, csvData);
}

// POST route for receiving donor data
app.post('/donor', (req, res) => {
    try {
        const donorData = req.body;
        console.log("Received donor data:", donorData);

        if (!donorData.restaurantName || !donorData.foodType || !donorData.quantity || !donorData.location || !donorData.expirationDate || !donorData.priority || !donorData.contactInfo) {
            return res.status(400).json({ success: false, message: 'Missing required donor fields' });
        }

        let donors = readCSV('donor_data.csv');
        donors.push(donorData);

        const donorHeaders = ['restaurantName', 'foodType', 'quantity', 'location', 'expirationDate', 'priority', 'contactInfo'];
        writeCSV('donor_data.csv', donors, donorHeaders);

        res.status(200).json({ success: true, message: 'Donor information submitted successfully!', donor: donorData });
    } catch (error) {
        console.error('Error in /donor route:', error);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
});

// POST route for receiving recipient data
app.post('/recipient', (req, res) => {
    try {
        const recipientData = req.body;
        console.log("Received recipient data:", recipientData);

        if (!recipientData.organizationName || !recipientData.foodType || !recipientData.recipientLocation || !recipientData.maxCapacity || !recipientData.urgency || !recipientData.contactInfo) {
            return res.status(400).json({ success: false, message: 'Missing required recipient fields' });
        }

        let recipients = readCSV('recipient_data.csv');
        recipients.push(recipientData);

        const recipientHeaders = ['organizationName', 'foodType', 'recipientLocation', 'maxCapacity', 'urgency', 'contactInfo'];
        writeCSV('recipient_data.csv', recipients, recipientHeaders);

        res.status(200).json({ success: true, message: 'Recipient information submitted successfully!', recipient: recipientData });
    } catch (error) {
        console.error('Error in /recipient route:', error);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
});

// POST route for matching donors and recipients (Algorithm directly in the server)
// POST route for matching donors and recipients (Algorithm directly in the server)
app.post('/match', (req, res) => {
    try {
        let donors = readCSV('donor_data.csv');
        let recipients = readCSV('recipient_data.csv');
        const matches = [];

        const donorHeaders = ['restaurantName', 'foodType', 'quantity', 'location', 'expirationDate', 'priority', 'contactInfo'];
        const recipientHeaders = ['organizationName', 'foodType', 'recipientLocation', 'maxCapacity', 'urgency', 'contactInfo'];

        // Loop through donors and recipients to find matches
        for (let donor of donors) {
            donor.foodType = donor.foodType || ''; // Ensure foodType is not undefined
            donor.location = donor.location || ''; // Ensure location is not undefined
            donor.quantity = parseInt(donor.quantity, 10); // Ensure quantity is a number

            for (let recipient of recipients) {
                recipient.foodType = recipient.foodType || ''; // Ensure foodType is not undefined
                recipient.recipientLocation = recipient.recipientLocation || ''; // Ensure recipientLocation is not undefined
                recipient.maxCapacity = parseInt(recipient.maxCapacity, 10); // Ensure maxCapacity is a number

                // Matching logic: Food Type, Location, and Quantity
                const matchFoodType = donor.foodType.toLowerCase() === recipient.foodType.toLowerCase();  // Match food type
                const matchLocation = donor.location.toLowerCase() === recipient.recipientLocation.toLowerCase();  // Match city
                const validQuantity = donor.quantity > 0 && recipient.maxCapacity > 0;  // Ensure food quantity is available and recipient can accept it

                console.log(`Matching Donor: ${donor.restaurantName} with Recipient: ${recipient.organizationName}`);
                console.log("Match Conditions:", matchFoodType, matchLocation, validQuantity);

                if (matchFoodType && matchLocation && validQuantity) {
                    const transferQuantity = Math.min(donor.quantity, recipient.maxCapacity);
                    donor.quantity -= transferQuantity;
                    recipient.maxCapacity -= transferQuantity;

                    matches.push({
                        Donor: donor.restaurantName || 'Anonymous Donor',
                        Recipient: recipient.organizationName,
                        FoodType: donor.foodType,
                        QuantityTransferred: transferQuantity,
                        RecipientLocation: recipient.recipientLocation,
                        DonorContact: donor.contactInfo,
                        RecipientContact: recipient.contactInfo,
                        ExpirationDate: donor.expirationDate,
                        Priority: donor.priority
                    });
                }
            }
        }

        // If no matches are found
        if (matches.length === 0) {
            return res.status(200).json({ success: false, message: 'No matches found' });
        }

        // Save matches to CSV
        const matchesFilePath = 'matches.csv';
        const matchesHeaders = ['Donor', 'FoodType', 'QuantityTransferred', 'Recipient', 'RecipientLocation', 'DonorContact', 'RecipientContact', 'ExpirationDate', 'Priority'];
        writeCSV(matchesFilePath, matches, matchesHeaders);

        res.status(200).json({ success: true, matches });

    } catch (error) {
        console.error('Error in /match route:', error);
        res.status(500).json({ success: false, message: 'An error occurred during matching.' });
    }
});


// Endpoint to fetch match data
app.get('/get-matches', (req, res) => {
    const matchesFilePath = 'matches.csv';

    if (!fs.existsSync(matchesFilePath)) {
        return res.status(404).json({ success: false, message: 'No matches found yet.' });
    }

    const matches = readCSV(matchesFilePath);
    res.status(200).json({ success: true, matches });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
