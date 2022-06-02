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

  constructor(path = "ws://localhost:8090") {
    this.messageId = 0;
    this.pendingResolves = new Array<PendingMessage>();
    this._ws = new WebSocket(path);
    this._ws.addEventListener("open", () => {
      console.log("websocket opened with " + path);

      this.play({ x: 0, y: 1 }, { x: 5, y: 1 }).then((e) => {
        console.log(e);
      });
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
  }

  private sendMessage(data: unknown, action: string): Promise<NetworkMessage> {
    return new Promise((resolve, reject) => {
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
