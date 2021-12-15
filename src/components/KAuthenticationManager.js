
import KAuthentication from './KAuthentication';

/**
 * 
 */
class KAuthenticationManager {

  /**
   * 
   */
  constructor () {
    this.authList=[];
    this.authUpdater=null;
  }

  /**
   * 
   */
  getAuthByType (aType) {
    console.log ("getAuthByType ()");

    for (let i=0;i<this.authList.length;i++) {
      let testType=this.authList [i];
      if (testType.type==aType) {
        return (testType);
      }
    }

    return (null);
  }

  /**
   * 
   */
  getAuthList () {
    return (this.authList);
  }

  /**
   * 
   */
  setAuthUpdater (aHandler) {
    this.authUpdater=aHandler;
  }

  /**
   * 
   */
  addAuthentication (anAuth) {
    this.authList.push (anAuth);

    if (this.authUpdater) {
      this.authUpdater.update();
    }
  }  
}

export default KAuthenticationManager;
