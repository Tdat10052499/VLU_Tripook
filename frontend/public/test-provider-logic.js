/*
TEST PROVIDER LOGIC - Browser Console Script

Copy and paste this script into browser console on http://localhost:3000 to test provider logic:

1. Test with regular user (testuser@gmail.com)
2. Test with existing provider (provider.hotel@gmail.com)
*/

// Test helper function
function testProviderLogic() {
    console.log("=== TESTING PROVIDER LOGIC ===");
    
    // Check current user
    const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
    
    if (!authToken) {
        console.log("❌ No auth token found. Please login first.");
        return;
    }
    
    console.log("✅ Auth token found:", authToken.substring(0, 20) + "...");
    
    // Test provider registration
    const testData = {
        company_name: "Test Company Ltd",
        business_type: "hotel",
        description: "Test company for upgrade",
        address: "123 Test Street, Test City",
        business_phone: "0123456789",
        business_email: "business@testcompany.com",
        website: "https://testcompany.com"
    };
    
    fetch('/api/provider/become-provider', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(testData)
    })
    .then(response => {
        console.log("Response Status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Response Data:", data);
        
        if (data.message) {
            console.log("✅ Success:", data.message);
        } else if (data.error) {
            console.log("❌ Error:", data.error);
        }
    })
    .catch(error => {
        console.error("Request failed:", error);
    });
}

// Instructions
console.log(`
PROVIDER LOGIC TEST INSTRUCTIONS:

1. Login with test accounts:
   - User: testuser@gmail.com / 123456 (should upgrade to provider)
   - Provider: provider.hotel@gmail.com / 123456 (should show error)

2. After login, run: testProviderLogic()

3. Check console output for results
`);

// Export test function
window.testProviderLogic = testProviderLogic;