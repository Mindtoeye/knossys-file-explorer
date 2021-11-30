import React, { Component } from 'react';

import { WindowManager, ApplicationManager } from '@knossys/knossys-window-manager';

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

    this.state = {
      globalSettings: {}
    }       

    this.appManager=new ApplicationManager ();
    
    this.updateWindowStack=this.updateWindowStack.bind (this);    
  }

  /**
   * 
   */
  componentDidMount () {
    this.appManager.addApplication ({
      title: "Knossys Cloud File Manager",
      type: "window",
      width: 929,
      height: 662,
      window: <KFileManager />
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
  render() {
    return (
      <div tabIndex="0" className="fauxdesktop knossys-dark">
        <div className="fauxwm">
        
        <WindowManager 
          settings={this.state.globalSettings}
          appManager={this.appManager}>
        </WindowManager>        

      </div>        
      </div>
    );
  }
}

export default DryDock;
