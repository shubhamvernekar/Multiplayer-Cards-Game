/*
    JN = Client Join Game request
    JG = Client Join Game success
    NU = New user join game
    AT = Bet
    EX = client exit game
    CE = client exit game success
    UB = user bet
    BA = Bet Acknowledgement
*/


const ws = require('ws');

class Client {
    private id : number;
    private betAmount: number;
    private ws: any;

    constructor(id: number, ws: any) {
        this.id = id;
        this.betAmount = 0;
        this.ws = ws;
    }

    public addBet(amount: number) {
        this.betAmount += amount;
    }

    public getBetAmount() {
        return this.betAmount;
    }

    public getId() {
        return this.id;
    }

    public getWS() {
        return this.ws;
    }
}

export class Game {
    private clients: Array<Client> = [];
    private wss: any = new ws.Server({port: 3080});
    private roomCapicity: number = 8;

    constructor() {
        this.wss.on('connection', (ws: any) => {
            ws.on("close", () => {
                console.log("Client disconnected");
            });

            ws.on("message", (message: string) => {
                this.processMessage(message.toString(), ws);
            }); 
        });
    }

    private addNewClient(ws: any) :  number {
        if(this.clients.length < this.roomCapicity) {
            let id : number = this.clients.length+1;
            this.clients.push(new Client(id, ws));
            return id;
        }
        return -1;
    }

    private broadCastMessage(message: string) {
        this.wss.clients.forEach(function(client: any) {
            client.send(message);
        });
    }

    private joinGame(ws: any) {
        let id = this.addNewClient(ws);

        if (id != -1) {
            let joinedClients: Array<number> = [];

            this.clients.forEach(client => {
                joinedClients.push(client.getId());
            })

            let info = {
                "id": id,
                "clients": joinedClients
            };

            ws.send("JG|" + JSON.stringify(info));

            this.broadCastMessage("NU|" + JSON.stringify({"id": id}));
        } else {
            ws.terminate();
        }
    }

    private exitGame(data: any) {
        data = JSON.parse(data);
        let client = this.clients[data.id-1];

        if(client) {
            client.getWS().terminate();
            console.log("index of " + this.clients.indexOf(client));
            this.clients.splice(this.clients.indexOf(client), 1);

            let info = {
                id: data.id
            };

            this.broadCastMessage("CE|" + JSON.stringify(info));
            return;
        }
    }

    private processUserBet(data: any) {
        data = JSON.parse(data);
        let client = this.clients[data.id];

        if(client) {
            client.addBet(data.amount);

            let info = {
                id: data.id,
                amount: data.amount
            };

            this.broadCastMessage("BA|" + JSON.stringify(info));
        }
    }

    private processMessage(message: string, ws: any) {
        let prefix : string = message.split("|")[0];
        let data : string = message.split("|")[1];

        switch(prefix) {
            case "JN": this.joinGame(ws);
                break;
            case "AT": console.log(`Bet amount value is ${data}`);
                break;
            case "EX": this.exitGame(data);
                break;
            case "UB": this.processUserBet(data);
                break;
        }
    }
}
