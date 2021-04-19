const msal = require('@azure/msal-node');

const config = {
    auth: {
        clientId: process.env.AZ_APPLICATION_ID, //"Enter_the_Application_Id",
        authority: "https://login.microsoftonline.com/" + process.env.AZ_LOCATAIRE_ID,//"Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Id_here",
        clientSecret: process.env.AZ_SECRET //"Enter_the_Client_secret"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Info,
        }
    }
};

const cca = new msal.ConfidentialClientApplication(config);

module.exports = { cca };
