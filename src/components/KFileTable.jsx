import React from "react";
import ReactDOM from "react-dom";

import KDataTools from './utils/KDataTools';

import './css/filemanager.css';

/**
 * 
 */
export class KFileTable extends React.Component {

  // Change these to integers
  static COL_NAME = 'column-name';
  static COL_TYPE = 'column-type';
  static COL_CREATED = 'column-created';
  static COL_MODIFIED = 'column-modified';
  static COL_OWNER = 'column-owner';  

  /**
   *
   */
  constructor(props) {
    super(props);

    this.dataTools=new KDataTools ();    

    this.state = {
      selected: null,
      data: props.data,
      shiftDown: false,
      crtlDown: false
    };

    this.onKeyDown=this.onKeyDown.bind (this);
    this.onKeyUp=this.onKeyUp.bind (this);
    this.onMouseOver=this.onMouseOver.bind(this);
    this.onClick=this.onClick.bind(this);
  }

  /**
   *
   */
  onKeyDown (e) {
    console.log ("onKeyDown ("+e.keyCode+")");

    if (e.keyCode==16) {
      this.setState ({
        shiftDown: true
      });
    }

    if (e.keyCode==17) {
      this.setState ({
        crtlDown: true
      });
    }    
  }  

  /**
   *
   */
  onKeyUp (e) {
    console.log ("onKeyUp ("+e.keyCode+")");

    this.setState ({
      shiftDown: false,
      crtlDown: false
    });
  }    

  /**
   * 
   */
  onMouseOver (e,anIndex) {
    let augmentedData=this.dataTools.deepCopy (this.state.data);

    for (let i=0;i<augmentedData.length;i++) {      
      if (anIndex==i) {
        augmentedData [i].highlighted=true;  
      } else {
        augmentedData [i].highlighted=false;
      }
    }

    this.setState ({
      data: augmentedData
    });
  }

  /**
   * 
   */
  onClick (e,anIndex) {
    let augmentedData=this.dataTools.deepCopy (this.state.data);

    for (let i=0;i<augmentedData.length;i++) {      
      if (anIndex==i) {
        augmentedData [i].selected=true;  
      } else {
        if (this.state.crtlDown==false) {
          augmentedData [i].selected=false;
        }
      }
    }

    this.setState ({
      data: augmentedData
    });
  }

  /**
   * 
   */  
  componentDidMount() {
    console.log ("componentDidMount()");

    let augmentedData=this.dataTools.deepCopy (this.state.data);

    for (let i=0;i<augmentedData.length;i++) {
      augmentedData [i].highlighted=false;
      augmentedData [i].selected=false;
    }

    this.setState ({
      data: augmentedData
    });
  }

  /**
   *
   */
  createFileList (aColumn) {
    let list=[];

    let date=new Date();
    let today=date.getDate();
    let todayString=date.toDateString();

    let keyCounter=0;

    if (aColumn==KFileTable.COL_NAME) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];
        
        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        }        

        list.push(<div key={"fcell-"+(keyCounter+1)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.name}</div>); 

        keyCounter+=5;
      }
    }

    if (aColumn==KFileTable.COL_TYPE) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];

        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        } 

        list.push(<div key={"fcell-"+(keyCounter+2)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.type}</div>); 

        keyCounter+=5;
      }      
    }

    if (aColumn==KFileTable.COL_CREATED) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];

        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        } 

        list.push(<div key={"fcell-"+(keyCounter+3)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.created}</div>); 

        keyCounter+=5;
      }      
    }

    if (aColumn==KFileTable.COL_MODIFIED) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];

        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        } 

        list.push(<div key={"fcell-"+(keyCounter+4)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.modified}</div>); 

        keyCounter+=5;
      }      
    }

    if (aColumn==KFileTable.COL_OWNER) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];

        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        }

        list.push(<div key={"fcell-"+(keyCounter+5)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.owner}</div>); 

        keyCounter+=5;
      }      
    }

    return (list);
  }
 
  /**
   *
   */
  render () {

    let nameColumn=this.createFileList(KFileTable.COL_NAME);
    let typeColumn=this.createFileList(KFileTable.COL_TYPE);
    let createdColumn=this.createFileList(KFileTable.COL_CREATED);
    let modifiedColumn=this.createFileList(KFileTable.COL_MODIFIED);
    let ownerColumn=this.createFileList(KFileTable.COL_OWNER);

    return (<div tabIndex="0" className="kfilemanager-table" onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}>
      <div className="kfilecolumn">
        <div className="kfileheader">Name</div>
        {nameColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>
      <div className="kfilecolumn">
        <div className="kfileheader">Type</div>
        {typeColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>          
      <div className="kfilecolumn">          
        <div className="kfileheader">Created</div>
        {createdColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>          
      <div className="kfilecolumn">          
        <div className="kfileheader">Modified</div>
        {modifiedColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>          
      <div className="kfilecolumn">          
        <div className="kfileheader">Owner</div>
        {ownerColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>          
    </div>);
  }
}

export default KFileTable;
