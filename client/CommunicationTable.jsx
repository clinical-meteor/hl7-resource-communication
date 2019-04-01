import Avatar from 'material-ui/Avatar';
import { FlatButton, RaisedButton } from 'material-ui';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';

import { get } from 'lodash';
// import { Communications } from 'meteor/clinical:hl7-resource-communication';

export default class CommunicationTable extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px'
        },
        cell: {
          paddingTop: '16px'
        },
        avatar: {
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      communications: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    data.communications = Communications.find(query, options).map(function(communication){
      let result = {
        _id: communication._id,
        subject: '',
        subjectReference: '',
        recipient: '',
        identifier: '',
        telecom: '',
        sent: '',
        received: '',
        category: '',
        payload: '',
        status: ''
      };

      if(get(communication, 'sent')){
        result.sent = moment(get(communication, 'sent')).add(1, 'days').format("YYYY-MM-DD")
      }
      if(get(communication, 'received')){
        result.received = moment(get(communication, 'received')).add(1, 'days').format("YYYY-MM-DD")
      }

      let telecomString = "";
      if(get(communication, 'recipient.reference')){
        if(get(communication, 'recipient.reference').split("/")[1]){
          telecomString = get(communication, 'recipient.reference').split("/")[1];
        }
      }


      result.subject = get(communication, 'subject.display') ? get(communication, 'subject.display') : get(communication, 'subject.reference')
      result.recipient = get(communication, 'recipient[0].display') ? get(communication, 'recipient[0].display') : get(communication, 'recipient[0].reference')
      result.identifier = get(communication, 'identifier[0].type.text');
      result.telecom = get(communication, 'telecom[0].value') ? get(communication, 'telecom[0].value') : telecomString;
      result.category = get(communication, 'category[0].text');
      result.payload = get(communication, 'payload[0].contentString');
      result.status = get(communication, 'status');

      return result;
    });

    if (Session.get('appWidth') < 768) {
      data.style.hideOnPhone.visibility = 'hidden';
      data.style.hideOnPhone.display = 'none';
      data.style.cellHideOnPhone.visibility = 'hidden';
      data.style.cellHideOnPhone.display = 'none';
    } else {
      data.style.hideOnPhone.visibility = 'visible';
      data.style.hideOnPhone.display = 'table-cell';
      data.style.cellHideOnPhone.visibility = 'visible';
      data.style.cellHideOnPhone.display = 'table-cell';
    }

    console.log('CommunicationTable.data', data)
    return data;
  }
  rowClick(id){
    Session.set('communicationsUpsert', false);
    Session.set('selectedCommunication', id);
    Session.set('communicationPageTabIndex', 2);
  }
  onSend(id){
      let communication = Communications.findOne({_id: id});

      console.log("CommunicationTable.onSend()", communication);

      var httpEndpoint = "http://localhost:8080";
      if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
        httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
      }
      HTTP.post(httpEndpoint + '/Communication', {
        data: communication
      }, function(error, result){
        if (error) {
          console.log("error", error);
        }
        if (result) {
          console.log("result", result);
        }
      });
  }
  sendCommunication(communication){
    console.log('sendCommunication', communication)

    // TODO:

    switch (get(communication, 'category')) {
      case 'SMS Text Message':
        console.log('Sending SMS Text Message', communication.payload, communication.telecom)
        Meteor.call('sendTwilioMessage', communication.payload, communication.telecom)
        break;    
      default:
        break;
    }
  }
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.communications.length; i++) {

      let sendButton;
      if(!get(this, 'data.communications[i].sent')){
        sendButton = <RaisedButton primary={false} label="Send" onClick={ this.sendCommunication.bind(this, this.data.communications[i]) } style={{marginTop: '-16px'}} />
      } else {
        sendButton = get(this, 'data.communications[i].sent');
      }
      tableRows.push(
        <tr key={i} className="communicationRow" style={{cursor: "pointer"}}>
          <td className='subject' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].subject }</td>
          <td className='recipient' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].recipient }</td>
          <td className='identifier' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].identifier }</td>
          <td className='telecom' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].telecom }</td>
          <td className='sent' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{ sendButton }</td>
          <td className='received' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].received }</td>
          <td className='category' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].category }</td>
          <td className='payload' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].payload }</td>
          <td className='status' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].status }</td>
        </tr>
      );
    }


    return(
      <Table id='communicationsTable' hover >
        <thead>
          <tr>
            <th className='subject'>subject</th>
            <th className='recipient'>recipient</th>
            <th className='identifier'>identifier</th>
            <th className='telecom'>telecom</th>
            <th className='sent' style={{minWidth: '100px'}}>sent</th>
            <th className='received' style={{minWidth: '100px'}}>received</th>
            <th className='category' style={this.data.style.hideOnPhone}>category</th>
            <th className='payload' style={this.data.style.hideOnPhone}>payload</th>
            <th className='status' style={this.data.style.hideOnPhone}>status</th>
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>

    );
  }
}


ReactMixin(CommunicationTable.prototype, ReactMeteorData);
