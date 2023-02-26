const ws = require('ws');

class Client {
    private id : number;
    private betAmount: number;

    constructor(id: number) {
        this.id = id;
        this.betAmount = 0;
    }

    public addBet(amount: number) {
        this.betAmount += amount;
    }

    public getBetAmount() {
        return this.betAmount;
    }
}

export class Game {
    private clients: Array<Client> = [];
    private wss: any = new ws.Server({port: 3080});
    private roomCapicity: number = 78;

    constructor() {
        this.wss.on('connection', (ws: any) => {
            let id = this.addNewClient();
            if(id != -1) {
                console.log("new client connected");
                ws.send(`CE:${id}`);
            } else {
                ws.terminate();
            }
            //send connection established message

            ws.on("close", () => {
                console.log("Client disconnected");
            });

            ws.on("message", (message: string) => {
                this.processMessage(message.toString());
            }); 
        });
    }

    private addNewClient() :  number {
        if(this.clients.length < this.roomCapicity) {
            let id : number = this.clients.length+1;
            this.clients.push(new Client(id));
            return id;
        }
        return -1;
    }

    private processMessage(message: string) {
        let prefix : string = message.split(":")[0];
        let value : string = message.split(":")[1];

        switch(prefix) {
            case "AT": console.log(`Bet amount value is ${value}`);
        }
    }
}
