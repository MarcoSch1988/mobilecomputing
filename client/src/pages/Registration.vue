<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-form
          ref="signUpForm"
          class="q-px-sm q-pt-lg q-pb-xs row items-start"
        >
          <q-input
            v-model="registrationData.username"
            square
            style="width:100%"
            type="text"
            label="Benutzername"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            v-model="registrationData.firstname"
            square
            style="width:100%"
            type="text"
            label="Vorname"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            v-model="registrationData.surname"
            square
            style="width:100%"
            type="text"
            label="Nachname"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            v-model="registrationData.plz"
            square
            style="width:33%"
            class="q-mr-sm"
            type="text"
            label="PLZ"
          >
            <template v-slot:prepend>
              <q-icon name="location_on" />
            </template>
          </q-input>
          <q-input
            v-model="registrationData.city"
            square
            type="text"
            label="Ort"
          >
            <template v-slot:prepend>
              <q-icon name="location_on" />
            </template>
          </q-input>
          <q-input
            v-model="registrationData.street"
            square
            style="width:100%"
            type="text"
            label="Straße + Nr."
          >
            <template v-slot:prepend>
              <q-icon name="location_on" />
            </template>
            <template v-slot:append>
              <q-btn round dense icon="gps_fixed" @click="searchAddress()" />
            </template>
          </q-input>
          <q-list bordered separator>
            <div v-for="address in addressPrediction" :key="address.place_id">
              <q-item
                v-if="addressPrediction.length > 1"
                clickable
                dense
                @click="setLocation(address.lat, address.lon)"
              >
                <!-- <q-item-section
                >{{ address.address.road }} {{ address.address.house_number }},
                {{ address.address.postcode }}
                {{ address.address.city }}, {{ address.address.country }}
                </q-item-section>-->
                <!-- <q-item-section side top>
                  OK
                </q-item-section>-->
                <q-item-section class="text-caption">
                  {{ address.display_name }}
                </q-item-section>
              </q-item>
            </div>
          </q-list>
          <div id="map" style="width: 100%; height:200px"></div>
          <div class="text-center text-caption fit text-grey-6">
            Latitude: {{ latitude }} - Longitude: {{ longitude }}
          </div>
          <div
            class="text-center fit text-primary text-body2 text-weight-medium"
          >
            Bitte platzieren Sie den Marker
            <img src="../statics/marker-icon.png" style="height:1em" /> direkt
            auf Ihren Wohnort
          </div>
          <q-input
            v-model="registrationData.password"
            square
            style="width:100%"
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
            v-model="registrationData.passwordRepeat"
            square
            style="width:100%"
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
            v-if="registrationErrorMessage != ''"
            class="text-red"
            style="text-align: center"
          >
            {{ registrationErrorMessage }}
          </p>
          <p
            v-if="registrationSuccessful === true"
            class="text-green"
            style="text-align: center"
          >
            Registration successful
          </p>

          <q-btn
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="Register"
            @click="signUp()"
          />
          <q-btn
            class="full-width q-mt-md"
            flat
            color="grey"
            label="Return to Login"
            to="/login"
          />
        </q-form>
        <q-img src="../statics/friends.svg" />
        <!-- class="footerback" -->
      </div>
    </div>
  </q-page>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;

/* eslint-disable */
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
/* eslint-enable */

let map = "";
let marker = "";

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
      addressPrediction: "",
      latitude: 47.07088179, //Graz Hauptplatz
      longitude: 15.43822646, //Graz Hauptplatz
      registrationErrorMessage: "",
      registrationSuccessful: false,
      isPasswordVisible: false
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    signUp() {
      this.$refs.signUpForm.validate().then(isValid => {
        if (isValid === true) {
          this.$mainStore.user
            .register({
              ...this.registrationData,
              latitude: this.latitude,
              longitude: this.longitude
            })
            .then(() => {
              //No Problem during registration
              this.registrationErrorMessage = "";
              this.registrationSuccessful = true;
              setTimeout(() => {
                this.$router.push("/login");
              }, 1500);
            })
            .catch(err => {
              console.log(err);
              this.registrationErrorMessage = err.message;
            });
        }
      });
    },
    setLocation(latidude, longitude) {
      marker.closePopup();
      map.setView([latidude, longitude], 18);
      marker.setLatLng([latidude, longitude]);
      this.latitude = parseFloat(latidude).toFixed(8);
      this.longitude = parseFloat(longitude).toFixed(8);
    },

    searchAddress() {
      if (
        this.registrationData.street.length < 1 ||
        this.registrationData.city.length < 1 ||
        this.registrationData.plz.length < 1
      ) {
        return;
      }

      var url =
        "https://nominatim.openstreetmap.org/search?format=json&limit=3&addressdetails=1&q=" +
        this.registrationData.street +
        "," +
        this.registrationData.city +
        "," +
        "Österreich";

      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          this.addressPrediction = data;
          this.setLocation(data[0].lat, data[0].lon);
        })
        .catch(err => {
          console.log("Something went wrong!", err);
        });
    },
    loadMap() {
      var options = {
        center: [this.latitude, this.longitude],
        zoom: 9,
        preferCanvas: true
      };
      map = L.map("map", options);
      var nzoom = 12;

      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: "OSM"
      }).addTo(map);

      marker = L.marker([this.latitude, this.longitude], {
        title: "Coordinates",
        alt: "Coordinates",
        draggable: true
      });

      marker.on("dragend", () => {
        var lat = marker.getLatLng().lat.toFixed(8);
        var lon = marker.getLatLng().lng.toFixed(8);
        var czoom = map.getZoom();
        if (czoom < 18) {
          nzoom = czoom + 2;
        }
        if (nzoom > 18) {
          nzoom = 18;
        }
        if (czoom != 18) {
          map.setView([lat, lon], nzoom);
        } else {
          map.setView([lat, lon]);
        }
        this.latitude = lat;
        this.longitude = lon;
        // myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon).openPopup();
      });
      marker.addTo(map);
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
