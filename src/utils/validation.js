     // Shared validation helpers.

     // Simple email check: text@text.text with no spaces
     export function isValidEmail(text) {
       return /^\S+@\S+\.\S+$/.test(text.trim())
     }
