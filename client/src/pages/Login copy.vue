<template>
  <q-page class="flex flex-center q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-card-section>
          <q-card-section class="text-center q-mx-lg">
            <q-img src="../statics/cart.svg" />
          </q-card-section>
          <q-form class="q-px-sm q-py-l" ref="signUpForm">
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
            label="Einloggen"
            @click="login()"
          />
        </q-card-actions>
        <q-card-section class="text-center q-px-m">
          <q-btn flat size="md" color="grey" label="Beitreten" to="/register" />
        </q-card-section>
        <q-card-section class="text-center q-px-m">
          <q-btn flat color="grey" label="Passwort vergessen" />
        </q-card-section>
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
