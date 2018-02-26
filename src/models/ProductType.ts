import { v4 as uuid } from 'uuid'

export class ProductType {

    private id: string = uuid();
    private description: string;

    constructor(description: string) {
        this.description = description;
    }
    
    public getDescription(): string {
        return this.description;
    }
    
}