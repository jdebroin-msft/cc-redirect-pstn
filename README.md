# Synopsys

This test app can be used to redirect incoming PSTN calls to a phone number (set in the Event Subscription filter) to an ACS user (set in the application code).

# References

- https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/pstn-call?pivots=platform-web


# Install

```
npm install
```

# ACS resource

## Get the ACS Connection string using Azure Portal
- Go to ACS resource, Keys.
- Copy the Connection string.
```
export ACS_CONNECTION_STRING=<Connection string>
```

## OR get the ACS Connection string using Azure cli
```
apt install jq

ACS_SUBSCRIPTION="<ACS Subscription>"
RG=<ACS Resource group>
ACS=<ACS Resource name>

OUT=$(az communication list-key --name $ACS --resource-group $RG --subscription "$ACS_SUBSCRIPTION")

export ACS_CONNECTION_STRING=$(echo $OUT | jq -r '.primaryConnectionString')
```

## Get the To identity
- Go to ACS resource, Identities & User Access Tokens.
- Select Voice and video calling (VOIP) and click on Generate.
- Copy the ACS user id in Identity.
```
export ACS_TARGET_USER_ID=<ACS user id>
```

# Run

```
npm run build
node .
```

# Create a devtunnel

- Install Azure Dev tunnel.
- Start the tunnel:
```
devtunnel login
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```


## Setup WebHook filter
- Go to ACS resource, Events.
- Create an Event Subscription.
- Set the WebHook URL:
```
<devtunnel>/incomingcall
```
- Set the filter:
```
data.to.PhoneNumber.Value String begins with <Phone number>
```