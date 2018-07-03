##  cllinical:hl7-resource-communication   


#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### Integration & Verification Tests  

[![CircleCI](https://circleci.com/gh/clinical-meteor/hl7-resource-communication/tree/master.svg?style=svg)](https://circleci.com/gh/clinical-meteor/hl7-resource-communication/tree/master)


#### API Reference  

This package implements the FHIR Communication resource schema provided at [https://www.hl7.org/fhir/DSTU2/communication.html](https://www.hl7.org/fhir/DSTU2/communication.html).



--------------------------------------------  
#### Installation  

```bash
meteor add dpdonohue:hl7-resource-communication
```

You may also wish to install the `autopublish` package, which will set up a default publication/subscription of the Communications collection for logged in users.  You will need to remove the package before going into production, however.

```bash
meteor add clinical:autopublish  
```


--------------------------------------------  
#### Example    

```js
//copied from https://www.hl7.org/fhir/communication-example.json.html
var newCommunication = {
  "resourceType": "Communication",
  "id": "example",
  "text": {
    "status": "generated",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Patient has very high serum potassium</div>"
  },
  "identifier": [
    {
      "type": {
        "text": "Paging System"
      },
      "system": "urn:oid:1.3.4.5.6.7",
      "value": "2345678901"
    }
  ],
  "definition": [
    {
      "display": "Hyperkalemia"
    }
  ],
  "partOf": [
    {
      "display": "Serum Potassium Observation"
    }
  ],
  "status": "completed",
  "category": [
    {
      "coding": [
        {
          "system": "http://acme.org/messagetypes",
          "code": "Alert"
        }
      ],
      "text": "Alert"
    }
  ],
  "medium": [
    {
      "coding": [
        {
          "system": "http://hl7.org/fhir/v3/ParticipationMode",
          "code": "WRITTEN",
          "display": "written"
        }
      ],
      "text": "written"
    }
  ],
  "subject": {
    "reference": "Patient/example"
  },
  "recipient": [
    {
      "reference": "Practitioner/example"
    }
  ],
  "context": {
    "reference": "Encounter/example"
  },
  "sent": "2014-12-12T18:01:10-08:00",
  "received": "2014-12-12T18:01:11-08:00",
  "sender": {
    "reference": "Device/f001"
  },
  "payload": [
    {
      "contentString": "Patient 1 has a very high serum potassium value (7.2 mmol/L on 2014-Dec-12 at 5:55 pm)"
    },
    {
      "contentReference": {
        "display": "Serum Potassium Observation"
      }
    }
  ]
};

Communications.insert(newCommunication);
```

--------------------------------------------  
#### Extending the Schema  

If you have extra fields that you would like to attach to the schema, extend the schema like so:  

```js
ExtendedCommunicationSchema = new SimpleSchema([
  CommunicationSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Communications.attachSchema( ExtendedCommunicationSchema );
```

--------------------------------------------  
#### Initialize a Sample Communication  

Call the `initializeCommunication` method to create a sample communication in the Communications collection.

```js
Meteor.startup(function(){
  Meteor.call('initializeCommunication');
})
```
--------------------------------------------  
#### Server Methods  

This package supports `createCommunication`, `initializeCommunication`, and `dropCommunication` methods.

--------------------------------------------  
#### REST API Points    

This package supports the following REST API endpoints.  All endpoints require an OAuth token.  

```
GET    /fhir-1.6.0/Communication/:id    
GET    /fhir-1.6.0/Communication/:id/_history  
PUT    /fhir-1.6.0/Communication/:id  
GET    /fhir-1.6.0/Communication  
POST   /fhir-1.6.0/Communication/:param  
POST   /fhir-1.6.0/Communication  
DELETE /fhir-1.6.0/Communication/:id
```

If you would like to test the REST API without the OAuth infrastructure, launch the app with the `NOAUTH` environment variable, or set `Meteor.settings.private.disableOauth` to true in you settings file.

```bash
NOAUTH=true meteor
```

--------------------------------------------  
#### Conformance Statement  

TBD.


--------------------------------------------  
#### Acknowledgements     

Many thanks to Dr. David Donohue for sponsoring this package.  