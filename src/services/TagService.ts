import { singleton } from 'tsyringe';
import ApiException from '../exceptions/ApiExeption';
import { TagModel } from '../global/types';
import BaseService from './BaseService';
import Tag from '../models/Tag';


@singleton()
class TagService extends BaseService {
	constructor() {
		super();
	}

	async createTag(tag: TagModel) {
		try {
            await Tag.createTag(tag)
			return { error: false };
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

	async updateTag(tagId, tag: TagModel) {
		try {
            await Tag.updateTag({tagId, tag})
			return { error: false };
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

	async getAllTag() {
		try {	
            const productores = await Tag.getAllTag()
			return productores;
		} catch (e) {
			console.log("ERROR", e);
			
			throw new ApiException(e);
		}
	}

}

export default TagService;