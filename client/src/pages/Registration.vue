<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-form class="q-px-sm q-pt-lg q-pb-xs row items-start" ref="signUpForm">
          <!-- zu class hinzufügen für gewrappte elemente:  -->
          <q-input
            square
            clearable
            style="width:100%"
            v-model="registrationData.username"
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
          <q-btn
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="Register"
            @click="signUp()"
          />
          <q-btn class="full-width q-mt-md" flat color="grey" label="Return to Login" to="/login" />
        </q-form>
        <q-img src="../statics/friends.svg" />
        <!-- class="footerback" -->
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Registration",
  data() {
    return {
      registrationData: {
        username: "",
        firstname: "",
        surname: "",
        plz: "",
        city: "",
        street: "",
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
          this.$userStore.methods
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
    is3Chars(val) {
      return val.length >= 3 || "Must be at least 3 characters";
    }
  }
};
</script>

<style lang="sass" scoped>
.footerback
  opacity: 0.4
  width: 80%
  position: absolute
  left: 10%
  bottom: 10px
  background-repeat: no-repeat
  filter: alpha(opacity=25) progid:DXImageTransform.Microsoft.Alpha(opacity=25)
</style>