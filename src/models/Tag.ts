import { truncate } from 'fs/promises';
import mongoose, { Schema, model, Document } from 'mongoose';
import { TagModel } from '../global/types';

interface BaseTagDocument extends TagModel, Document {}

const Tag = new Schema<BaseTagDocument>({
	name: { type: 'string' },
	description: { type: 'string' },
    color: {type: 'string'}
});

Tag.statics.createTag = async function (tag: TagModel) {
	await this.create(tag);
};

Tag.statics.updateTag = async function ({tagId, tag} : {tagId: {}, tag: TagModel}) {
	const updateTag = await this.findByIdAndUpdate(tagId, tag, { new: true });
	return updateTag;
};

Tag.statics.getAllTag = async function () {	
	const allTags = await this.find({});
	return allTags
};
if (!mongoose.models.Tag) {
	model<BaseTagDocument>('Tag', Tag);
}

export default mongoose.models.Tag;