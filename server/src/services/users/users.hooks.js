const { authenticate } = require("@feathersjs/authentication").hooks;
const { setField } = require("feathers-authentication-hooks");

const {
  hashPassword,
  protect
} = require("@feathersjs/authentication-local").hooks;

const limitToUser = setField({
  from: "params.user._id",
  as: "params.query._id"
});

module.exports = {
  before: {
    all: [],
    find: [
      authenticate("jwt")
      //Problem: Ich wollte das Find auf den eigenen Benutzer beschränken -> Aber dann funktionieren die Populate hook nicht mehr
      // authenticate("jwt", {
      //   allowUnauthenticated: true
      // }),
      // context => {
      //   if (context.params.query.MsgToHook === "onlyLocation") {
      //     delete context.params.query.MsgToHook;
      //     context.params.MsgToAfterHook = "onlyLocation";
      //   } else {
      //     if (context.params.user == undefined) {
      //       //Es handelt sich um einen Login aufruf
      //     } else {
      //       //Es handelt sich um einen normalen Aufruf
      //       console.log("NORMALER AUFRUF");
      //       context.params.query._id = context.params.user._id;
      //     }
      //   }
      // }
    ],
    get: [authenticate("jwt")],
    create: [hashPassword("password")],
    update: [hashPassword("password"), authenticate("jwt")],
    patch: [hashPassword("password"), authenticate("jwt")],
    remove: [authenticate("jwt")]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
      protect("username")
    ],
    find: [
      hook => {
        if (hook.params.MsgToAfterHook === "onlyLocation") {
          let includedEntries = [];
          hook.result.data = hook.result.data.map(singleUser => {
            if (includedEntries[singleUser.street] == undefined) {
              includedEntries[singleUser.street] = 1;
              return singleUser.street;
            }
          });
          hook.result.data = hook.result.data.filter(x => !!x);
        }
      }
    ],
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
