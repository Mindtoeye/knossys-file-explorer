package com.knossys.rnd.s3;

import java.util.List;
import java.util.logging.Logger;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.util.StringUtils;
import com.knossys.rnd.CredentialBase;

/** 
 * @author vvelsen
 */
public class S3Connector extends CredentialBase {

  private static Logger M_log = Logger.getLogger(S3Connector.class.getName());
  
  private AWSCredentials basicSessionCredentials = null;
  
  /** 
   * @return
   */
  public Boolean init () {   
    M_log.info("init ()");
    
    basicSessionCredentials=getAWSCredentials ();
    
    return (true);
  }
  
  /** 
   * @return
   */
  public AWSCredentials getCredentials () {
    return (basicSessionCredentials);
  }
  
  /** 
   * @param token
   */
  public void setAuthToken(String token) {
    M_log.info("setAuthToken ("+token+")");      
  }  
  
  /**
   * 
   */
  private AWSCredentials getAWSCredentials () {
    String accessKey = System.getProperty("AWS_ACCESS_KEY_ID");
    
    if (accessKey == null) {
      M_log.info ("Unable to load access key, trying alternative ...");
      accessKey = System.getProperty("ALTERNATE_ACCESS_KEY_ENV_VAR");
    }
    String secretKey = System.getProperty("AWS_SECRET_ACCESS_KEY");
    if (secretKey == null) {
      M_log.info ("Unable to load secret key, trying alternative ...");
      secretKey = System.getProperty("ALTERNATE_SECRET_KEY_ENV_VAR");
    }
    accessKey = StringUtils.trim(accessKey);
    secretKey = StringUtils.trim(secretKey);
    String sessionToken = StringUtils.trim(System.getenv("AWS_SESSION_TOKEN_ENV_VAR"));
    
    if (StringUtils.isNullOrEmpty(accessKey) || StringUtils.isNullOrEmpty(secretKey)) {
      throw new SdkClientException(
          "Unable to load AWS credentials from environment variables ");
    }
    
    return sessionToken == null ? new BasicAWSCredentials(accessKey, secretKey) : new BasicSessionCredentials(accessKey, secretKey, sessionToken);    
  }
  
  /**
   * https://github.com/box/box-java-sdk/blob/main/doc/authentication.md#standard-3-legged-oauth-20
   * 
   * @return
   */
  public Boolean login () {
    
    return (true);
  }
  
  /** 
   * @return
   */
  public String getFolders () {
    JsonObjectBuilder builder=Json.createObjectBuilder();
    
    builder.add("return", "buckets");
    builder.add("request", "/api/v1/getfolders");
    
    JsonArrayBuilder dataBuilder=Json.createArrayBuilder();
                        
    AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(basicSessionCredentials)).withRegion(Regions.US_EAST_1).build();
    
    List<Bucket> buckets = s3Client.listBuckets();
    
    for (Bucket b : buckets) {        
      JsonObjectBuilder aBucket=Json.createObjectBuilder();
      
      aBucket.add("created",b.getCreationDate().toString());
      aBucket.add("name",b.getName());
      
      dataBuilder.add(aBucket);               
    }
    
    builder.add("data", dataBuilder);
    
    return (builder.build().toString());    
  }
  
  /** 
   * @return
   */
  public String GetData (String aFolder) {
    String bucket = aFolder;
    
    AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(basicSessionCredentials)).withRegion(Regions.US_EAST_1).build();
          
    System.out.println("The {S3} bucket contents for "+bucket+" are:");

    ListObjectsV2Result result = s3Client.listObjectsV2(bucket);
          
    JsonObjectBuilder builder=Json.createObjectBuilder();
    
    builder.add("return", "objects");
    builder.add("request", "/api/v1/getdata");
    builder.add("truncated", result.isTruncated());
    
    JsonArrayBuilder dataBuilder=Json.createArrayBuilder();      
    
    List<S3ObjectSummary> objects = result.getObjectSummaries();
    
    for (S3ObjectSummary os : objects) {        
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
}
