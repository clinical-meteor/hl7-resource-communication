

Meteor.methods({
  createCommunication:function(communicationObject){
    check(communicationObject, Object);

    //if (process.env.NODE_ENV === 'test') {
      process.env.DEBUG && console.log('-----------------------------------------');
      process.env.DEBUG && console.log('Creating Communication...');
      Communications.insert(communicationObject, function(error, result){
        if (error) {
          console.log(error);
          if (typeof HipaaLogger === 'object') {
            HipaaLogger.logEvent({
              eventType: "error",
              userId: Meteor.userId(),
              userName: Meteor.user().fullName(),
              collectionName: "Communications"
            });
          }
        }
        if (result) {
          console.log('Communication created: ' + result);
          if (typeof HipaaLogger === 'object') {
            HipaaLogger.logEvent({
              eventType: "create",
              userId: Meteor.userId(),
              userName: Meteor.user().fullName(),
              collectionName: "Communications"
            });
          }
        }
      });
    // } else {
    //   console.log('This command can only be run in a test environment.');
    //   console.log('Try setting NODE_ENV=test');
    // }
  },
  initializeCommunication:function(){
    if (Communications.find().count() === 0) {
      console.log('-----------------------------------------');
      console.log('No records found in Communications collection.  Lets create some...');

      var defaultCommunication = {
        "resourceType": "Communication",
        "id": "example",
        "text": {
          "status": "generated",
          "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Blank Communication</div>"
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
        "partOf": {
            "display": "Serum Potassium Observation"
        },
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
          "reference": "Practitioner/cuddy"
        },
        "recipient": [
          {
            "reference": "Practitioner/house"
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

      Meteor.call('createCommunication', defaultCommunication);
    } else {
      console.log('Communications already exist.  Skipping.');
    }
  },
  'Communications/drop': function(){
    console.log('Removing all records from Communications cursor.');

    Communications._collection.find().forEach(function(message){
      Communications._collection.remove({_id: message._id});
    })
    Communications.find().forEach(function(message){
      Communications.remove({_id: message._id});
    })

  }
});
