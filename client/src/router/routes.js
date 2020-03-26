import User from "../stores/userStore";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Index.vue")
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
        component: () => import("pages/Checkout.vue")
      },
      {
        path: "/createlist",
        name: "createlist",
        component: () => import("pages/CreateList.vue")
      },
      {
        path: "/shopping",
        name: "shopping",
        component: () => import("pages/Shopping.vue")
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
