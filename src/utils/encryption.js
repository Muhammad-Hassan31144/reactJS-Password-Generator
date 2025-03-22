// utils/encryption.js

/**
 * Simple encryption for client-side data
 * Note: This is not truly secure and should be replaced with 
 * a proper encryption implementation in production
 * 
 * @param {string} data - Data to encrypt
 * @returns {string} Encrypted data
 */
export const encryptData = (data) => {
    if (!data) return "";
    
    try {
      // For production, use a proper encryption library
      // This is a simple placeholder implementation
      const key = "secure-password-generator-key";
      
      // Convert to base64 first
      const base64 = btoa(unescape(encodeURIComponent(data)));
      
      // Simple XOR with the key
      let result = "";
      for (let i = 0; i < base64.length; i++) {
        const charCode = base64.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      
      // Convert to base64 again to make it safe for storage
      return btoa(result);
    } catch (error) {
      console.error("Encryption failed:", error);
      return "";
    }
  };
  
  /**
   * Decrypt data encrypted with encryptData
   * 
   * @param {string} encryptedData - Data to decrypt
   * @returns {string} Decrypted data
   */
  export const decryptData = (encryptedData) => {
    if (!encryptedData) return "";
    
    try {
      const key = "secure-password-generator-key";
      
      // Decode the base64
      const decoded = atob(encryptedData);
      
      // XOR with the key
      let result = "";
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      
      // Decode the inner base64
      const decrypted = atob(result);
      
      return decodeURIComponent(escape(decrypted));
    } catch (error) {
      console.error("Decryption failed:", error);
      return "";
    }
  };