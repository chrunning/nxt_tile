/**
 * sky_logic.js
 * Universal utility for NXT Add-ins: Security, Decoding, and Translation
 */

const SkyLogic = {
    // 1. Decode the JWT to get User Info without calling an external API
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

    // 2. The "Translator" - Communicates with your Google Apps Script
    translateId: async function(guid, token, scriptUrl, secret) {
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

    // 3. Form URL Builder
    buildFormUrl: function(baseUrl, mappings) {
        let url = baseUrl + (baseUrl.includes('?') ? '' : '?usp=pp_url');
        
        for (const [key, value] of Object.entries(mappings)) {
            url += `&${key}=${encodeURIComponent(value)}`;
        }
        return url;
    }
};
