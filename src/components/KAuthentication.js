
import KDataTools from './utils/KDataTools';

/**
 * 
 */
class KAuthentication {

  static AUTH_NONE = 0;
  static AUTH_S3 = 1;
  static AUTH_BOX = 2;
  static AUTH_GOOGLE = 3;
  static AUTH_DROPBOX = 4;

  /**
   * 
   */
  constructor () {
    let dTools=new KDataTools ();
 
    this.type=KAuthentication.AUTH_NONE;
    this.id=dTools.uuidv4();
    this.key="";
    this.secret="";
    this.token=dTools.uuidv4(); // REPLACE THIS WITH THE ACTUAL SERVER GENERATED TOKEN!
    this.created=new Date()
  }
}

export default KAuthentication;
