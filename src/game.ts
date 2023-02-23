const ws = require('ws');

export class Game {
    private playersMap: {[key: number]: string} = {};
    private wss: any = new ws.Server({port: 3080});

    constructor() {
        this.wss.on('connection', (ws: any) => {
            console.log('New client connected!'); 
        });
    }

    public joinGame(id: number) {
    }
}
