import React from "react";
import ReactDOM from "react-dom";

// https://react-icons.github.io/react-icons/
import { FaFile, FaFolder, FaFolderOpen, FaAws } from 'react-icons/fa';
import { MdAddLocation } from 'react-icons/md';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp, MdOutlineHome } from 'react-icons/md';

import { KTree, KButton, KToolbar, KToolbarItem } from '@knossys/knossys-ui-core';

import KDataTools from './utils/KDataTools';
import KFileTable from './KFileTable';
import KFileTableS3 from './KFileTableS3';
import KBreadCrumbMenu from './KBreadCrumbMenu';
import KFileUpload from './KFileUpload';

import './css/filemanager.css';

const treeData = {
  '/modules': {
    path: '/modules',
    type: 'folder',
    isOpen: true,
    isRoot: true,
    children: [
      '/modules/input', 
      '/modules/output'
    ]
  },
  '/modules/input': {
    path: '/modules/input',
    type: 'folder',
    isOpen: true,
    children: [
      '/modules/input/debug',
      '/modules/input/mysql'
    ]
  },
  '/modules/input/debug': {
    path: '/modules/input/debug',
    type: 'file',
    content: 'The most basic module. Use this for testing. It will directly copy the input to the output without modification'
  },  
  '/modules/input/mysql': {
    path: '/modules/input/mysql',
    type: 'file',
    content: 'Load data directly from a MySQL database'
  },
  '/modules/output': {
    path: '/modules/output',
    isOpen: true,
    type: 'folder',
    children: []
  }
};

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

    this.dataTools=new KDataTools ();

    this.state={
      selected: null,
      data: this.generateData (),
      type: KFileManager.BACKEND_S3
    };

    this.onTreeNodeSelect=this.onTreeNodeSelect.bind(this);
    this.onToolbarItemClick=this.onToolbarItemClick.bind(this);    
  }

  /**
   * 
   */  
  componentDidMount() {
    console.log ("componentDidMount()");

    /*
    this.setState ({
      data: this.generateData ()
    });
    */
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
    console.log (anItem);

    let selected=null;

    /*
    if (anItem.type=='file') {
      if (anItem.content) {
        selected=anItem;
      }
    }
    */

    selected=anItem;

    this.setState ({
      selected: selected
    });    
  }  

  /**
   *
   */
  onToolbarItemClick (e,anItem) {
    console.log ("onToolbarItemClick ("+anItem+")");

    if (this.props.onToolbarItemClick) {
      this.props.onToolbarItemClick (anItem);
    }
  }

  /**
   *
   */
  render () {
    let filetable;
    let source="K";

    if (this.state.type==KFileManager.BACKEND_S3) {
      filetable=<KFileTableS3 data={this.state.data}/>;
      source=<FaAws/>;
    } else {
      filetable=<KFileTable data={this.state.data}/>;
      source="K";
    }

    return (<div className="kfilemanager-content ">
      <div className="file-address">

          <KToolbar style={{fontSize: "16pt"}}>
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

          <KTree classes="filetreeview" onSelect={this.onTreeNodeSelect} data={treeData} />

          <KFileUpload />          
        </div>
        <div className="file-list">
        {filetable}
        </div>
      </div>
    </div>);
  }
}

export default KFileManager;
