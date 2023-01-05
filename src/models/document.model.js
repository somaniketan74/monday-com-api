import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import mongooseHidden from 'mongoose-hidden';

const { Schema } = mongoose;
const documentSchema = new Schema(
  {
    userId: { type: String },
    url: { type: String },
    fileName: { type: String },
  },
  {
    timestamps: true,
  }
);

documentSchema.plugin(mongooseHidden(), { hidden: { _id: false } });
documentSchema.plugin(mongoosePaginate);
documentSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: ['find', 'findOne', 'countDocuments'],
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
