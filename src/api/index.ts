interface Coordinates {
  x: number;
  y: number;
  value?: boolean;
}

interface NetworkMessage {
  action?: string;
  data: unknown;
  requestId: number;
}

interface PendingMessage {
  id: number;
  resolve: (value: NetworkMessage | PromiseLike<NetworkMessage>) => void;
  reject?: (reason?: unknown) => void;
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
      //this._ws.send('{"data":"yes"}');
    });

    // Écouter les messages
    this._ws.addEventListener("message", (event) => {
      console.log("Voici un message du serveur", event.data);
      const parsed = JSON.parse(event.data);
      if (this.pendingResolves[parsed.id]) {
        this.pendingResolves[parsed.id].resolve(parsed.data);
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
    return new Promise((resolve, reject) => {
      this.sendMessage(test, "discover")
        .then((result: NetworkMessage) => {
          resolve(result.data as Array<Coordinates>);
        })
        .catch(() => {
          reject(test);
        });
    });
  }
}
