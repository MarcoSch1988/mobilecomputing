<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-form ref="signUpForm" class="q-px-sm q-py-l text-center">
          <img src="../statics/cart.svg" style="height:250px" class="q-my-md" />
          <q-input
            v-model="loginData.username"
            square
            clearable
            type="text"
            label="Benutzername"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            v-model="loginData.password"
            square
            class="q-py-lg"
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
            v-if="loginErrorMessage != ''"
            class="text-red"
            style="text-align: center"
          >
            {{ loginErrorMessage }}
          </p>
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
          <q-btn
            flat
            color="grey"
            class="full-width"
            label="Passwort vergessen"
          />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Registration",
  data() {
    return {
      loginData: {
        username: "",
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
          this.$mainStore.user
            .login(this.loginData)
            .then(() => {
              this.loginErrorMessage = "";
              this.$router.push("/");
            })
            .catch(err => {
              console.log(err);
              this.loginErrorMessage = "Login failed";
            });
        }
      });
    }
  }
};
</script>
