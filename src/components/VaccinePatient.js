import { publicKey } from "../utilities/jws-utils"

export default {
    name: 'VaccinePatient',
    data() {
        return {
            showRawDataDialog: false,
            showValidationDialog: false
        }
    },
    props: {
        patients: [],
        rawData: null
    },
    methods: {
    },
    computed:{
        publicKey(){
            return publicKey;
        }
    }
}