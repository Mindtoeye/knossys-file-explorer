import React from "react";
import ReactDOM from "react-dom";

import { FcFolder } from 'react-icons/fc';

import KDataTools from './utils/KDataTools';
import KWaitLoader from './KWaitLoader';

import './css/filemanager.css';

/**
 * 
 */
export class KFileTableS3 extends React.Component {

  // Change these to integers
  static COL_KEY = 'column-key';
  static COL_BUCKET = 'column-bucket';
  static COL_SIZE = 'column-size';
  static COL_MODIFIED = 'column-modified';
  
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
    this.onMouseEnter=this.onMouseEnter.bind(this);
    this.onMouseLeave=this.onMouseLeave.bind(this);
    this.onClick=this.onClick.bind(this);
  }

  /**
   *
   */
  componentDidUpdate(prevProps) {    
    if (this.props.data !== prevProps.data) {
      this.setState ({
        data: this.props.data
      });
    }
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
  onMouseEnter (e,anIndex) {
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
  onMouseLeave (e,anIndex) {    

    let augmentedData=this.dataTools.deepCopy (this.state.data);

    for (let i=0;i<augmentedData.length;i++) {      
      if (anIndex==i) {
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
    let fType;
    let date=new Date();
    let today=date.getDate();
    let todayString=date.toDateString();

    let keyCounter=0;

    if (aColumn==KFileTableS3.COL_KEY) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];
        
        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        }     

        fType=<div className="kfiletype"><FcFolder/></div>;

        list.push(<div key={"fcell-"+(keyCounter+1)} className={classes} onMouseLeave={(e) => this.onMouseLeave(e,i)} onMouseEnter={(e) => this.onMouseEnter(e,i)} onClick={(e) => this.onClick (e,i)}>{fType}{fileItem.key}</div>); 

        keyCounter+=5;
      }
    }

    if (aColumn==KFileTableS3.COL_BUCKET) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];

        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        } 

        list.push(<div key={"fcell-"+(keyCounter+2)} className={classes} onMouseLeave={(e) => this.onMouseLeave(e,i)} onMouseEnter={(e) => this.onMouseEnter(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.bucket}</div>); 

        keyCounter+=5;
      }      
    }

    if (aColumn==KFileTableS3.COL_SIZE) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];

        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        } 

        list.push(<div key={"fcell-"+(keyCounter+3)} className={classes} onMouseLeave={(e) => this.onMouseLeave(e,i)} onMouseEnter={(e) => this.onMouseEnter(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.size}</div>); 

        keyCounter+=5;
      }      
    }

    if (aColumn==KFileTableS3.COL_MODIFIED) {
      for (let i=0;i<this.state.data.length;i++) {
        let fileItem=this.state.data [i];

        let classes="kfilecell";

        if (fileItem.highlighted==true) {
          classes+=" kfilehighlighted";
        }

        if (fileItem.selected==true) {
          classes+=" kfileselected";
        } 

        list.push(<div key={"fcell-"+(keyCounter+4)} className={classes} onBlur={(e) => this.onBlur(e,1)} onMouseLeave={(e) => this.onMouseLeave(e,i)} onMouseEnter={(e) => this.onMouseEnter(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.modified}</div>); 

        keyCounter+=5;
      }      
    }

    return (list);
  }
 
  /**
   *
   */
  render () {
    if (!this.state.data) {
      return (<KWaitLoader/>);
    }

    if (this.state.data.length==0) {
      return (<KWaitLoader/>);      
    }

    let keyColumn=this.createFileList(KFileTableS3.COL_KEY);
    let bucketColumn=this.createFileList(KFileTableS3.COL_BUCKET);
    let sizeColumn=this.createFileList(KFileTableS3.COL_SIZE);
    let modifiedColumn=this.createFileList(KFileTableS3.COL_MODIFIED);

    return (<div tabIndex="0" className="kfilemanager-table" onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}>
      <div className="kfilecolumn">
        <div className="kfileheader">Key</div>
        {keyColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>
      <div className="kfilecolumn">
        <div className="kfileheader">Bucket</div>
        {bucketColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>          
      <div className="kfilecolumn">          
        <div className="kfileheader">Size</div>
        {sizeColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>          
      <div className="kfilecolumn">          
        <div className="kfileheader">Modified</div>
        {modifiedColumn}
        <div className="kfilepadding">&nbsp;</div>
      </div>
    </div>);
  }
}

export default KFileTableS3;
