package com.knossys.rnd;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.util.StringUtils;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.Map;
import java.util.Set;

/**
 * @author Martin van Velsen <vvelsen@knossys.com>
 */
public class BaseService extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private static Logger logger = Logger.getLogger(BaseService.class);

	private Boolean allowInsecureConnections = false;
		
	/**
	 * @param aMessage
	 */
	protected void debug(String aMessage) {
		logger.info(aMessage);
		//System.out.println(aMessage);
	}

	public AWSCredentials getCredentials() {
	  logger.info ("getCredentials ()");
	  
	  String accessKey = System.getProperty("AWS_ACCESS_KEY_ID");
	  
	  if (accessKey == null) {
	    logger.info ("Unable to load access key, trying alternative ...");
	    accessKey = System.getProperty("ALTERNATE_ACCESS_KEY_ENV_VAR");
	  }
	  String secretKey = System.getProperty("AWS_SECRET_ACCESS_KEY");
	  if (secretKey == null) {
	    logger.info ("Unable to load secret key, trying alternative ...");
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
	 * 
	 */
	protected Boolean isSecure(HttpServletRequest req, HttpServletResponse resp) {
		return (true);
	}

	/**
	 * 
	 */
	public Boolean getAllowInsecureConnections() {
		return allowInsecureConnections;
	}

	/**
	 * 
	 */
	public void setAllowInsecureConnections(Boolean allowInsecureConnections) {
		this.allowInsecureConnections = allowInsecureConnections;
	}

	/**
	 * 
	 */
	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		debug("doOptions ()");

		resp.setHeader("Access-Control-Allow-Origin", "*");
		resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD");
		resp.setHeader("Access-Control-Allow-Headers", "ctatsession, origin, content-type, accept, authorization");
	}

	/**
	 *
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.getWriter().write("Error: unrecognized command");
	}

	/**
	 *
	 * 
	 */
	public void init(ServletConfig config) {
		debug("SimonServiceBase has been initialized");
	}

	/**
	 * 
	 */
	protected String getServiceStatus() {
		StringBuffer report = new StringBuffer();

		RuntimeMXBean runtimeBean = ManagementFactory.getRuntimeMXBean();

		Map<String, String> systemProperties = runtimeBean.getSystemProperties();
		Set<String> keys = systemProperties.keySet();

		report.append("{\n");

		int ind = 0;

		for (String key : keys) {
			String value = systemProperties.get(key);

			if (key.equalsIgnoreCase("line.separator")) {

			} else {
				if (ind > 0) {
					report.append("\t\"" + key + "\" : \"" + value + "\"\n");
				} else {
					report.append("\t\"" + key + "\" : \"" + value + "\",\n");
				}
			}

			ind++;
		}

		report.append("}\n");

		return (report.toString());
	}

	/**
	 *
	 * @param targetURL
	 * @param urlParameters
	 * @return
	 */
	public static String excutePost(String targetURL, String urlParameters) {
		URL url;
		HttpURLConnection connection = null;

		try {
			// Create connection
			url = new URL(targetURL);
			connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

			connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
			connection.setRequestProperty("Content-Language", "en-US");

			connection.setUseCaches(false);
			connection.setDoInput(true);
			connection.setDoOutput(true);

			// Send request
			DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
			wr.writeBytes(urlParameters);
			wr.flush();
			wr.close();

			// Get Response
			InputStream is = connection.getInputStream();
			BufferedReader rd = new BufferedReader(new InputStreamReader(is));
			String line;
			StringBuffer response = new StringBuffer();

			while ((line = rd.readLine()) != null) {
				response.append(line);
				response.append('\r');
			}

			rd.close();

			return response.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return null;

		} finally {
			if (connection != null) {
				connection.disconnect();
			}
		}
	}

	/**
	 * 
	 * @param req
	 */
	public void listQueryParameters(HttpServletRequest req) {
		Enumeration<String> parameterNames = req.getParameterNames();

		while (parameterNames.hasMoreElements()) {

			String paramName = parameterNames.nextElement();
			debug(paramName);

			String[] paramValues = req.getParameterValues(paramName);

			for (int i = 0; i < paramValues.length; i++) {
				String paramValue = paramValues[i];
				debug("\t" + paramValue);
			}
		}
	}
}
