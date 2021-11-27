import React, { Component } from 'react';

import './css/breadcrumb.css';

/**
 * 
 */
class KBreadCrumbMenu extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state = {      
    }       
  }

  /**
   *
   */
  createCrumbTrail (aSourcePath) {
    console.log ("createCrumbTrail ("+aSourcePath+")");

    if (aSourcePath==="") {
      return ([]);
    }

    // Clean the path first
    let clean=aSourcePath;

    // Remove trailing forward slashes

    // Remove starting forward slashes

    if (aSourcePath.indexOf ("/")==0) {
      clean=aSourcePath.substring (1);
    }    

    // All done, we can now transform the path into a set of controls

    let crumbs=[];

    let splitter=clean.split ("/");

    for (let i=0;i<splitter.length;i++) {
      crumbs.push (<li key={"crumb-"+i}>
        <div>{splitter [i]}</div>
      </li>);
    }    

    return (crumbs);
  }

  /**
   *
   */
  render() {
    let source="";

    if (this.props.source) {
      source=this.props.source.path;
    }

    let sourceElements=this.createCrumbTrail(source);

    return (
      <div className="kbreadcrumb">
        <ol>
          {sourceElements}
        </ol>
      </div>
    );
  }
}

export default KBreadCrumbMenu;
