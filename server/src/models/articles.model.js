// articles-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const uuid = require("uuid");

module.exports = function (app) {
  const modelName = "articles";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      _id: { type: String, unique: true, default: uuid.v4() },
      ordererId: { type: Schema.Types.ObjectId, ref: "users" },
      buyerId: { type: Schema.Types.ObjectId, ref: "users", default: null },
      boughtAt: { type: Date, default: null },
      status: { type: String, required: true, default: "open" },
      text: { type: String, required: true },
    },
    {
      timestamps: true,
      minimize: false, //To include the empty fields like 'boughtAt' and 'buyerId'...otherwise patch would not work later
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
