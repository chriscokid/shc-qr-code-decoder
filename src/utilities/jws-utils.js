

import zlib from "zlib";
import jose from "node-jose";

//Extracts the JWS from a SHC string
export function parseJWSFromQRString(shcString) {
    if (shcString == null || shcString == undefined)
        return null;
    try {
        //Extract the string after SHC
        let shcPayload = shcString.replace("shc:/", "");

        let result = "";
        for (let i = 0; i < shcPayload.length - 1; i = i + 2) {

            //Group the number by a group of two as string
            let groupOfTwoNumber = shcPayload[i] + shcPayload[i + 1];

            //Parse them to int and adds 45 (because why not -_-' ...)
            let parsedInt = parseInt(groupOfTwoNumber, 10) + 45;

            //Convert the resulting number to UTF-16 string, and adds this to the result string
            result += String.fromCharCode(parsedInt);
        }
        return result;
    } catch {
        return null;
    }
}

//Given a JWS, extracts and decompress the payload (authenticity not verified here)
export async function decompressJWSPayload(jws) {
    try {
        //Take the second part of the JWS (payload)
        const payload = jws.split(".")[1];
        const decodedPayload = Buffer.from(payload, "base64");
        
        //Decompress using zlib (async overlay)
        let result = await new Promise((resolve, reject) => {
            zlib.inflateRaw(decodedPayload, (err, res) => {
                result = res;
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        
        //Otherwise returns the decoded json result 
        return result.toString("utf8");
    } catch {
        return null;
    }
}

//The public key against which the JWS will be verified
export const publicKey = {
    kid: "akid",
    alg: "ES256",
    kty: "EC",
    crv: "P-256",
    use: "sig",
    x: "XSxuwW_VI_s6lAw6LAlL8N7REGzQd_zXeIVDHP_j_Do",
    y: "88-aI4WAEl4YmUpew40a9vq_w5OcFvsuaKMxJRLRLL0",
};

//Checks the authenticity of a JWS
export async function checkJWSAuthencity(jws) {
    try {
        const key = await jose.JWK.asKey(publicKey);
        const { verify } = jose.JWS.createVerify(key);
        //Launches the verification
        await verify(jws);
        return true;
    }
    catch {
        return false;
    }
}

//A class that represents a patient
export class Patient {
    constructor(birthDate, gender, familyName, givenName, vaccineEvents, patientRef) {
        this.birthDate = birthDate;
        this.gender = gender;
        this.familyName = familyName;
        this.givenName = givenName;
        this.vaccineEvents = vaccineEvents;
        this.patientRef = patientRef;
    }
}

//A class that represents the event of a vaccine
export class VaccineEvent {
    constructor(date, place, type, lotNumber, patientRef, doseNumber) {
        this.date = date;
        this.place = place;
        this.type = type;
        this.lotNumber = lotNumber;
        this.patientRef = patientRef;
        this.doseNumber = doseNumber;
    }
}

//Given a json payload of an vaccine entry, returns a VaccineEvent
function parseVaccineEvent(jsonPayload) {
    let location = jsonPayload.location?.display;
    let lotNumber = jsonPayload.lotNumber;
    let type = jsonPayload.note?.[0]?.text;
    let date = jsonPayload.occurrenceDateTime;
    let patientRef = jsonPayload.patient?.reference;
    let doseNumber = jsonPayload.protocolApplied?.doseNumber;
    return new VaccineEvent(date, location, type, lotNumber, patientRef, doseNumber);
}

//Given a json payload of an patient entry, returns a Patient
function parsePatient(jsonPayload) {
    let birthDate = jsonPayload.birthDate;
    let gender = jsonPayload.gender;
    let familyName = jsonPayload.name?.[0]?.family?.[0];
    let givenName = jsonPayload.name?.[0]?.given?.[0];
    let patient = new Patient(birthDate, gender, familyName, givenName, []);
    return patient;
}

//Given a decoded json payload, will parse the json into a more user friendly object for rendering
export function formatVaccineEntries(jsonPayload) {
    let patientList = [];
    let vaccinesList = [];

    //Ensure payload exists
    if (jsonPayload == null || jsonPayload.length == 0)
        return null;

    //Go through all the entries and format
    let index = 0;
    for (const entry of jsonPayload) {
        const resource = entry.resource;
        if (resource == null || resource == undefined)
            continue;

        if (resource.resourceType == "Immunization") {
            let vaccineEvent = parseVaccineEvent(resource);
            vaccinesList.push(vaccineEvent);
        }

        if (resource.resourceType == "Patient") {
            let patient = parsePatient(resource);
            patient.patientRef = "resource:" + index;
            patientList.push(patient);
        }
        index++;
    }

    //Then attaches each dose to a patient
    for (const vaccineEvent of vaccinesList) {
        const patientFound = patientList.find(patient => patient.patientRef == vaccineEvent.patientRef);
        if (patientFound != null)
            patientFound.vaccineEvents.push(vaccineEvent);
    }

    //Finally returns the patients and their vaccines together
    return patientList;
}
