const { authenticate } = require("@feathersjs/authentication").hooks;
const { populate } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      populate({
        schema: {
          include: [
            {
              service: "users",
              nameAs: "orderer",
              parentField: "ordererId",
              childField: "_id"
            },
            {
              service: "users",
              nameAs: "buyer",
              parentField: "buyerId",
              childField: "_id"
            }
          ]
        }
      })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
