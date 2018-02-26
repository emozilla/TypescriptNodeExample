import {Router, Request, Response, NextFunction} from 'express';
import { ProductType } from './../models/ProductType';
import { Product } from './../models/Product';
import * as _ from 'lodash';
import App from '../App';

export class ProductRouter {

    public router: Router;
    private app: App;

    constructor(app:App) {
        this.app = app;
        this.router = Router();
        this.init();
    }   

    public createProduct(req: Request, res: Response, next: NextFunction) {

        if (!req.body.name || !req.body.type)
            return res.status(400).send();

        let typeData = this.app.db.get('ProductType').find({ id: req.body.type }).value();

        // Product Type invalid
        if (!typeData) {
            return res.status(400).send("Type invalid");
        }
              
        let productType = Object.assign(new ProductType(""), typeData);
        let product = new Product(req.body.name, productType);
        this.app.db.get('Product').push(product).write();

        return res.json(product);
    }

    public updateProduct(req: Request, res: Response, next: NextFunction) {

        let productData = this.app.db.get('Product').find({ id: req.params.id }).value();

        if (productData) {

            if ((!req.body.name) && (!req.body.type))
                return res.status(400).json("No params");

            if (req.body.type) {

                let typeData = this.app.db.get('ProductType').find({ id: req.body.type }).value();

                // Product Type invalid
                if (!typeData) {
                    return res.status(400).json("Type invalid");
                }

                productData = this.app.db.get('Product').find({ id: req.params.id }).assign({ type:  req.body.type}).value();
            }
    
            if (req.body.name)
                productData = this.app.db.get('Product').find({ id: req.params.id }).assign({ name:  req.body.name}).value();

            return res.json(productData);
        }
        else
            return res.status(404).send();
    }

    public deleteProduct(req: Request, res: Response, next: NextFunction) {

        let product = this.app.db.get('Product').find({ id: req.params.id }).value();
        if (product) {
            this.app.db.get('Product').remove({ id: req.params.id }).write();
            return res.json(product);
        }
        else
            return res.status(404).send();
    }

    public getProduct(req: Request, res: Response, next: NextFunction) {

        let productData = this.app.db.get('Product').find({ id: req.params.id }).cloneDeep().value();
        
        if (productData) {

            if (req.body.deep) {
                if (req.body.deep === 1) {
                    let typeData = this.app.db.get('ProductType').find({ id: productData.type }).value();
                    if (typeData) productData.type = typeData;
                }
            }
            
            return res.json(productData);            
        }
        else return res.status(404).send();
    }
   
    public getAll(req: Request, res: Response, next: NextFunction) {

        let products = this.app.db.get('Product').value();    

        if ((req.query.page) && (req.query.size)) {
            let offset = (parseInt(req.query.page) - 1) * req.query.size;
            let size = offset + parseInt(req.query.size);
            let prods = _.slice(products, offset, size);
            return res.json(prods);
        }
        else return res.json(products);
    }    

    init() {
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getProduct.bind(this));
        this.router.post('/', this.createProduct.bind(this));
        this.router.put('/:id', this.updateProduct.bind(this));
        this.router.delete('/', this.deleteProduct.bind(this));

    }   
}