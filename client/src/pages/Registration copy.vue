<template>
  <q-page class="flex flex-center q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-card square class="shadow-24">
          <q-card-section>
            <q-form class="q-px-sm q-pt-l q-pb-xs row items-start" ref="signUpForm">
              <!-- zu class hinzufügen für gewrappte elemente:  -->
              <q-input
                square
                clearable
                style="width:100%"
                v-model="registrationData.email"
                type="text"
                label="Benutzername"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                style="width:100%"
                v-model="registrationData.firstname"
                type="text"
                label="Vorname"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                style="width:100%"
                v-model="registrationData.surname"
                type="text"
                label="Nachname"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                style="width:33%"
                class="q-mr-sm"
                v-model="registrationData.plz"
                type="text"
                label="PLZ"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>
              <q-input square clearable v-model="registrationData.city" type="text" label="Ort">
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                style="width:100%"
                v-model="registrationData.street"
                type="text"
                label="Straße + Nr."
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>
              <q-input
                square
                style="width:100%"
                v-model="registrationData.password"
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
              <q-input
                square
                style="width:100%"
                v-model="registrationData.passwordRepeat"
                :type="isPasswordVisible ? 'text' : 'password'"
                label="Passwort*"
                :rules="[
                  value =>
                    value === registrationData.password ||
                    'Passwords müssen übereinstimmen'
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
          </q-card-section>
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
        <q-card-section class="text-center q-pa-m">
          <q-img src="../statics/friends.svg" />
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

<style lang="sass" scoped>
.footerback
  background: url(../statics/home.svg)
  opacity: 0.5
  width: 80%
  position: absolute
  background-repeat: no-repeat
  right: 10px
  bottom: 10px
  z-index: 500
  filter: alpha(opacity=25) progid:DXImageTransform.Microsoft.Alpha(opacity=25)
</style>