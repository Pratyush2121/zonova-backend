import mongoose from 'mongoose';
import { getCollection } from './dataManager.js';
import { dbType } from '../config/db.js';

export const createModel = (modelName, mongooseSchema) => {
  let MongooseModel;
  
  // Define mongoose model safely
  try {
    MongooseModel = mongoose.model(modelName, mongooseSchema);
  } catch (error) {
    MongooseModel = mongoose.model(modelName);
  }
  
  const jsonCollection = getCollection(modelName.toLowerCase() + 's');

  return {
    find: async (query = {}) => {
      if (dbType === 'mongodb') {
        // Handle basic text search for regex in Mongoose
        return MongooseModel.find(query).sort({ createdAt: -1 }).lean();
      }
      return jsonCollection.find(query);
    },
    findOne: async (query = {}) => {
      if (dbType === 'mongodb') {
        return MongooseModel.findOne(query).lean();
      }
      return jsonCollection.findOne(query);
    },
    findById: async (id) => {
      if (dbType === 'mongodb') {
        return MongooseModel.findById(id).lean();
      }
      return jsonCollection.findById(id);
    },
    create: async (data) => {
      if (dbType === 'mongodb') {
        const item = new MongooseModel(data);
        const saved = await item.save();
        return saved.toObject();
      }
      return jsonCollection.create(data);
    },
    findByIdAndUpdate: async (id, data, options = { new: true }) => {
      if (dbType === 'mongodb') {
        const updated = await MongooseModel.findByIdAndUpdate(id, data, options).lean();
        return updated;
      }
      return jsonCollection.findByIdAndUpdate(id, data, options);
    },
    findByIdAndDelete: async (id) => {
      if (dbType === 'mongodb') {
        return MongooseModel.findByIdAndDelete(id).lean();
      }
      return jsonCollection.findByIdAndDelete(id);
    },
    countDocuments: async (query = {}) => {
      if (dbType === 'mongodb') {
        return MongooseModel.countDocuments(query);
      }
      return jsonCollection.countDocuments(query);
    },
    mongooseModel: MongooseModel,
    jsonCollection: jsonCollection
  };
};
