package com.knossys.rnd;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Base64;
import java.util.Date;
import java.util.Enumeration;
import java.util.logging.Logger;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpSession;

/**
 * @author vvelsen
 */
public class ServletTools {

	private static Logger M_log = Logger.getLogger(ServletTools.class.getName());

	private String URI = "";
	private StringBuilder contents = null;
	
	/**
	 *
	 */
	public static String getFileMimetype (String afilename) {
		MimetypesFileTypeMap mimeTypesMap = new MimetypesFileTypeMap();

		// only by file name
		String mimeType = mimeTypesMap.getContentType(afilename);

		// or by actual File instance
		/*
		File file = new File(afilename);
		mimeType = mimeTypesMap.getContentType(file);
		*/
		return (mimeType);
	}
	
	/**
	 * 
	 */	
	public static Date convertToDateViaSqlDate(String dateToConvert) {
		Date converted=new Date ();
		
		try {
      converted=java.sql.Date.valueOf(dateToConvert);
		} catch (Exception e) {
			DateFormat df = new SimpleDateFormat("MM/dd/yyyy"); 
			try {
			 converted = df.parse(dateToConvert);
			} catch (ParseException e1) {
			  converted=new Date ();
			}
		}
		
		return (converted);
  }	
	
	/**
	 * Essentially find the JSESSIONID value
	 * 
	 * @return
	 */
	public String getSessionId (HttpServletRequest request) {
		Cookie [] cookies=request.getCookies();
		
		if (cookies==null) {
			M_log.info("Internal error: no cookies object in this request");
			return (null);
		}
		
		for (int i=0;i<cookies.length;i++) {
			Cookie testCookie=cookies [i];
			if (testCookie.getName().equalsIgnoreCase("JSESSIONID")==true) {
				return (testCookie.getValue());
			}
		}
		
		return (null);
	}
	
	/**
	 * Essentially find the JSESSIONID value
	 * 
	 * @return
	 */
	public String getSessionCookie (HttpServletRequest request) {
		Cookie [] cookies=request.getCookies();
		
		for (int i=0;i<cookies.length;i++) {
			Cookie testCookie=cookies [i];
			if (testCookie.getName().equalsIgnoreCase("JSESSIONID")==true) {
				return (testCookie.getValue());
			}
		}
		
		return (null);
	}	
	
	/**
	 * @param request
	 */
	public void debugParameters(HttpServletRequest request) {
		Enumeration<String> parameterNames = request.getParameterNames();

		while (parameterNames.hasMoreElements()) {

			String paramName = parameterNames.nextElement();
			String[] paramValues = request.getParameterValues(paramName);
			StringBuffer paramBuffer = new StringBuffer();

			for (int i = 0; i < paramValues.length; i++) {
				if (i > 0) {
					paramBuffer.append(", ");
				}
				paramBuffer.append(paramValues[i]);
			}

			System.out.println("Parameter: " + paramName + ", value: " + paramBuffer.toString());
		}
	}

