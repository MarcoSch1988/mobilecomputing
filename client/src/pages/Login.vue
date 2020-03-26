<template>
  <q-page class="flex flex-center q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-card square class="shadow-24">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">Login</h4>
            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
              <!-- <q-btn fab icon="close" color="purple-4" /> -->
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-py-l" ref="signUpForm">
              <q-input
                square
                clearable
                v-model="loginData.email"
                type="email"
                label="Email"
                :rules="[isValidEmail]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                square
                v-model="loginData.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                label="Password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-btn
                    round
                    dense
                    flat
                    tabindex="-1"
                    :icon="isPasswordVisible ? 'visibility' : 'visibility_off'"
                    @click="isPasswordVisible = !isPasswordVisible"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <p
            v-if="this.loginErrorMessage!=''"
            class="text-red"
            style="text-align: center"
          >{{loginErrorMessage}}</p>
          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="primary"
              class="full-width text-white"
              label="Login"
              @click="login()"
            />&nbsp;
            <q-btn
              unelevated
              size="lg"
              color="primary"
              class="full-width text-white q-pt-l"
              label="Go to Registration"
              to="/register"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-m">
            <q-btn flat color="grey" label="Forgot Password" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import userStore from "../stores/userStore";

export default {
  name: "Registration",
  data() {
    return {
      loginData: {
        email: "",
        password: ""
      },
      isPasswordVisible: false,
      loginErrorMessage: ""
    };
  },
  methods: {
    login() {
      this.$refs.signUpForm.validate().then(isValid => {
        if (isValid === true) {
          userStore.methods
            .login(this.loginData)
            .then(response => {
              this.loginErrorMessage = "";
              this.$router.push("/");
            })
            .catch(err => {
              console.log(err.message);
              this.loginErrorMessage = "Login failed";
            });
        }
      });
    },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    },
    is3Chars(val) {
      return val.length >= 3 || "Must be at least 3 characters";
    }
  }
};
</script>
