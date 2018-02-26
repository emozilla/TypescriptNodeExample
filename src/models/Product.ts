import { ProductType } from './ProductType';
import { v4 as uuid } from 'uuid'

export class Product {

    private id: string = uuid();
    private name: string;
    private type: ProductType;
    
    constructor(name: string, type: ProductType) {
        this.name = name;
        this.type = type;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): ProductType {
        return this.type;
    }

}