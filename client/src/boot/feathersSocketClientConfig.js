import feathers from "@feathersjs/feathers";

import auth from "@feathersjs/authentication-client";

//SOCKET.io
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
const socket = io("http://localhost:3030");

//REST Client
// import rest from "@feathersjs/rest-client";
// const restClient = rest("http://localhost:3030");

const feathersSocketClient = feathers()
  .configure(socketio(socket))
  //.configure(restClient.fetch(window.fetch))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        // async context => {
        //   console.log(context);
        //   return context;
        // }
      ]
    }
  });
// .hooks({
//   before: {
//     all: [
//       iff(
//         context => ['create', 'update', 'patch'].includes(context.method),
//         discard('__id', '__isTemp')
//       )
//     ]
//   }
// })

feathersSocketClient.api = {
  user: feathersSocketClient.service("users")
};

export default feathersSocketClient;
