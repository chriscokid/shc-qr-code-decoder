<template>
  <v-app>
    <v-app-bar app color="secondary" dark dense>
      <div class="d-flex align-center">
        <font-awesome-icon
          icon="syringe"
          size="lg"
          transition="scale-transition"
          spin
          fixed-width
        />
        <div class="ml-3 text-sm-h6">CHECK MON VAX</div>
      </div>

      <v-spacer></v-spacer>

      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded class="px-8" dark v-bind="attrs" v-on="on">
              {{ $t($i18n.locale) }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item link v-for="(lang, index) in langs" :key="index">
              <v-list-item-title @click="$i18n.locale = lang">{{
                $t(lang)
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <CovidReader />
    </v-main>

    <v-footer color="secondary" padless>
      <v-row justify="center" no-gutters>
        <v-col class="pa-4 white--text" cols="12" md="9">
          <h3>{{ $t("privacySecurityNotice") }}:</h3>
          <ul>
            <li>
              <strong>{{ $t("securityNotice1") }}</strong>
            </li>
            <li>
              {{ $t("securityNotice2") }}
            </li>
            <li>
              {{ $t("securityNotice3") }}
            </li>
            <li>
              {{ $t("securityNotice4") }}
            </li>
          </ul>
        </v-col>
        <v-col class="pa-4 white--text" cols="12" md="3">
          <div>
            <a
              class="white--text"
              href="https://github.com/chriscokid/shc-qr-code-decoder"
              >{{ $t("sourceCode") }}</a
            >
          </div>
          <div><span class="text-decoration-underline">{{ $t("supportAndContact") }}:</span> contact@checkmonvax.net</div>
          <div class="mt-3">Proudly hosted on GitHub</div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import CovidReader from "./components/CovidReader.vue";

export default {
  name: "App",

  components: {
    CovidReader,
  },
  data() {
    return { langs: ["fr", "en"] };
  },
};
</script>
