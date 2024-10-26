const getDb = require('../../util/mongodb').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, userId, _id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this._id = _id;
    }

    async save() {
        const db = getDb();
        try {
            if (this._id) {
                return await db
                .collection('products')
                .updateOne({
                     _id: new mongodb.ObjectId(this._id)
                    },
                    {
                        $set: this
                    });
            }
            return await db
            .collection('products')
            .insertOne(this);
        } catch (error) {
            console.log(error);
        }

    }

    static async fetchAll() {
        const db = getDb();
        try {
            const products = await db.collection('products').find().toArray();
            return products;
        } catch(error) {
            console.log(error);
        }
    }

    static async findById(prodId) {
        const db = getDb();

        try {
            const product = await db.collection('products').find({_id: new mongodb.ObjectId(prodId) }).next();
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteById(prodId) {
        const db = getDb();

        try {
            await db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)});
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Product;