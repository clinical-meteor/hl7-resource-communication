


import CommunicationsPage from './client/CommunicationsPage';
import CommunicationTable from './client/CommunicationTable';

import { Communication, Communications, CommunicationSchema, CommunicationDstu2, CommunicationStu3 } from './lib/Communications';


var DynamicRoutes = [{
  'name': 'CommunicationPage',
  'path': '/communications',
  'component': CommunicationsPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Communications',
  'to': '/communications',
  'href': '/communications'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  CommunicationsPage,
  CommunicationTable,
  
  Communication,
  Communications,
  CommunicationSchema,
  CommunicationDstu2, 
  CommunicationStu3
};