	/**
	 * @param request
	 */
	public void debugHeaders(HttpServletRequest request) {
		Enumeration<String> headerNames = request.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String headerName = headerNames.nextElement();
			System.out.println("Header Name - " + headerName + ", Value - " + request.getHeader(headerName));
		}
	}
	
	/**
	 * @param request
	 */
	public void debugCookies (HttpServletRequest request) {
		Cookie [] cookies=request.getCookies();
		
		String cookieString=request.getHeader("Cookie");
		
		System.out.println("Cookie string: " + cookieString);
		
		for (int i=0;i<cookies.length;i++) {
			Cookie testCookie=cookies [i];
			System.out.println("Cookie ["+i+"]["+testCookie.getName()+"]: " + testCookie.getValue() +", domain: " + testCookie.getDomain() + ", max age: " + testCookie.getMaxAge());
		}
	}

	/**
	 *
	 */
	public String getURI() {
		return URI;
	}

	/**
	 *
	 */
	public void setURI(String uRI) {
		URI = uRI;
	}

	/**
	*
	*/
	public boolean doesFileExist(String aFileURI) {
		aFileURI = convert(aFileURI);

		File file = new File(aFileURI);

		boolean exists = file.exists();
		if (!exists) {
			return (false);
		}

		return (true);
	}

	/**
	 * Converts the given path to the path the OS the server runs on expects.
	 * 
	 * @param aPath
	 *          - A path to convert to
	 */
	public static String convert(String aPath) {
		// This will make sure that the proper separator is used without us saying
		// which system we use
		String slashed = aPath.replace('\\', File.separatorChar).replace('/', File.separatorChar);

		// This will ensure that users can use ~ in strings that have paths to their
		// home directory
		String homed = slashed.replaceFirst("^~", System.getProperty("user.home"));

		return (homed);
	}

	/**
	 *
	 */
	public String loadContents(String aFileURI) {
		M_log.info("loadContents (" + aFileURI + ")");

		aFileURI = convert(aFileURI);
		setURI(aFileURI);

		if (doesFileExist(aFileURI) == false) {
			M_log.info("Error, file does not exist: " + aFileURI);
			return (null);
		}

		File aFile = new File(aFileURI);

		contents = new StringBuilder();

		try {
			BufferedReader input = new BufferedReader(new FileReader(aFile));

			try {
				String line = null; // not declared within while loop

				/*
				 * readLine is a bit quirky : it returns the content of a line MHoopUS the
				 * newline. it returns null only for the END of the stream. it returns an empty
				 * String if two newlines appear in a row.
				 */
				while ((line = input.readLine()) != null) {
					contents.append(line);
					contents.append(System.getProperty("line.separator"));
				}
			} catch (IOException e) {
				return (null);
			} finally {
				input.close();
			}
		} catch (IOException ex) {
			ex.printStackTrace();
			return (null);
		}

		M_log.info("Loaded " + contents.length() + " characters");

		return (contents.toString());
	}

	/**
	 * @param aResource
	 * @return
	 */
	public String loadResource(String aResource) {
		M_log.info("loadResource (" + aResource + ")");

		URL resource = this.getClass().getResource(aResource);

		if (resource == null) {
			M_log.info("Error: unable to load resource from war file system.");
			return (null);
		}

		M_log.info("Loading war resource from: " + resource.toString());

		return (this.loadContents(resource.toString()));
	}

	/**
	 * @param aResource
	 * @return
	 */
	public String loadResourceFromWAR(ServletContext context, String aResource) {
		M_log.info("loadResourceFromWAR (" + aResource + ")");

		String pathConverter = getResourcePath(context, aResource);

		M_log.info ("Absolute path: " + pathConverter);
		
		return (this.loadContents(pathConverter));
	}

	/**
	 * 
	 * @param aResource
	 * @return
	 */
	public String getResourcePath(ServletContext context, String aResource) {
		M_log.info("getResourcePath (" + aResource + ")");
		
		File mapper=new File (aResource);
		URL resource = null;
		
    String dirtyPath="/WEB-INF/classes/" + mapper.getName();
    String mapped=dirtyPath.replaceAll("//","/");
		
    M_log.info ("Determining if this file exists in the war file: " + mapped);
    
		try {
			resource = context.getResource(mapped);
		} catch (MalformedURLException e) {
			M_log.info("Resource not available in WAR file: " + e.getMessage());
			return (null);
		}

		if (resource == null) {
			M_log.info("Info: the requested resource path does not map to loadable file");
			return (null);
		}

		String pathConverter = null;

		try {
			pathConverter = resource.toURI().getPath();
		} catch (URISyntaxException e) {
			M_log.info("Unable to convert resource URL to file path");
			return (null);
		}

		return (pathConverter);
	}

	/**
	 * 
	 */
	public String getServiceURL(HttpServletRequest request) {
		String scheme = request.getScheme(); // http
		String serverName = request.getServerName(); // localhost
		int serverPort = request.getServerPort(); // 80
		String contextPath = request.getContextPath(); // /imsblis
		String servletPath = request.getServletPath(); // /ltitest
		String url = scheme + "://" + serverName + ":" + serverPort + contextPath + servletPath + "/";
		return url;
	}

	/**
	 * Content-Type
	 * 
	 * @return
	 */
	public Boolean isMultipart(HttpServletRequest request) {
		Enumeration<String> headerNames = request.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String headerName = headerNames.nextElement();
			// System.out.println("Header Name - " + headerName + ", Value - " +
			// request.getHeader(headerName));
			if (headerName.equalsIgnoreCase("Content-Type") == true) {
				String tester = request.getHeader(headerName);

				if (tester.indexOf("multipart/form-data") != -1) {
					return (true);
				}
			}
		}

		return (false);
	}

	/**
	 * Prints the request.
	 *
	 * @param httpServletRequest
	 *          the http servlet request
	 */
	public void printRequest(final HttpServletRequest httpServletRequest) {
		M_log.info("printRequest ()");

		if (httpServletRequest == null) {
			M_log.info("Error httpServletRequest is null");
			return;
		}
		M_log.info("----------------------------------------");
		M_log.info("W4 HttpServletRequest");
		M_log.info("\tRequestURL : " + httpServletRequest.getRequestURL());
		M_log.info("\tRequestURI : " + httpServletRequest.getRequestURI());
		M_log.info("\tScheme : " + httpServletRequest.getScheme());
		M_log.info("\tAuthType : " + httpServletRequest.getAuthType());
		M_log.info("\tEncoding : " + httpServletRequest.getCharacterEncoding());
		M_log.info("\tContentLength : " + httpServletRequest.getContentLength());
		M_log.info("\tContentType : " + httpServletRequest.getContentType());
		M_log.info("\tContextPath : " + httpServletRequest.getContextPath());
		M_log.info("\tMethod : " + httpServletRequest.getMethod());
		M_log.info("\tPathInfo : " + httpServletRequest.getPathInfo());
		M_log.info("\tProtocol : " + httpServletRequest.getProtocol());
		M_log.info("\tQuery : " + httpServletRequest.getQueryString());
		M_log.info("\tRemoteAddr : " + httpServletRequest.getRemoteAddr());
		M_log.info("\tRemoteHost : " + httpServletRequest.getRemoteHost());
		M_log.info("\tRemotePort : " + httpServletRequest.getRemotePort());
		M_log.info("\tRemoteUser : " + httpServletRequest.getRemoteUser());
		M_log.info("\tSessionID : " + httpServletRequest.getRequestedSessionId());
		M_log.info("\tServerName : " + httpServletRequest.getServerName());
		M_log.info("\tServerPort : " + httpServletRequest.getServerPort());
		M_log.info("\tServletPath : " + httpServletRequest.getServletPath());

		M_log.info("");
		M_log.info("\tCookies");
		int i = 0;
		for (final Cookie cookie : httpServletRequest.getCookies()) {
			M_log.info("\tCookie[{}].name=" + i + " " + cookie.getName());
			M_log.info("\tCookie[{}].comment=" + i + " " + cookie.getComment());
			M_log.info("\tCookie[{}].domain=" + i + " " + cookie.getDomain());
			M_log.info("\tCookie[{}].maxAge=" + i + " " + cookie.getMaxAge());
			M_log.info("\tCookie[{}].path=" + i + " " + cookie.getPath());
			M_log.info("\tCookie[{}].secured=" + i + " " + cookie.getSecure());
			M_log.info("\tCookie[{}].value=" + i + " " + cookie.getValue());
			M_log.info("\tCookie[{}].version=" + i + " " + cookie.getVersion());
			i++;
		}
		M_log.info("\tDispatcherType : " + httpServletRequest.getDispatcherType());
		M_log.info("");

		M_log.info("\tHeaders");
		int j = 0;
		final Enumeration<String> headerNames = httpServletRequest.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			final String headerName = headerNames.nextElement();
			final String header = httpServletRequest.getHeader(headerName);
			M_log.info("\tHeader[{}].name=" + j + " " + headerName);
			M_log.info("\tHeader[{}].value=" + j + " " + header);
			j++;
		}

		M_log.info("\tLocalAddr : " + httpServletRequest.getLocalAddr());
		M_log.info("\tLocale : " + httpServletRequest.getLocale());
		M_log.info("\tLocalPort : " + httpServletRequest.getLocalPort());

		M_log.info("");
		M_log.info("\tParameters");
		int k = 0;
		final Enumeration<String> parameterNames = httpServletRequest.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			final String paramName = parameterNames.nextElement();
			final String paramValue = httpServletRequest.getParameter(paramName);
			M_log.info("\tParam[" + k + "].name=" + k + " " + paramName);
			M_log.info("\tParam[" + k + "].value=" + k + " " + paramValue);
			k++;
		}

		M_log.info("");
		M_log.info("\tParts");
		int l = 0;
		try {
			for (final Object part : httpServletRequest.getParts()) {
				if (part != null) {
					M_log.info("\t Parts[" + l + "].class=" + part.getClass());
					M_log.info("\t Parts[" + l + "].value=" + part.toString());
				} else {
					M_log.info("Parts [" + l + "] does not exist");
				}
				l++;
			}
		} catch (final Exception e) {
			M_log.info("Exception e: " + e.getMessage());
		}

		printSession(httpServletRequest.getSession());
		printUser(httpServletRequest.getUserPrincipal());

		/*
		 * try { M_log.info("Request Body : " +
		 * IOUtils.toString(httpServletRequest.getInputStream(),
		 * httpServletRequest.getCharacterEncoding())); M_log.info("Request Object : " +
		 * new ObjectInputStream(httpServletRequest.getInputStream()).readObject()); }
		 * catch (final Exception e) { M_log.info("Exception e" + e.getMessage()); }
		 */

		M_log.info("----------------------------------------");
	}

	/**
	 * Prints the session.
	 *
	 * @param session
	 *          the session
	 */
	public static void printSession(final HttpSession session) {
		M_log.info("printSession ()");

		if (session == null) {
			M_log.info("No session");
			return;
		}

		M_log.info("\tSession Attributes");
		M_log.info("\tSession.id:  " + session.getId());
		M_log.info("\tSession.creationTime:  " + session.getCreationTime());
		M_log.info("\tSession.lastAccessTime:  " + session.getLastAccessedTime());
		M_log.info("\tSession.maxInactiveInterval:  " + session.getMaxInactiveInterval());

		int k = 0;
		final Enumeration<String> attributeNames = session.getAttributeNames();
		while (attributeNames.hasMoreElements()) {
			final String paramName = attributeNames.nextElement();
			final Object paramValue = session.getAttribute(paramName);
			M_log.info("\tSession Attribute[{}].name=" + k + " " + paramName);
			if (paramValue.getClass() != null) {
				M_log.info("\tSession Attribute[{}].class=" + k + " " + paramValue.getClass());
			}
			M_log.info("\tSession Attribute[{}].value=" + k + " " + paramValue);
			k++;
		}

	}

	/**
	 * Prints the user.
	 *
	 * @param userPrincipal
	 *          the user principal
	 */
	public static void printUser(final Principal userPrincipal) {
		M_log.info("printUser ()");

		if (userPrincipal == null) {
			M_log.info("User Authentication : none");
			return;
		} else {
			M_log.info("User Authentication.name :  " + userPrincipal.getName());
			M_log.info("User Authentication.class :  " + userPrincipal.getClass());
			M_log.info("User Authentication.value :  " + userPrincipal);
		}
	}

	/**
	 * @param aString
	 * @return
	 */
	public static String stringEncode(String aString) {
		byte[] bytes;
		try {
			bytes = aString.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			return (null);
		}
		String encoded = Base64.getEncoder().encodeToString(bytes);
		return (encoded);
	}

	/**
	 * @param aString
	 * @return
	 */
	public static String stringDecode(String aString) {
		byte[] decoded = Base64.getDecoder().decode(aString);
		return (new String(decoded));
	}

	/**
	 * @param request
	 * @return
	 * @throws IOException
	 */
	public static String getBody(HttpServletRequest request) throws IOException {
		String body = null;
		StringBuilder stringBuilder = new StringBuilder();
		BufferedReader bufferedReader = null;

		try {
			InputStream inputStream = request.getInputStream();
			if (inputStream != null) {
				bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
				char[] charBuffer = new char[128];
				int bytesRead = -1;
				while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
					stringBuilder.append(charBuffer, 0, bytesRead);
				}
			} else {
				stringBuilder.append("");
			}
		} catch (IOException ex) {
			throw ex;
		} finally {
			if (bufferedReader != null) {
				try {
					bufferedReader.close();
				} catch (IOException ex) {
					throw ex;
				}
			}
		}

		body = stringBuilder.toString();
		return body;
	}
}
