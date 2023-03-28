require('dotenv').config();

const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const { ClientSecretCredential } = require("@azure/identity");

const credential = new ClientSecretCredential(process.env.MICROSOFT_TENANT_ID,process.env.MICROSOFT_CLIENT_ID,process.env.MICROSOFT_CLIENT_SECRET_ID);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });

    const graph = Client.initWithMiddleware({
        debugLogging: true,
        authProvider
    });


module.exports = graph