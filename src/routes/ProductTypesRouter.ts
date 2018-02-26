import {Router, Request, Response, NextFunction} from 'express';
import { ProductType } from './../models/ProductType';
import App from '../App';

export class ProductTypeRouter {

    public router: Router;
    private app: App;

    constructor(app:App) {
        this.app = app;
        this.router = Router();
        this.init();
    }   

    public createType(req: Request, res: Response, next: NextFunction) {

        if (!req.body.description)
            return res.status(400).send();

        let productType = new ProductType(req.body.description);
        this.app.db.get('ProductType').push(productType).write();

        return res.json(productType);
    }

    public getType(req: Request, res: Response, next: NextFunction) {

        let productType = this.app.db.get('ProductType').find({ id: req.params.id }).value();
        if (productType) 
            return res.json(productType);
        else
            return res.status(404).send();
    }

    public updateType(req: Request, res: Response, next: NextFunction) {

        if (!req.body.description)
            return res.status(400).send();

        let productType = this.app.db.get('ProductType').find({ id: req.params.id }).value();

        if (productType) {
            productType = this.app.db.get('ProductType').find({ id: req.params.id }).assign({ description:  req.body.description}).value();
            return res.json(productType);
        }
        else
            return res.status(404).send();

    }

    public deleteType(req: Request, res: Response, next: NextFunction) {

        let productType = this.app.db.get('ProductType').find({ id: req.params.id }).value();
        if (productType) {
            this.app.db.get('ProductType').remove({ id: req.params.id }).write();
            return res.json(productType);
        }
        else
            return res.status(404).send();
    }
   
    public getAll(req: Request, res: Response, next: NextFunction) {        
        res.json(this.app.db.get('ProductType').value());
    }    

    init() {
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getType.bind(this));
        this.router.post('/', this.createType.bind(this));
        this.router.put('/:id', this.updateType.bind(this));
        this.router.delete('/:id', this.deleteType.bind(this));
    }   
}