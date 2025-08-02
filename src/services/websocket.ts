import type { OverlayData } from "../types/tournament";

class WebSocketService {
  private ws: WebSocket | null = null;
  private onDataUpdate: ((data: OverlayData) => void) | null = null;
  private isConnecting = false;

  connect(url: string = "ws://localhost:3001") {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.isConnecting = true;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: OverlayData = JSON.parse(event.data);
          if (this.onDataUpdate) {
            this.onDataUpdate(data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.log(
          "WebSocket connection failed (this is normal if no server is running)"
        );
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.isConnecting = false;
      };
    } catch (error) {
      console.log("WebSocket connection failed:", error);
      this.isConnecting = false;
    }
  }

  setDataUpdateCallback(callback: (data: OverlayData) => void) {
    this.onDataUpdate = callback;
  }

  disconnect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (error) {
        // Ignore disconnect errors
      }
      this.ws = null;
    }
    this.isConnecting = false;
  }
}

export const wsService = new WebSocketService();
