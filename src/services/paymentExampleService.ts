import {toast} from "@/hooks/use-toast.ts";

let websocket: WebSocket | null = null;


export class PaymentExampleService {

    createPaymentExample() {
        try {

            // paymentId = response
            connectWebSocket("paymentId")
        }catch (error) {
            console.log(error);
        }
    }


}

const connectWebSocket = (paymentId: string) => {
    const API_BASE_URL = import.meta.env.VITE_WS_URL;

    const wsUrl = `ws://${API_BASE_URL}/ws/${paymentId}`;
    console.log(wsUrl)
    websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
        console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);

        try {
            const message = JSON.parse(event.data);
            const { type, message: content, severity, duration } = message;

            const severityMap: Record<string, "default" | "destructive" | null | undefined> = {
                SUCCESS: "default",
                INFO: "default",
                WARNING: "default",
                ERROR: "destructive",
            };

            if (content == "success" || content == "destructive") {
                disconnectWebSocket()
            }
            toast({
                title: type,
                description: content,
                variant: severityMap[severity] || "default", // Default to "default" if severity is unknown
                duration: duration || 3000, // Default duration
            });
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }
    };

    websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
        console.log('WebSocket disconnected');
    };
};

const disconnectWebSocket = () => {
    if (websocket) {
        websocket.close();
        websocket = null;
    }
};