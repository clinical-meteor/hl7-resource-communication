import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';

import { get } from 'lodash';


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
        recipient: '',
        identifier: '',
        definition: '',
        sent: '',
        received: '',
        category: '',
        payload: ''
      };

      result.sent = moment(get(communication, 'sent')).add(1, 'days').format("YYYY-MM-DD")
      result.received = moment(get(communication, 'received')).add(1, 'days').format("YYYY-MM-DD")
      result.subject = get(communication, 'subject.display') ? get(communication, 'subject.display') : get(communication, 'subject.reference')
      result.recipient = get(communication, 'recipient[0].display') ? get(communication, 'recipient[0].display') : get(communication, 'recipient[0].reference')
      result.identifier = get(communication, 'identifier[0].type.text');
      result.definition = get(communication, 'definition[0].display');
      result.category = get(communication, 'category[0].text');
      result.payload = get(communication, 'payload[0].contentString');

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
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.communications.length; i++) {
      tableRows.push(
        <tr key={i} className="communicationRow" style={{cursor: "pointer"}}>
          <td className='subject' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].subject }</td>
          <td className='recipient' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].recipient }</td>
          <td className='identifier' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].identifier }</td>
          <td className='definition' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].definition }</td>
          <td className='sent' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].sent }</td>
          <td className='received' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].received }</td>
          <td className='category' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].category }</td>
          <td className='payload' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].payload }</td>
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
            <th className='definition'>definition</th>
            <th className='sent' style={{minWidth: '100px'}}>sent</th>
            <th className='received' style={{minWidth: '100px'}}>received</th>
            <th className='category' style={this.data.style.hideOnPhone}>category</th>
            <th className='payload' style={this.data.style.hideOnPhone}>payload</th>
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
