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
      authenticate("jwt"),

      hook => {
        if (hook.params._populate != undefined) {
          //Es handelt sich um einen Populate Zugriff --> Erlauben
          //console.log("Populate");
        } else {
          if (hook.params.authentication != undefined) {
            //Normaler Aufruf
            hook.params.query._id = hook.params.user._id;
            //console.log("Normal");
          } else {
            //Login Aufruf
            //console.log("Login");
          }
        }
      }
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
