<template>
  <div>
    <div id="pdfContainer" class="pdf-container">
      <pdf ref="pdfCanvas" @loaded="pdfLoaded" :src="pdfUrl"></pdf>
    </div>
    <v-container fluid>
      <v-col cols="12" md="12" v-if="!cameraRunning"
        ><h3>{{ $t("startupGuide") }}</h3></v-col
      >
      <v-row>
        <v-col
          cols="12"
          :md="latestEntries.length != 0 || cameraRunning ? 6 : 12"
          class="d-flex align-stretch"
        >
          <div class="video-container d-flex align-stretch">
            <div
              class="video-stream theme--light v-sheet--outlined"
              id="qrVideo"
            >
              <qrcode-stream
                v-if="cameraRunning"
                :track="paintQROutline"
                @init="onCameraInit"
                @decode="handleQRCode"
              >
                <div class="camera-button-group">
                  <v-btn class="mx-2" fab dark small @click="stopCamera()">
                    <v-icon dark> mdi-menu-left </v-icon>
                  </v-btn>
                </div>
                <div
                  class="d-flex align-center justify-center"
                  style="height: 100%"
                  v-if="cameraLoading"
                >
                  <v-progress-circular
                    indeterminate
                    class="ml-5"
                    color="primary"
                  ></v-progress-circular>
                </div>
              </qrcode-stream>
            </div>
            <div class="center-full" v-if="!cameraRunning">
              <v-btn
                v-if="!cameraRunning"
                outlined
                block
                class="text--center"
                rounded
                color="green"
                @click="setupCamera()"
                >{{ $t("startCameraToReadQRCode") }}</v-btn
              >
              <div class="mt-5 mb-5 text-center">{{ $t("or") }}</div>
              <v-file-input
                outlined
                dense
                rounded
                v-model="manualQrImport"
                @change="onManualFileUpload()"
                accept="application/pdf, image/*"
                :label="$t('loadQRData')"
              ></v-file-input>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          :md="latestEntries.length != 0 || cameraRunning ? 6 : 12"
          id="#results"
        >
          <VaccinePatient
            v-if="latestEntries.length != 0"
            :patients="latestEntries"
            :rawData="latestEntriesRaw"
            :dataValidated="dataValidated"
          />
          <div
            v-else-if="cameraRunning && latestEntries.length == 0"
            class="fill-height"
          >
            <v-card
              class="justify-center align-center fill-height d-flex"
              outlined
            >
              {{ $t("waitingQRCode") }}
              <v-progress-circular
                indeterminate
                class="ml-5"
                color="primary"
              ></v-progress-circular>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script src="./CovidReader.js"></script>

<style lang="scss">
@import "../style.scss";
</style>