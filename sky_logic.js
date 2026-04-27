/**
 * sky_logic.js
 * Universal utility for NXT Add-ins: Security, Decoding, and Translation
 */

const SkyLogic = {
    // PASTE YOUR GENERATED STRING FROM GOOGLE LOGS HERE
    _vault: "Y2V4ZS9ESV9SVU9ZL3Mvc29yY2FtL21vYy5lbGdvb2cudHBwcGlyY3MvLzpzcHR0aA==", 

    // 1. Obfuscation Decoder: Rebuilds the Google Script URL at runtime
    getServiceUrl: function() {
        try {
            // Decode Base64, then reverse the characters
            const decoded = atob(this._vault);
            return decoded.split("").reverse().join("");
        } catch (e) {
            console.error("Vault access failed. Check your _vault string.");
            return null;
        }
    },

    // 2. Decode the JWT to get User Info (Email, Org ID)
    getUserFromToken: function(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Error decoding token", e);
            return null;
        }
    },

    // 3. The "Translator" - Communicates with your Google Apps Script
    // Note: It now gets the URL automatically from getServiceUrl()
    translateId: async function(guid, token, secret) {
        const scriptUrl = this.getServiceUrl();
        if (!scriptUrl) return null;

        const fullUrl = `${scriptUrl}?guid=${guid}&token=${token}&secret=${secret}`;
        
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error("Translation failed:", error);
            return null;
        }
    },

    // 4. Form URL Builder
    buildFormUrl: function(baseUrl, mappings) {
        let url = baseUrl + (baseUrl.includes('?') ? '' : '?usp=pp_url');
        
        for (const [key, value] of Object.entries(mappings)) {
            url += `&${key}=${encodeURIComponent(value)}`;
        }
        return url;
    }
};
