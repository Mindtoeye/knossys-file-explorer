package com.knossys.rnd.box;

import java.util.logging.Logger;

import javax.json.Json;
import javax.json.JsonObjectBuilder;

import com.box.sdk.BoxAPIConnection;
import com.box.sdk.BoxFolder;
import com.box.sdk.BoxItem;
import com.knossys.rnd.CredentialBase;

public class BoxConnector extends CredentialBase {
  
  private static Logger M_log = Logger.getLogger(BoxConnector.class.getName());

  private String boxSecret="";
  private String boxClientID="";
  private String boxAuthCode="";
  
  /** 
   * @return
   */
  public Boolean init () {   
    M_log.info("init ()");
    
    boxSecret=System.getProperty("BOX_SECRET");
    boxClientID=System.getProperty("BOX_CLIENT_ID");    
    
    //String authorizationUrl = "https://account.box.com/api/oauth2/authorize?client_id="+boxClientID+"&redirect_uri="+"http://http://73.154.122.33/:8080/api/v1/setauthcode"+"&response_type=code";
    
    return (true);
  }
  
  /**
   * https://github.com/box/box-java-sdk/blob/main/doc/authentication.md#standard-3-legged-oauth-20
   * 
   * @return
   */
  public Boolean login () {
    
    if (boxAuthCode=="") {
      return (false);
    }
        
    /*
    boxSecret=System.getenv("BOX_SECRET");
    boxSecret=System.getenv("BOX_SHELL");
    */
    
    M_log.info("Logging into box with secret: " + boxSecret + ", and client id: " + boxClientID);
    
    BoxAPIConnection api = new BoxAPIConnection(boxClientID, boxSecret, boxAuthCode);   
    
    BoxFolder rootFolder = BoxFolder.getRootFolder(api);
    for (BoxItem.Info itemInfo : rootFolder) {
      System.out.format("[%s] %s\n", itemInfo.getID(), itemInfo.getName());
    }   
    
    return (true);
  }

  /** 
   * @param token
   */
  public void setAuthToken(String token) {
    M_log.info("setAuthToken ("+token+")");
    
    boxAuthCode=token;    
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
