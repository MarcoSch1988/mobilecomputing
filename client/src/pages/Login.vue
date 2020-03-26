<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-form class="q-px-sm q-py-l text-center" ref="signUpForm">
          <img src="../statics/cart.svg" style="height:250px" class="q-my-md" />
          <q-input square clearable v-model="loginData.username" type="text" label="Benutzername">
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            square
            class="q-py-lg"
            v-model="loginData.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            label="Passwort"
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
          <p
            v-if="this.loginErrorMessage!=''"
            class="text-red"
            style="text-align: center"
          >{{loginErrorMessage}}</p>
          <q-btn
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="Einloggen"
            @click="login()"
          />

          <q-btn
            flat
            size="md"
            color="grey"
            class="full-width q-my-md"
            label="Beitreten"
            to="/register"
          />
          <br />
          <q-btn flat color="grey" class="full-width" label="Passwort vergessen" />
        </q-form>
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
