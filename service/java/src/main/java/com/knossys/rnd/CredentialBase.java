package com.knossys.rnd;

import java.util.logging.Logger;

import javax.json.Json;
import javax.json.JsonObjectBuilder;

import com.knossys.rnd.box.BoxConnector;

/** 
 * 
 */
public class CredentialBase implements CredentialInterface {
  
  private static Logger M_log = Logger.getLogger(BoxConnector.class.getName());  
  
  /** 
   * @return
   */
  public Boolean init () {   
    M_log.info("init ()");
    return (false);
  }
  
  /** 
   * @return
   */
  public Boolean login () {    
    return (false);
  }
  
  /** 
   * @param token
   */
  public void setAuthToken(String token) {    
  }

  /**
   * 
   */
  @Override
  public String getFolders() {
    JsonObjectBuilder builder=Json.createObjectBuilder();
    builder.add("status", "error");
    builder.add("message", "No credentials available");
    return (builder.build().toString());
  }  
  
  /**
   * 
   */
  @Override
  public String getData(String aFolder) {
    JsonObjectBuilder builder=Json.createObjectBuilder();
    builder.add("status", "error");
    builder.add("message", "No credentials available");
    return (builder.build().toString());
  }    
}
