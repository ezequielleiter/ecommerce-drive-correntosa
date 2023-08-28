import { truncate } from 'fs/promises';
import mongoose, { Schema, model, Document } from 'mongoose';
import { ProductorModel } from '../global/types';

interface BaseProductorDocument extends ProductorModel, Document {}

const Productor = new Schema<BaseProductorDocument>({
	name: { type: 'string' },
	picture: { type: 'string' },
	tags: { type: [] },
	description: { type: 'string' },
	contact: { 
        email: { type: 'string' }, 
        telefono: { type: 'string' }, 
        direccion: { type: 'string' } 
    }
});

Productor.statics.createProductor = async function (productor: ProductorModel) {
	await this.create(productor);
};

Productor.statics.updateProductor = async function ({productorId, productor} : {productorId: {}, productor: ProductorModel}) {
	const updateProductor = await this.findByIdAndUpdate(productorId, productor, { new: true });
	return updateProductor;
};

Productor.statics.getAllProductor = async function () {	
	const allProductores = await this.find({});
	return allProductores
};
if (!mongoose.models.Productor) {
	model<BaseProductorDocument>('Productor', Productor);
}

export default mongoose.models.Productor;
