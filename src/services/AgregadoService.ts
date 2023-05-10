import { singleton } from 'tsyringe';
import ApiException from '../exceptions/ApiExeption';
import { AgregadoModel } from '../global/types';
import BaseService from './BaseService';
import Agregado from '../models/Agregado';


@singleton()
class AgregadoService extends BaseService {
	constructor() {
		super();
	}

	async createAgregado(agregado: AgregadoModel) {
		try {
            await Agregado.createAgregado(agregado)
			return { error: false };
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

	async updateAgregado(agregadoId, agregado: AgregadoModel) {
		try {
            await Agregado.updateAgregado({agregadoId, agregado})
			return { error: false };
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

	async getAllAgregado() {
		try {	
            const agregados = await Agregado.getAllAgregado()
			return agregados;
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

}

export default AgregadoService;