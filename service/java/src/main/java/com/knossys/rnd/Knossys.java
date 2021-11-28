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

import java.util.List;
import java.util.ArrayList;

import org.apache.log4j.Logger;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;

/**
 * @author Martin van Velsen <vvelsen@knossys.com>
 */
@WebServlet(urlPatterns = { "/api/v1/*" }, loadOnStartup = 1, asyncSupported = true)
public class Knossys extends BaseService {
	
	private static final long serialVersionUID = -5505838591578283382L;
	
	private static Logger M_log = Logger.getLogger(Knossys.class);
	
  private ArrayList<ArrayList<String>> data=new ArrayList<ArrayList<String>>();
  
  private ServletTools sTools=new ServletTools ();
  
  private String targetBucket="cmu-gallery";
  
  private AWSCredentials basicSessionCredentials = null;
  	  	
	/**
	 * @param config
	 * @throws ServletException
	 */
	@Override
	public void init(ServletConfig sConfig) {
		M_log.info ("init ()");

		//config.context = sConfig.getServletContext();
		
		basicSessionCredentials = getCredentials();
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

		if (request.indexOf("/api/v1/status") != -1) {
	    return ("{ \"result\" : \"success\" , \"data\" : \"null\"}");
		}
		
    //>--------------------------------------------------------------		
			
		// The S3 equivalent of getting folders (buckets)
    if (request.indexOf("/api/v1/getfolders") != -1) {
      
      JsonObjectBuilder builder=Json.createObjectBuilder();
      
      builder.add("return", "buckets");
      builder.add("request", "/api/v1/getfolders");
      
      JsonArrayBuilder dataBuilder=Json.createArrayBuilder();
                          
      AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(basicSessionCredentials)).withRegion(Regions.US_EAST_1).build();
      
      List<Bucket> buckets = s3Client.listBuckets();
      //System.out.println("Your {S3} buckets are:");
      for (Bucket b : buckets) {
        //System.out.println("* " + b.getName());
        
        JsonObjectBuilder aBucket=Json.createObjectBuilder();
        
        aBucket.add("created",b.getCreationDate().toString());
        aBucket.add("name",b.getName());
        
        dataBuilder.add(aBucket);               
      }
      
      builder.add("data", dataBuilder);
      
      return (builder.build().toString());
    }   		
		
    //>--------------------------------------------------------------    
        
    if (request.indexOf("/api/v1/getdata") != -1) {                  
      String bucket = req.getParameter("bucket");
      
      AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(basicSessionCredentials)).withRegion(Regions.US_EAST_1).build();
            
      System.out.println("The {S3} bucket contents for "+bucket+" are:");

      ListObjectsV2Result result = s3Client.listObjectsV2(bucket);
      
      if (result.isTruncated()==true) {
        System.out.println ("Info: result truncated");
      }
      
      JsonObjectBuilder builder=Json.createObjectBuilder();
      
      builder.add("return", "objects");
      builder.add("request", "/api/v1/getdata");
      builder.add("truncated", result.isTruncated());
      
      JsonArrayBuilder dataBuilder=Json.createArrayBuilder();      
      
      List<S3ObjectSummary> objects = result.getObjectSummaries();
      
      for (S3ObjectSummary os : objects) {
        System.out.println("Key: " + os.getKey() + ", bucket: " + os.getBucketName() + ", size: " + os.getSize() + ", Modified: " + os.getLastModified().toString());
        
        JsonObjectBuilder aBucket=Json.createObjectBuilder();
        
        aBucket.add("key",os.getKey());
        aBucket.add("bucket",os.getBucketName());
        aBucket.add("size",os.getSize());
        aBucket.add("modified",os.getLastModified().toString());
        
        dataBuilder.add(aBucket);          
      }      
            
      builder.add("data", dataBuilder);
      
      return (builder.build().toString());
    }
    
    //>--------------------------------------------------------------    
				
		return ("{ \"result\" : \"success\" , \"data\" : \"null\"}");
	}
}
