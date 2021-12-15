import React, { Component } from 'react';

import { WindowManager, ApplicationManager } from '@knossys/knossys-window-manager';
import { KnossysInfoPanel, KButton } from '@knossys/knossys-ui-core';
import { Desktop } from '@knossys/knossys-virtual-desktop';

import { RiStackshareLine } from 'react-icons/ri';
import { VscFileSubmodule } from 'react-icons/vsc';
import { MdPermIdentity } from 'react-icons/md';

import KAuthenticationManager from './components/KAuthenticationManager';
import KnossysCredentialList from './components/KnossysCredentialList';
import KFileManager from './components/KFileManager';

import '../css/main.css';
import '../css/drydock.css';

/**
 * 
 */
class DryDock extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.appManager=new ApplicationManager ();
    this.authenticationManager=new KAuthenticationManager ();
    this.authenticationManager.setAuthUpdater (this);

    this.state = {
      globalSettings: {}
    }

    this.faces=[<RiStackshareLine/>,<VscFileSubmodule/>, <MdPermIdentity />];

    this.state={
      apps: [{
          label : "Pipeliner",
          id: "pipeliner",
          type: "knossys:application",
          face: 0,
          multiple: false
        },{
          label : "File Mananger",
          id: "fmanager",
          type : "knossys:application",
          face: 1,
          multiple: true
        },{
          label : "Credentials",
          id: "credentials",
          type : "knossys:application",
          face: 2,
          multiple: false
        }
      ]
    };

    this.launch = this.launch.bind(this);        
    this.updateWindowStack=this.updateWindowStack.bind (this);    
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    this.appManager.addApplication ({
      title: "Knossys Cloud File Manager",
      type: "window",
      width: 929,
      height: 662,
      window: <KFileManager authenticator={this.authenticationManager} />
    });

    this.appManager.addApplication ({
      title: "Credential Manager",
      type: "window",
      width: 200,
      height: 150,
      window: <KnossysCredentialList authenticator={this.authenticationManager} />
    });

    this.updateWindowStack ();
  }

  /**
   * This will go into the app manager
   */
  updateWindowStack () {
    this.setState(this.state);
  }    

  /**
   * 
   */
  update () {
    this.updateWindowStack ();
  }

  /**
   *
   */
  launch (anApp) {
    console.log ("launch ("+anApp+")");

    this.appManager.addApplication ({
      title: "Knossys Cloud File Manager",
      type: "window",
      width: 929,
      height: 662,
      window: <KFileManager authenticator={this.authenticationManager} />
    });
  }

  /**
   *
   */
  render() {
    return (
      <Desktop icons={this.state.apps} faces={this.faces} snap={true} launch={this.launch}>
             
        <WindowManager 
          settings={this.state.globalSettings}
          appManager={this.appManager}>
        </WindowManager>        
     
     </Desktop>
    );
  }
}

export default DryDock;
