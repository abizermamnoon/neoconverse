import fetch from 'node-fetch'; // Import fetch from node-fetch

const url = "https://api.apollo.io/v1/people/match";

const data = {
    id: "",
    first_name: "",
    last_name: "",
    organization_name: "",
    email: "",
    hashed_email: "",
    domain: "",
    linkedin_url: "https://www.linkedin.com/in/abizer-mamnoon/",
    reveal_personal_emails: true,
    reveal_phone_number: true,
    webhook_url: "https://your_webhook_site"
};

const headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'X-Api-Key': 'OxITRSjQ8bAOIFWgBoDwYg'
};

async function fetchData() {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Extract the email address from the result
        const email = result.person?.contact?.email || 'Email not found'; // Adjust according to the actual response structure
        console.log(email); // Output only the email
    } catch (error) {
        console.error("Error:", error);
    }
}

fetchData();
