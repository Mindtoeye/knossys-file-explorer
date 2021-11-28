import React from "react";
import ReactDOM from "react-dom";

import { FiUploadCloud } from 'react-icons/fi';

import KDataTools from './utils/KDataTools';

import './css/upload.css';

/**
 * 
 */
export class KFileUpload extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.dataTools=new KDataTools ();    

    this.state = {

    };
  }

  /**
   *
   */
  render () {
    return (<div className="kfilemanager-upload">
      <FiUploadCloud />
    </div>);
  }
}

export default KFileUpload;
