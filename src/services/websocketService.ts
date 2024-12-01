type WebSocketMessage = {
    type: string;
    message: string;
    severity: "SUCCESS" | "ERROR" | "WARNING" | "INFO";
    duration?: number;
};

class WebSocketService {
    private socket: WebSocket | null = null;

    connect(url: string, onMessage: (data: WebSocketMessage) => void): void {
        if (this.socket) {
            console.warn("WebSocket is already connected.");
            return;
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connection established.");
        };

        this.socket.onmessage = (event) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed.");
            this.socket = null;
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        } else {
            console.warn("WebSocket is not connected.");
        }
    }

    sendMessage(message: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not connected or ready.");
        }
    }
}

export const websocketService = new WebSocketService();
