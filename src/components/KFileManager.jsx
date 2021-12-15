import React from "react";
import ReactDOM from "react-dom";

// https://react-icons.github.io/react-icons/
import { FaFile, FaFolder, FaFolderOpen, FaAws } from 'react-icons/fa';
import { MdAddLocation, MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoReloadOutline } from 'react-icons/io5';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp, MdOutlineHome } from 'react-icons/md';
import { BiLogOutCircle, BiSearch } from 'react-icons/bi';

import { KTree, KButton, KToolbar, KToolbarItem, KSelect, KTextInput } from '@knossys/knossys-ui-core';

import KDataTools from './utils/KDataTools';
import KFileTable from './KFileTable';
import KFileTableS3 from './KFileTableS3';
import KBreadCrumbMenu from './KBreadCrumbMenu';
import KFileUpload from './KFileUpload';
import KAuthentication from './KAuthentication';
import KAuthenticationManager from './KAuthenticationManager';

import './css/filemanager.css';

const zones=[
  { "name": "us-east-2", "label": "US East (Ohio)"},
  { "name": "us-east-1", "label": "US East (N. Virginia)"},
  { "name": "us-west-1", "label": "US West (N. California)"},
  { "name": "us-west-2", "label": "US West (Oregon)"},
  { "name": "af-south-1", "label": "Africa (Cape Town)"},
  { "name": "ap-east-1", "label": "Asia Pacific (Hong Kong)"},
  { "name": "ap-south-1", "label": "Asia Pacific (Mumbai)"},
  { "name": "ap-northeast-3", "label": "Asia Pacific (Osaka)"},
  { "name": "ap-northeast-2", "label": "Asia Pacific (Seoul)"},
  { "name": "ap-southeast-1", "label": "Asia Pacific (Singapore)"},
  { "name": "ap-southeast-2", "label": "Asia Pacific (Sydney)"},
  { "name": "ap-northeast-1", "label": "Asia Pacific (Tokyo)"},
  { "name": "ca-central-1", "label": "Canada (Central)"},
  { "name": "eu-central-1", "label": "Europe (Frankfurt)"},
  { "name": "eu-west-1", "label": "Europe (Ireland)"},
  { "name": "eu-west-2", "label": "Europe (London)"},
  { "name": "eu-south-1", "label": "Europe (Milan)"},
  { "name": "eu-west-3", "label": "Europe (Paris)"},
  { "name": "eu-north-1", "label": "Europe (Stockholm)"},
  { "name": "me-south-1", "label": "Middle East (Bahrain)"},
  { "name": "sa-east-1", "label": "South America (São Paulo)"}
];

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

  static NO_AUTH_CONFIGURED=0;
  static NO_AUTH=1;
  static AUTHENTICATED=2;
  static LISTED=3;

  /**
   *
   */
  constructor(props) {    
    super(props);

    this.backend="http://192.168.0.108:8080";
    this.dataTools=new KDataTools ();

    this.authenticator=props.authenticator;

    if (this.authenticator==null) {
      console.log ("Internal error: no authenticator configured!");
    }

    this.state={
      mode: (this.authenticator != null) ? KFileManager.NO_AUTH : KFileManager.NO_AUTH_CONFIGURED,
      selected: null,
      folders: {},
      data: [],
      zones: this.generateZoneOptions (),
      type: KFileManager.BACKEND_S3
    };

    this.onTreeNodeSelect=this.onTreeNodeSelect.bind(this);
    this.onToolbarItemClick=this.onToolbarItemClick.bind(this);    
    this.apiData=this.apiData.bind(this);
    this.apiListing=this.apiListing.bind(this);
    this.serviceLogin=this.serviceLogin.bind(this);
    this.onRefresh=this.onRefresh.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.onSearch=this.onSearch.bind(this);
  }

  /**
   * 
   */  
  componentDidMount() {
    console.log ("componentDidMount()");
 
    if (this.authenticator) {
      this.authenticator=this.props.authenticator.getAuthByType (KAuthentication.AUTH_S3);
      if (this.authenticator!=null) {
        this.setState ({
          mode: KFileManager.AUTHENTICATED
        });

        this.apiCall ("getfolders",this.apiData);
      } else {
        this.setState ({
          mode: KFileManager.NO_AUTH
        });        
      }
    } else {
      console.log ("Error: no authenticator available");
    }
  }

  /**
   *
   */
  generateZoneOptions () {
    let list=[];

    for (let i=0;i<zones.length;i++) {
      list.push(zones [i].label);
    }

    return (list);
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
        mode: KFileManager.NO_AUTH,
        data: []
      });
    }
  }

  /**
   *
   */
  serviceLogin (e) {
    console.log ("serviceLogin ()");

    if (this.authenticator==null) {
      console.log("Error: no authenticator available, retrying assignment ...");
      if (this.props.authenticator) {
        this.authenticator=this.props.authenticator;
      }
    }

    if (this.authenticator==null) {
      console.log("Internal error: no authenticator available");
      return;
    }    

    this.setState ({
      mode: KFileManager.AUTHENTICATED
    },(e) => {
      let newS3Auth=new KAuthentication ();
      newS3Auth.type=KAuthentication.AUTH_S3;
    
      this.authenticator.addAuthentication (newS3Auth);

      this.apiCall ("getfolders",this.apiData);      
    });
  }

  /**
   *
   */
  onRefresh (e) {
    console.log ("onRefresh ()");

    this.setState ({      
      data: []
    },(e) => {
      this.apiCall("getdata?bucket="+getNodeLabel (this.state.selected),this.apiListing);
    });
  }

  /**
   *
   */
  handleChange (aText) {
    this.setState ({
      searchTerms: aText
    });
  }

  /**
   *
   */
  onSearch (e) {
    console.log ("onSearch ()");    
  }

  /**
   *
   */
  onPrevious () {
    console.log ("onPrevious ()");
  }

  /**
   *
   */
  onNext () {
    console.log ("onNext ()");
  }

  /**
   *
   */
  generateNoAuthPanel () {
    return (<div className="file-blank-panel">
      <div className="file-control-panel">
      No authentication manager available!
      </div>      
    </div>);
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
      <KButton onClick={(e) => this.serviceLogin (e,this)} style={{margin: "5px"}}>Ok</KButton>
      </div>      
    </div>);
  }

  /**
   *
   */
  render () {
    if (this.state.mode==KFileManager.NO_AUTH_CONFIGURED) {
      return (this.generateNoAuthPanel ());
    }

    if (this.state.mode==KFileManager.NO_AUTH) {
      return (this.generateConfigControls ());
    }

    let filecontrols;
    let filetable;
    let source="K";

    if (this.state.type==KFileManager.BACKEND_S3) {
      filetable=<KFileTableS3 data={this.state.data}/>;
      source=<FaAws/>;

      filecontrols=<div className="file-controls">
        <KButton onClick={(e) => this.onRefresh (e)} style={{marginRight: "2px", fontSize: "13pt"}}><IoReloadOutline /></KButton>
        <div style={{padding: "5px", fontSize: "12pt"}}>Region: </div><KSelect size={KSelect.SMALL} options={this.state.zones} /> 
        <KButton onClick={(e) => this.onPrevious (e)} style={{marginRight: "2px", fontSize: "13pt"}}><MdSkipPrevious/></KButton>                          
        <KTextInput handleChange={(e) => this.handleChange (e)} size={KTextInput.REGULAR} style={{flex: "0", width: "50px"}}></KTextInput>
        <KButton onClick={(e) => this.onNext (e)} style={{marginRight: "2px", fontSize: "13pt"}}><MdSkipNext/></KButton>                                    
      </div>
    } else {
      filetable=<KFileTable data={this.state.data}/>;
      source="K";
    }

    return (<div className="kfilemanager-content ">
      <div className="file-address">

          <KToolbar style={{fontSize: "12pt"}}>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,"logout")}><BiLogOutCircle /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,5)}><MdKeyboardArrowLeft /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,6)}><MdKeyboardArrowRight /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,7)}><MdKeyboardArrowUp /></KToolbarItem>
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,8)}><MdOutlineHome /></KToolbarItem>
          </KToolbar>
          <KBreadCrumbMenu source={this.state.selected} />
          <KTextInput handleChange={(e) => this.handleChange (e)} size={KTextInput.REGULAR} style={{flex: "1"}}></KTextInput>
          <KButton onClick={(e) => this.onSearch (e)} style={{marginRight: "2px"}}><BiSearch/></KButton>                  
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
            <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,4)}><IoReloadOutline /></KToolbarItem>
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
