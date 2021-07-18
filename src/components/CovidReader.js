import jsQR from "jsqr";
import VaccinePatient from "./VaccinePatient.vue";
import { parseJWSFromQRString, decompressJWSPayload, formatVaccineEntries, checkJWSAuthencity } from "../utilities/jws-utils"
import { imageDataFromSource, getImageData } from "../utilities/image-utils"
import pdf from 'vue-pdf'
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
    name: 'CovidReader',
    data() {
        return {
            cameraRunning: false,
            cameraLoading: false,
            latestEntries: [],
            latestEntriesRaw: null,
            dataValidated: false,
            manualQrImport: null,
            pdfUrl: null
        }
    },
    components: {
        VaccinePatient,
        pdf,
        QrcodeStream
    },
    methods: {
        //A method to start the camera
        setupCamera() { this.cameraRunning = true; },
        stopCamera() {
            this.cameraRunning = false;
        },
        //Handles the QR code from imageData object (canvas generated image)
        handleQRFromImageData(imageData) {
            //Try to decode QR
            let qr = jsQR(
                new Uint8ClampedArray(imageData.data.buffer),
                imageData.width,
                imageData.height)

            if (qr == null || qr.data == null || qr == undefined || qr.data == undefined) {
                this.raiseError("invalidQRCode");
                return;
            }

            this.handleQRCode(qr.data);
        },
        //The function to load the proof of vaccination given an extracted SHC string of the form (shc://abc123)
        async handleQRCode(shcString) {
            //Try to get the jws from the decoded data
            let jws = parseJWSFromQRString(shcString);
            if (jws == null || jws == undefined) {
                this.raiseError("invalidQRCode");
                return;
            }

            //Try to decompress the jws into something that json can unparse
            let payload = await decompressJWSPayload(jws);
            if (payload == null || payload == undefined) {
                this.raiseError("invalidQRCode");
                return;
            }

            //Check the authenticity of the JWS
            if (!(await checkJWSAuthencity(jws))) {
                this.raiseError("authenticityCouldNotBeVerified");
                this.dataValidated = false;
                console.log("Could not validate the authenticity of the JWS against the public key");
            } else {
                this.dataValidated = true;
            }

            //Gather the entries
            const rawJson = JSON.parse(payload);
            this.latestEntriesRaw = rawJson;
            const entries = rawJson.vc.credentialSubject.fhirBundle.entry;

            //Format the results
            this.latestEntries = formatVaccineEntries(entries);
            this.scrollToResults();

            //Raise that the code is valid
            this.$toast(this.$t('validQRCode'), {
                timeout: 2000
            });
        },
        async scrollToResults() {
            //Wait a few for the vue to update
            await new Promise(r => setTimeout(r, 100));
            var div = document.getElementById('#results');
            div.scrollIntoView({ behavior: 'smooth', block: 'end' });
        },
        // Entrypoint to handle images and PDFs
        async onManualFileUpload() {
            if (this.manualQrImport == null || this.manualQrImport == undefined)
                return;

            //Create local URL object
            let imageUrl = URL.createObjectURL(this.manualQrImport);

            //Image handling
            if (this.manualQrImport.type.includes("image")) {
                let imageData = await imageDataFromSource(document, imageUrl);
                if (imageData != null && imageData != undefined)
                    await this.handleQRFromImageData(imageData);
            }
            //Pdf handling
            else if (this.manualQrImport.type.includes("application/pdf")) {
                this.pdfUrl = imageUrl;
            }
        },
        //Even trigerred when a PDF has been loaded
        async pdfLoaded() {
            let pdfRenderCanvas = document.getElementById('pdfContainer').querySelector('canvas');
            await new Promise(r => setTimeout(r, 300));
            let imageData = getImageData(pdfRenderCanvas);
            if (imageData != null && imageData != undefined)
                await this.handleQRFromImageData(imageData);
        },
        //Paints an outline of the view for the QR code
        paintQROutline(detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

                ctx.strokeStyle = "red";

                ctx.beginPath();
                ctx.moveTo(firstPoint.x, firstPoint.y);
                for (const { x, y } of otherPoints) {
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(firstPoint.x, firstPoint.y);
                ctx.closePath();
                ctx.stroke();
            }
        },
        raiseError(message) {
            this.$toast.error(this.$t(message), {
                timeout: 5000
            });
        },
        async onCameraInit(promise) {
            this.cameraLoading = true;
            try {
                await promise;
            } catch (error) {
                let err = "";
                if (error.name === 'NotAllowedError') {
                    err = "ERROR: you need to grant camera access permisson";
                } else if (error.name === 'NotFoundError') {
                    err = "ERROR: no camera on this device";
                } else if (error.name === 'NotSupportedError') {
                    err = "ERROR: secure context required (HTTPS, localhost)";
                } else if (error.name === 'NotReadableError') {
                    err = "ERROR: is the camera already in use?";
                } else if (error.name === 'OverconstrainedError') {
                    err = "ERROR: installed cameras are not suitable";
                } else if (error.name === 'StreamApiNotSupportedError') {
                    err = "ERROR: Stream API is not supported in this browser";
                }
                this.raiseError(err);
            }
            finally {
                this.cameraLoading = false;
            }
        },
        switchCamera() {
            switch (this.camera) {
                case 'front':
                    this.camera = 'rear'
                    break
                case 'rear':
                    this.camera = 'front'
                    break
            }
        },
    }
}