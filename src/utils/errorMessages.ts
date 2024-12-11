// src/utils/errorMessages.ts
class ErrorMessageManager {
    private static errorMessages: Map<string, string> = new Map();
  
    static async loadErrorMessages() {
      try {
        // Đặt file CSV trong thư mục public
        const response = await fetch('/error_messages.csv');
        const csvText = await response.text();
        
        const lines = csvText.split('\n').slice(1);
        lines.forEach(line => {
          const [code, message] = line.split(',');
          if (code && message) {
            this.errorMessages.set(code.trim(), message.trim());
          }
        });
      } catch (error) {
        console.error('Error loading error messages:', error);
      }
    }
  
    static getMessage(code: string): string {
      return this.errorMessages.get(code) || 'Unknown error';
    }
  }
  
  export default ErrorMessageManager;