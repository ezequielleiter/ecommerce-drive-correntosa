import { truncate } from 'fs/promises';
import mongoose, { Schema, model, Document } from 'mongoose';
import { AgregadoModel } from '../global/types';

interface BaseAgregadoDocument extends AgregadoModel, Document {}

const Agregado = new Schema<BaseAgregadoDocument>({
	name: { type: 'string' },
	value: { type: 'string' },
    type: {type: 'string'},
    discount: { type: 'boolean'}
});

Agregado.statics.createAgregado = async function (agregado: AgregadoModel) {
	await this.create(agregado);
};

Agregado.statics.updateAgregado = async function ({agregadoId, agregado} : {agregadoId: {}, agregado: AgregadoModel}) {
	const updateProductor = await this.findByIdAndUpdate(agregadoId, agregado, { new: true });
	return updateProductor;
};

Agregado.statics.getAllAgregado = async function () {	
	const allAgregado = await this.find({});
	return allAgregado
};
if (!mongoose.models.Agregado) {
	model<BaseAgregadoDocument>('Agregado', Agregado);
}

export default mongoose.models.Agregado;