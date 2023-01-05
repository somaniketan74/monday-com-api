import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import mongooseHidden from 'mongoose-hidden';

const { Schema } = mongoose;
const settingSchema = new Schema(
  {
    userId: { type: String },
    url: { type: String },
    fileName: { type: String },
  },
  {
    timestamps: true,
  }
);

settingSchema.plugin(mongooseHidden(), { hidden: { _id: false } });
settingSchema.plugin(mongoosePaginate);
settingSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: ['find', 'findOne', 'countDocuments'],
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
