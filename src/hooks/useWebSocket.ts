import { useEffect } from "react";
import {websocketService} from "@/services/websocketService.ts";
import {toast} from "@/hooks/use-toast.ts";


export function useWebSocket(url: string, enabled: boolean) {
    useEffect(() => {
        if (enabled) {
            websocketService.connect(url, (message) => {
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

            });
        } else {
            websocketService.disconnect();
        }

        return () => {
            websocketService.disconnect();
        };
    }, [url, enabled]);
}
