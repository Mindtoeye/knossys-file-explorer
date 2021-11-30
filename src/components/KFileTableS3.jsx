/*

Code  Name  Opt-in Status
us-east-2   US East (Ohio)  Not required
us-east-1   US East (N. Virginia)   Not required
us-west-1   US West (N. California)   Not required
us-west-2   US West (Oregon)  Not required
af-south-1  Africa (Cape Town)  Required
ap-east-1   Asia Pacific (Hong Kong)  Required
ap-south-1  Asia Pacific (Mumbai)   Not required
ap-northeast-3  Asia Pacific (Osaka)  Not required
ap-northeast-2  Asia Pacific (Seoul)  Not required
ap-southeast-1  Asia Pacific (Singapore)  Not required
ap-southeast-2  Asia Pacific (Sydney)   Not required
ap-northeast-1  Asia Pacific (Tokyo)  Not required
ca-central-1  Canada (Central)  Not required
eu-central-1  Europe (Frankfurt)  Not required
eu-west-1   Europe (Ireland)  Not required
eu-west-2   Europe (London)   Not required
eu-south-1  Europe (Milan)  Required
eu-west-3   Europe (Paris)  Not required
eu-north-1  Europe (Stockholm)  Not required
me-south-1  Middle East (Bahrain)   Required
sa-east-1   South America (São Paulo)   Not required

*/

import React from "react";
import ReactDOM from "react-dom";

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
    this.onMouseOver=this.onMouseOver.bind(this);
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

        list.push(<div key={"fcell-"+(keyCounter+1)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.key}</div>); 

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

        list.push(<div key={"fcell-"+(keyCounter+2)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.bucket}</div>); 

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

        list.push(<div key={"fcell-"+(keyCounter+3)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.size}</div>); 

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

        list.push(<div key={"fcell-"+(keyCounter+4)} className={classes} onMouseOver={(e) => this.onMouseOver(e,i)} onClick={(e) => this.onClick (e,i)}>{fileItem.modified}</div>); 

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
