/**
 * sky_logic.js
 */

const SkyLogic = {
    // 1. Vault Storage
    _vault: {
        gas: "Y2V4ZS9ESV9SVU9ZL3Mvc29yY2FtL21vYy5lbGdvb2cudHBwcGlyY3MvLzpzcHR0aA==",
        form: "bXJvZndlaXYvdy9MdzVfNVhrczVYSE5oRHhOT3pTNT1zTjBuUFV2R21KMXNTcHBzMDIyWGZ2NlNRTFBZQUYxL2UvZC9zbXJvZi9jb20uZWxnb29nLnNjb2QvLzpzcHR0aA=="
    },

    // 2. Universal Decoder
    decodeVault: function(key) {
        try {
            const scrambled = this._vault[key];
            if (!scrambled) return null;
            return atob(scrambled).split("").reverse().join("");
        } catch (e) {
            console.error(`Decoding failed for key: ${key}`);
            return null;
        }
    },

    // 3. JWT Decoder
    getUserFromToken: function(token) {
        try {
            if (!token || !token.includes('.')) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    },

    // 4. Translator
    translateId: async function(guid, token, secret) {
        const scriptUrl = this.decodeVault('gas');
        if (!scriptUrl) return null;

        const fullUrl = `${scriptUrl}?guid=${guid}&token=${token}&secret=${secret}`;
        try {
            const response = await fetch(fullUrl);
            return await response.json();
        } catch (error) {
            console.error("Translation failed:", error);
            return null;
        }
    },

    // 5. Form URL Builder
    buildFormUrl: function(mappings) {
        const baseUrl = this.decodeVault('form');
        let url = baseUrl + (baseUrl.includes('?') ? '' : '?usp=pp_url');
        
        for (const [key, value] of Object.entries(mappings)) {
            url += `&${key}=${encodeURIComponent(value)}`;
        }
        return url;
    }
};
