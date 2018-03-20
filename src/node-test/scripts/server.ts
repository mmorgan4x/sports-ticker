import * as  express from 'express';
let app = express();
let port = 80;

class Server {
    start() {
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });
        app.listen(port, () => {
            console.log(`[starting server on port ${port}]`);
        });
    }
}

export let server = new Server();