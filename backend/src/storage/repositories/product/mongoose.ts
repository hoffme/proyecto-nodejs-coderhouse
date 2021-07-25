import mongoose, { Schema } from 'mongoose';

import { Product } from '../../../core/product/model';

import ProductRepository, { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../../core/product/repository';
import MongooseSettings from '../../settings/mongoose';
import uuid from '../../utils/uuid';

class ProductMongooseRepository extends ProductRepository {

    private readonly settings: MongooseSettings;
    private readonly collectionName: string;
    private readonly schema: Schema<Product>;
    private readonly collection: mongoose.Model<Product>;

    constructor(settings: MongooseSettings) {
        super();

        this.settings = settings;
        this.collectionName = 'products';

        this.schema = new Schema<Product>({
            id: mongoose.Types.ObjectId,
            timestamp: Date,
            name: String,
            descrption: String,
            code: String,
            picture: String,
            price: Number,
            stock: Number
        });

        this.collection = mongoose.model(this.collectionName, this.schema);
    }

    async setup(): Promise<void> {
        await new Promise((resolve, reject) => {
            mongoose.connect(
                this.settings.uri, 
                this.settings.options,
                (err) => {
                    if (err) reject(err);
                    resolve(undefined);
                })
        })
    }

    async find(id: String): Promise<Product> {
        const product =  await this.collection.findById(id);
        if (!product) throw new Error("product not found");

        return product;
    }
    
    async search(filter: FilterProduct): Promise<Product[]> {
        let mongooseFilter: any = {};

        if (filter.ids) mongooseFilter.id = { $in: filter.ids };
        if (filter.name) mongooseFilter.name = filter.name;
        if (filter.code) mongooseFilter.code = filter.code;

        if (filter.price_min || filter.price_max) mongooseFilter.price = {}
        if (filter.price_min) mongooseFilter.price.gt = filter.price_min;
        if (filter.price_max) mongooseFilter.price.lt = filter.price_max;

        if (filter.stock_min || filter.stock_max || filter.stock_zero) mongooseFilter.stock = {}
        if (filter.stock_min) mongooseFilter.stock.gt = filter.stock_min;
        if (filter.stock_max) mongooseFilter.stock.lt = filter.stock_max;
        if (filter.stock_zero) mongooseFilter.stock.eq = 0;

        const products = await this.collection.find(mongooseFilter);
        return products;
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        const product: Product = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        const inserted = await this.collection.create(product);

        this.events.create.notify(product);

        return product;
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        const product = await this.find(id);

        await this.collection.updateOne({id}, {
            $set: { ...product, ...cmd },
        })

        this.events.update.notify(product);

        return product;
    }

    async delete(id: string): Promise<Product> {
        const product = await this.find(id);

        await this.collection.deleteOne({id});

        this.events.delete.notify(product);

        return product;
    }
}

export default ProductMongooseRepository;