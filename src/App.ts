import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from "winston";
import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
import * as Memory from "lowdb/adapters/Memory";

import { ProductRouter } from './routes/ProductRouter';
import { ProductTypeRouter } from './routes/ProductTypesRouter';

class App {

    public express: express.Application;
    public db: any;

    constructor() {
        this.express = express();
        this.middleware();

        logger.configure({
            transports: [
                new logger.transports.Console({
                    colorize: true
                })
            ]
        });

        this.db = low(
            process.env.NODE_ENV === 'test'
              ? new Memory('db.json')
              : new FileSync('db.json')
        );        

        this.db.defaults({ Product:[], ProductType: [] }).write()
        this.routes();            
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.use('/products', new ProductRouter(this).router);
        this.express.use('/types', new ProductTypeRouter(this).router);
    }

}

export default App