
import React from "react";
import ReactDOM from "react-dom";

import { FiLock, FiUnlock } from 'react-icons/fi';

import KDataTools from './utils/KDataTools';

import './css/credentials.css';

/**
 * 
 */
export class KnossysCredentialList extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.dataTools=new KDataTools ();    

    this.state = {
      authenticator: props.authenticator
    };
  }

  /**
   *
   */
  generateCredentialPanel (aCredential) {
    return (<div key={this.dataTools.uuidv4()} className="kcredential">
      <div className="kcredential-large">
        <FiLock/>
        <div>S3</div>
      </div>
      <div className="kcredential-small">
        <div style={{padding: "2px"}}><span style={{color: "#d9d948"}}>Token: </span> {aCredential.token}</div>
        <div style={{padding: "2px"}}><span style={{color: "#d9d948"}}>Created: </span> {aCredential.created.toString()}</div>
      </div>
    </div>);  
  }

  /**
   *
   */
  render () {
    let list=[];

    let aList=this.state.authenticator.getAuthList ();

    if (aList) {
      for (let i=0;i<aList.length;i++) {
        let aCredential=aList [i];
        list.push (this.generateCredentialPanel (aCredential));
      }
    }

    return (<div className="kcredentials">
    {list}
    </div>);
  }
}

export default KnossysCredentialList;
