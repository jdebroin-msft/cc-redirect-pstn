import { CallAutomationClient, CallInvite } from "@azure/communication-call-automation";
import { CommunicationUserIdentifier } from "@azure/communication-common";
import express from "express";

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

const app = express();
app.use(express.json());

const port = 8080;
const acsConnectionString = process.env['ACS_CONNECTION_STRING']!;
const targetUserId = process.env['ACS_TARGET_USER_ID']!;
const client = new CallAutomationClient(acsConnectionString);

app.post( "/incomingcall", async ( req, res ) => {
    console.log( "incomingcall endpoint" );
    const event = req.body[0];
    const eventData = event.data;
  
    if (event.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent") {
      console.log("Received SubscriptionValidation event");
      res.status(200).send({ "ValidationResponse": eventData.validationCode });
    }
    
    if(eventData && event.eventType == "Microsoft.Communication.IncomingCall") {
        var incomingCallContext = eventData.incomingCallContext;
        let targetUser:CommunicationUserIdentifier = {communicationUserId:targetUserId};
        let callInvite:CallInvite = {targetParticipant:targetUser};
        console.log("Redirecting call to: " + targetUserId);
        await client.redirectCall(incomingCallContext, callInvite);

        res.sendStatus(200);
    }
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
