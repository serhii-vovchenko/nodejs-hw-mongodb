import mongoose from 'mongoose';

import env from '../utils/env.js';

const initMongoConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const password = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`,
    );

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error with mongodb connection', error);
    throw new Error(error);
  }
};

export default initMongoConnection;

// `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`
// mongodb+srv://serhii_vovchenko:3Vkd3mwgxJN9dLhk@cluster0.tdao4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
