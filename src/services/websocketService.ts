import {toast} from "@/hooks/use-toast.ts";

export class WebSocketService {
    private static instance: WebSocketService;
    private websocket: WebSocket | null = null;
    private reconnectDelay = 5000;
    private token: string | null = null;
    private url: string | null = null;
    private isIntentionalClosure = false;
    private shouldMaintainConnection = false;
    private heartbeatInterval: number | null = null;
    private pingInterval = 30000; // Send ping every 30 seconds

    private constructor() {
        // Remove visibility change listener as we'll maintain connection regardless
        window.addEventListener('beforeunload', () => {
            this.isIntentionalClosure = true;
            if (this.websocket) {
                this.websocket.close();
            }
        });
    }

    private startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = window.setInterval(() => {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                try {
                    // Send a ping message to keep the connection alive
                    this.websocket.send(JSON.stringify({ type: 'PING' }));
                } catch (error) {
                    console.error('Error sending ping:', error);
                    this.handleReconnection();
                }
            } else {
                this.handleReconnection();
            }
        }, this.pingInterval);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private handleReconnection() {
        if (!this.isIntentionalClosure && this.shouldMaintainConnection && this.token && this.url) {
            console.log('Connection lost, attempting to reconnect...');
            this.reconnect(this.token, this.url);
        }
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public connect(token: string, url: string) {
        this.token = token;
        this.url = url;
        this.isIntentionalClosure = false;
        this.shouldMaintainConnection = true;

        if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
            try {
                this.websocket = new WebSocket(`ws://${url}/websocket?token=${token}`);

                this.websocket.onopen = () => {
                    console.log("WebSocket connected");
                    // Start the heartbeat when connection is established
                    this.startHeartbeat();
                };

                this.websocket.onmessage = (event) => {
                    console.log("Message received:", event.data);
                    try {
                        // Skip processing for ping responses
                        if (event.data === 'PONG') {
                            return;
                        }

                        const message = JSON.parse(event.data);
                        const { type, message: content, severity, duration } = message;
                        const severityMap: Record<string, "default" | "destructive" | null | undefined> = {
                            SUCCESS: "default",
                            INFO: "default",
                            WARNING: "default",
                            ERROR: "destructive",
                        };
                        toast({
                            title: type,
                            description: content,
                            variant: severityMap[severity] || "default",
                            duration: duration || 3000,
                        });
                    } catch (error) {
                        console.error("Error processing WebSocket message:", error);
                    }
                };

                this.websocket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    this.handleReconnection();
                };

                this.websocket.onclose = () => {
                    console.log("WebSocket disconnected");
                    // Stop the heartbeat on connection close
                    this.stopHeartbeat();

                    if (!this.isIntentionalClosure && this.shouldMaintainConnection) {
                        console.log("Unintentional disconnection, attempting to reconnect...");
                        this.reconnect(token, url);
                    }
                };
            } catch (error) {
                console.error("Error creating WebSocket:", error);
                this.handleReconnection();
            }
        }
    }

    public reconnect(token: string, url: string) {
        if (!this.isIntentionalClosure && this.shouldMaintainConnection) {
            setTimeout(() => {
                console.log("Attempting to reconnect...");
                this.connect(token, url);
            }, this.reconnectDelay);
        }
    }

    public disconnect() {
        this.isIntentionalClosure = true;
        this.shouldMaintainConnection = false;
        this.token = null;
        this.url = null;

        // Stop the heartbeat
        this.stopHeartbeat();

        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }

    public getWebSocket(): WebSocket | null {
        return this.websocket;
    }
}