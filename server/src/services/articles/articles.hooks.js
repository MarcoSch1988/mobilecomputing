const { authenticate } = require("@feathersjs/authentication").hooks;
const { populate } = require("feathers-hooks-common");
const { setField } = require("feathers-authentication-hooks");

const limitToUser = setField({
  from: "params.user._id",
  as: "params.query.ordererId"
});

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      limitToUser,
      hook => {
        hook.data.ordererId = hook.params.user._id;
      }
    ],
    update: [],
    patch: [
      hook => {
        if (hook.data.status === "closed") {
          hook.data.buyerId = hook.params.user._id;
          hook.data.boughtAt = new Date();
          // setField({
          //   from: "params.user._id",
          //   as: "params.data.buyerId"
          // });
          // setNow("boughtAt"); //entspricht params.data.boughtAt = new Date();
        }
      }
    ],
    remove: [limitToUser]
  },

  after: {
    all: [
      //TODO Nicht alle Benutzerdaten mitschicken
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
    find: [
      hook => {
        hook.result.data.forEach(item => {
          item.orderer.distance = distance(
            item.orderer.latitude,
            item.orderer.longitude,
            hook.params.user.latitude,
            hook.params.user.longitude,
            "m"
          );
          item.orderer.distance = Math.round(item.orderer.distance);
          //console.log(item.distance);
        });
        hook.result.data = hook.result.data.filter(
          item => item.orderer.distance <= 500
        );
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

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "m") {
      dist = dist * 1.609344 * 1000;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
