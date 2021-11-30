import React from "react";
import ReactDOM from "react-dom";

// https://react-icons.github.io/react-icons/
import { FaFile, FaFolder, FaFolderOpen, FaAws } from 'react-icons/fa';
import { MdAddLocation } from 'react-icons/md';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp, MdOutlineHome } from 'react-icons/md';
import { BiLogOutCircle } from 'react-icons/bi';

import { KTree, KButton, KToolbar, KToolbarItem, KSelect, KTextInput } from '@knossys/knossys-ui-core';

import KDataTools from './utils/KDataTools';
import KFileTable from './KFileTable';
import KFileTableS3 from './KFileTableS3';
import KBreadCrumbMenu from './KBreadCrumbMenu';
import KFileUpload from './KFileUpload';

import './css/filemanager.css';

const getNodeLabel = (node) => {
  let splitter=node.path.split('/');
  return (splitter[splitter.length-1]);
}

/**
 * 
 */
export class KFileManager extends React.Component {

  static BACKEND_DEFAULT=0;
  static BACKEND_S3=1;

  /**
   *
   */
  constructor(props) {
    super(props);

    this.backend="http://192.168.0.108:8080";
    this.dataTools=new KDataTools ();

    this.state={
      configured: false,
      selected: null,
      folders: {},
      data: [],
      type: KFileManager.BACKEND_S3
    };

    this.onTreeNodeSelect=this.onTreeNodeSelect.bind(this);
    this.onToolbarItemClick=this.onToolbarItemClick.bind(this);    
    this.apiData=this.apiData.bind(this);
    this.apiListing=this.apiListing.bind(this);
    this.serviceLogin=this.serviceLogin.bind(this);
  }

  /**
   * 
   */  
  componentDidMount() {
    console.log ("componentDidMount()");

    this.apiCall ("getfolders",this.apiData);
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
       'Content-Type': 'application/json'       
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }
   */
  apiCall (aCall,aCallback) {
    console.log ("apiCall ("+aCall+")");

    fetch(this.backend+"/api/v1/"+aCall,{method: "GET"})
      .then(res => res.json())
      .then(
        (result) => {
          if (aCallback) {
            aCallback (result);
          } else {

          }
        },
        // Note: it's important to handle errors here instead of a catch() block so that we 
        // don't swallow exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: false,
            error: error
          });
        }
      );
  }

  /**
   * 
   */
  apiData (result) {
    console.log ("apiData ()");
    //console.log (result);

    let root={
      path: '/buckets',
      type: 'folder',
      isOpen: true,
      isRoot: true,
      children: []
    };

    let folderData = {
      '/buckets': root
    };

    let buckets=result.data;

    for (let i=0;i<buckets.length;i++) {
      let newBucket={
        path: "/buckets/"+buckets [i].name,
        type: 'folder',
        isopen: true
      };
 
      root.children.push (newBucket.path);
      folderData [newBucket.path]=newBucket;
    }

    //console.log(JSON.stringify (folderData));

    this.setState({
      folders: folderData
    });
  }  

  /**
   * 
   */
  apiListing (result) {
    console.log ("apiListing ()");
   
    this.setState({      
      data: result.data
    });
  }

  /**
   *
   */
  generateData () {
    let list=[];

    let date=new Date();
    let today=date.getDate();
    let todayString=date.toDateString();

    let keyCounter=0;
    let simFiles=50;

    for (let i=0;i<simFiles;i++) {
      let simFile = {
        name: this.dataTools.makeid(20),
        type: "File",
        created: todayString,
        modified: todayString,
        owner: "Anonymous"
      };

      list.push(simFile);
    }

    return (list);
  }

  /**
   *
   */
  onTreeNodeSelect (anItem) {
    console.log ("onTreeNodeSelect ()");

    let selected=null;

    selected=anItem;

    this.setState ({
      selected: selected,
      data: []
    },(e) => {
      if (anItem.type=="folder") {
        this.apiCall("getdata?bucket="+getNodeLabel (anItem),this.apiListing);
      }
    });
  }  

  /**
   *
   */
  onToolbarItemClick (e,anItem) {
    console.log ("onToolbarItemClick ("+anItem+")");

    if (anItem=="logout") {
      this.setState ({
        configured: false
      });
    }
  }

  /**
   *
   */
  serviceLogin () {
    console.log ("serviceLogin ()");

    this.setState ({
      configured: true
    });
  }

  /**
   *
   */
  generateConfigControls () {
    return (<div className="file-blank-panel">
      <div className="file-control-panel">
      <div className="file-service-icon"><FaAws/></div>
      <div className="file-label">Access key ID: </div>
      <KTextInput size={KTextInput.REGULAR} style={{width: "100%"}}></KTextInput>
      <div className="file-label">Secret access key:</div>
      <KTextInput size={KTextInput.REGULAR} style={{width: "100%"}}></KTextInput>
      <KButton onClick={(e) => this.serviceLogin (e)} style={{margin: "5px"}}>Ok</KButton>
      </div>      
    </div>);
  }

  /**
   *
   */
  render () {
    if (this.state.configured==false) {
      return (this.generateConfigControls ());
    }

    let filecontrols;
    let filetable;
    let source="K";

    if (this.state.type==KFileManager.BACKEND_S3) {
      filetable=<KFileTableS3 data={this.state.data}/>;
      source=<FaAws/>;

      filecontrols=<div className="file-controls">
      <div style={{padding: "5px", fontSize: "12pt"}}>Region: </div><KSelect size={KSelect.SMALL} />  
      </div>
    } else {
      filetable=<KFileTable data={this.state.data}/>;
      source="K";
    }

    return (<div className="kfilemanager-content ">
      <div className="file-address">

          <KToolbar style={{fontSize: "16pt"}}>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,"logout")}><BiLogOutCircle /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,5)}><MdKeyboardArrowLeft /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,6)}><MdKeyboardArrowRight /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,7)}><MdKeyboardArrowUp /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,8)}><MdOutlineHome /></KToolbarItem>
          </KToolbar>
          <KBreadCrumbMenu source={this.state.selected} />
          <div className="file-hor-padding"></div>
          <div className="file-source">
          {source}  
          </div>
      </div>
      <div className="file-center">
        <div className="file-tree">

          <KToolbar>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,1)}><IoMdAddCircleOutline /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,2)}><FaFolder /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,3)}><FaFolderOpen /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,4)}><MdAddLocation /></KToolbarItem>
          </KToolbar>

          <KTree classes="filetreeview" onSelect={this.onTreeNodeSelect} data={this.state.folders} style={{overflowY: "auto"}}/>

          <KFileUpload />          
        </div>
        <div className="file-list">
        {filecontrols}
        {filetable}
        </div>
      </div>
    </div>);
  }
}

export default KFileManager;
