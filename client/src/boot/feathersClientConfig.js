import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from "@feathersjs/authentication-client";
import io from "socket.io-client";

const socket = io("http://localhost:3030");

const feathersClient = feathers()
  .configure(socketio(socket))
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

feathersClient.api = {
  user: feathersClient.service("users")
};

export default feathersClient;
