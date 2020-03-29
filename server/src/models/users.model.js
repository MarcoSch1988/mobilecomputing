// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const modelName = "users";
  const mongooseClient = app.get("mongooseClient");
  const schema = new mongooseClient.Schema(
    {
      username: { type: String, unique: true, lowercase: true, required: true },
      firstname: { type: String, required: true },
      surname: { type: String, required: true },
      plz: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      password: { type: String }
    },
    {
      timestamps: true
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
