interface Coordinates {
  x: number;
  y: number;
  value?: number;
}

interface NetworkMessage {
  action?: string;
  error?: string;
  data: unknown;
  id: number;
}

interface PendingMessage {
  id: number;
  resolve: (value: NetworkMessage | PromiseLike<NetworkMessage>) => void;
  reject: (reason?: unknown) => void;
}

export default class Networking {
  private messageId: number;
  private _ws: WebSocket;
  private pendingResolves: Array<PendingMessage>;

  public init: Promise<void>;

  constructor(path = "ws://localhost:8090") {
    this.messageId = 0;
    this.pendingResolves = new Array<PendingMessage>();
    this._ws = new WebSocket(path);
    this.init = new Promise((resolve) => {
      this._ws.addEventListener("open", () => {
        resolve();
        console.log("websocket opened with " + path);
      });

      this._ws.addEventListener("message", (event) => {
        const parsed: NetworkMessage = JSON.parse(event.data);
        //Check if answer to a pending message
        if (this.pendingResolves[parsed.id]) {
          if (parsed.error) {
            this.pendingResolves[parsed.id].reject(parsed);
          } else {
            this.pendingResolves[parsed.id].resolve(parsed);
          }
          delete this.pendingResolves[parsed.id];
        }
      });
    });
  }

  private sendMessage(data: unknown, action: string): Promise<NetworkMessage> {
    return new Promise((resolve, reject) => {
      if (this._ws.readyState != 1) {
        throw new Error(
          "Websocket not initialized. Please await for Networking.init"
        );
      }
      this.messageId++;
      this._ws.send(JSON.stringify({ data, action, id: this.messageId }));
      this.pendingResolves[this.messageId] = {
        resolve,
        reject,
        id: this.messageId,
      };
    });
  }

  /**
   * Clicks on cells but on the server. Accepts an infinite number of coordinates as arguments
   * @param test Array<Coordinates>
   * @returns Promise<Array<Coordinates>>
   */
  async play(...test: Array<Coordinates>): Promise<Array<Coordinates>> {
    return (await this.sendMessage(test, "discover"))
      .data as Array<Coordinates>;
  }
}
