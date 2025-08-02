import type { OverlayData } from "../types/tournament";

class WebSocketService {
  private ws: WebSocket | null = null;
  private onDataUpdate: ((data: OverlayData) => void) | null = null;

  connect(url: string = "ws://localhost:3001") {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
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
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  setDataUpdateCallback(callback: (data: OverlayData) => void) {
    this.onDataUpdate = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
