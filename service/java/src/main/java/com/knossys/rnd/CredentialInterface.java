package com.knossys.rnd;

/** 
 * @author vvelsen
 */
public interface CredentialInterface {

  /** 
   * @return
   */
  public Boolean init ();
  
  /** 
   * @param aValue
   */
  public void setAuthToken (String aValue);
  
  /** 
   * @return
   */
  public Boolean login ();
  
  /** 
   * @return
   */
  public String getFolders ();
  
  /** 
   * @return
   */
  public String getData (String aFolder);
}
