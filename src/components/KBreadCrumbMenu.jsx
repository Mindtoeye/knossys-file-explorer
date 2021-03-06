import React, { Component } from 'react';

import { BiChevronRight } from 'react-icons/bi';

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
 
    let crumbKey=0;

    for (let i=0;i<splitter.length;i++) {
      crumbs.push (<div className="kbreaseparator" key={"crumb-"+crumbKey}><BiChevronRight/></div>);
      crumbs.push (<div className="kbreadelement" key={"crumb-"+crumbKey+1}>{splitter [i]}</div>);
      crumbKey+=2;
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
        {sourceElements}
      </div>
    );
  }
}

export default KBreadCrumbMenu;
