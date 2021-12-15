package com.knossys.rnd;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.box.sdk.BoxAPIConnection;
import com.box.sdk.BoxConfig;
import com.box.sdk.BoxFolder;
import com.box.sdk.BoxItem;
import com.box.sdk.EncryptionAlgorithm;
import com.box.sdk.JWTEncryptionPreferences;
import com.knossys.rnd.box.BoxConnector;
import com.knossys.rnd.s3.S3Connector;

import java.util.List;
import java.util.logging.Logger;

//import org.apache.log4j.Logger;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

/**
 * https://docs.aws.amazon.com/code-samples/latest/catalog/code-catalog-java.html
 * 
 * @author Martin van Velsen <vvelsen@knossys.com>
 */
@WebServlet(urlPatterns = { "/api/v1/*" }, loadOnStartup = 1, asyncSupported = true)
public class Knossys extends BaseService {
	
	private static final long serialVersionUID = -5505838591578283382L;
	
	private static Logger M_log = Logger.getLogger(Knossys.class.getName());
	
	/*
  private S3Connector sConnector=new S3Connector ();
  private BoxConnector bConnector = new BoxConnector ();
  */
  
  private CredentialInterface connector=null;
  	  	
	/**
	 * @param config
	 * @throws ServletException
	 */
	@Override
	public void init(ServletConfig sConfig) {
		M_log.info ("init ()");
		
    connector=new S3Connector ();
	}

	/**
	 * 
	 */
	@Override
	public void destroy() {
		M_log.info ("destroy ()");
	}

	/**
	 * 
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		M_log.info ("doGet (), rerouting to doPost () ...");

		doPost(req, resp);
	}

	/**
	 * 
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		M_log.info ("doPost ()");

		// Fix cross domain headers manually for now
		resp.setHeader("Access-Control-Allow-Origin", "*");
		resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD");
		resp.setHeader("Access-Control-Allow-Headers", "knossyssession, origin, content-type, accept, authorization");

    // We should take this out once the system is stable
		listQueryParameters(req);

		resp.setContentType("text/json");
		PrintWriter writer = resp.getWriter();

		String result = processData(req, resp);

		writer.println(result);
		writer.close();
	}

	/**
	 *
	 */
	protected String processData(HttpServletRequest req, HttpServletResponse resp) {
		M_log.info ("processData (" + req.getRequestURI() + ")");

		String request = req.getRequestURI();
		
    //>--------------------------------------------------------------

    if (request.indexOf("/api/v1/setauthcode") != -1) {
      String token=req.getParameter("code");
      if (token.isEmpty()==false) {
        connector.setAuthToken (token);
        connector.login();
      } else {
        return ("{ \"result\" : \"fail\" , \"data\" : \"null\"}");
      }
      return ("{ \"result\" : \"success\" , \"data\" : \"null\"}");
    }		
		
		//>--------------------------------------------------------------

		if (request.indexOf("/api/v1/status") != -1) {
	    return ("{ \"result\" : \"success\" , \"data\" : \"null\"}");
		}
		
    //>--------------------------------------------------------------		
					
		// https://docs.aws.amazon.com/code-samples/latest/catalog/code-catalog-java.html
		// The S3 equivalent of getting folders (buckets)		
    if (request.indexOf("/api/v1/getfolders") != -1) {
      
      if (connector==null) {
        JsonObjectBuilder builder=Json.createObjectBuilder();
        builder.add("status", "error");
        builder.add("message", "No credentials available");
        return (builder.build().toString());
      }
            
      return (connector.getFolders ());
    }   		
		
    //>--------------------------------------------------------------    
        
    // https://docs.aws.amazon.com/code-samples/latest/catalog/code-catalog-java.html    
    if (request.indexOf("/api/v1/getdata") != -1) {
      
      if (connector==null) {
        JsonObjectBuilder builder=Json.createObjectBuilder();
        builder.add("status", "error");
        builder.add("message", "No credentials available");
        return (builder.build().toString());
      }      
      
      String bucket=req.getParameter("bucket");
          
      return (connector.getData(bucket));
    }
    
    //>--------------------------------------------------------------    
				
		return ("{ \"result\" : \"success\" , \"data\" : \"null\"}");
	}
}
