function isLoggedIn(to, from, next) {
  //Überprüfen ob ein JWT gestezt ist, also der Benutzer eingeloggt ist.
  //Sollte jemand einen ungültigen JWT erzeugen um ungültig Zugang zu erhalten,
  //erhält er vom Backend keine Daten --> Das hier ist also nicht wirklich zur Sicherheit
  //Sondern nur für den "komfort"
  if (localStorage.getItem("feathers-jwt") == null) {
    next({
      path: "/login",
      params: { nextUrl: to.fullPath }
    });
  } else {
    next();
  }
}

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Index.vue"),
        beforeEnter: isLoggedIn
      },
      {
        path: "/register",
        name: "register",
        component: () => import("pages/Registration.vue")
      },
      {
        path: "/login",
        name: "login",
        component: () => import("pages/Login.vue")
      },
      {
        path: "/checkout",
        name: "checkout",
        component: () => import("pages/Checkout.vue"),
        beforeEnter: isLoggedIn
      },
      {
        path: "/order",
        name: "order",
        component: () => import("pages/Order.vue"),
        beforeEnter: isLoggedIn
      },
      {
        path: "/shopping",
        name: "shopping",
        component: () => import("pages/Shopping.vue"),
        beforeEnter: isLoggedIn
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
