<template>
  <q-page class="flex flex-center q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-card square class="shadow-24">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">Registration</h4>
            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
              <!-- <q-btn fab icon="close" color="purple-4" /> -->
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-l q-pb-lg" ref="signUpForm">
              <q-input
                square
                clearable
                v-model="registrationData.email"
                type="email"
                label="Email"
                :rules="[val=>!!val|| 'EMail is Missing', isValidEmail]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="registrationData.firstname"
                type="text"
                label="Vorname"
                :rules="[is3Chars]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="registrationData.surname"
                type="text"
                label="Nachname"
                :rules="[is3Chars]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="registrationData.company"
                type="text"
                label="Firma"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-input>
              <q-input
                square
                v-model="registrationData.password"
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
              <q-input
                square
                v-model="registrationData.passwordRepeat"
                :type="isPasswordVisible ? 'text' : 'password'"
                label="Repeat password"
                :rules="[
                  value =>
                    value === registrationData.password ||
                    'Passwords must match'
                ]"
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
            <p
              v-if="this.registrationErrorMessage!=''"
              class="text-red"
              style="text-align: center"
            >{{registrationErrorMessage}}</p>
            <p
              v-if="this.registrationSuccessful===true"
              class="text-green"
              style="text-align: center"
            >Registration successful</p>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="primary"
              class="full-width text-white"
              label="Register"
              @click="signUp()"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-m">
            <q-btn flat color="grey" label="Return to Login" to="/login" />
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
      registrationData: {
        email: "",
        firstname: "",
        surname: "",
        company: "",
        password: "",
        passwordRepeat: ""
      },
      registrationErrorMessage: "",
      registrationSuccessful: false,
      isPasswordVisible: false
    };
  },
  methods: {
    signUp() {
      this.$refs.signUpForm.validate().then(isValid => {
        if (isValid === true) {
          userStore.methods
            .register(this.registrationData)
            .then(response => {
              //No Problem during registration
              this.registrationErrorMessage = "";
              this.registrationSuccessful = true;
              setTimeout(() => {
                this.$router.push("/login");
              }, 2000);
            })
            .catch(err => {
              console.log(err);
              this.registrationErrorMessage = err.message;
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
