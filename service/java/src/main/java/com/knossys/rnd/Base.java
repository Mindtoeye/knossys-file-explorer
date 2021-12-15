package com.knossys.rnd;

import java.io.IOException;
import java.io.Writer;
import java.util.logging.Logger;

import org.apache.commons.codec.binary.Base64;

/**
 * @author vvelsen
 */
public class Base {

	private String className = "Unknown";
	private String name = "Unknown";

	public static String lastError = "All's well";
	private static Logger M_log = Logger.getLogger(Base.class.getName());
	public static Writer logOut = null;

	/**
	 * 
	 */
	public String getClassName() {
		return className;
	}

	/**
	 * 
	 */
	public void setClassName(String className) {
		this.className = className;
	}

	/**
	 * 
	 */
	public String getName() {
		return name;
	}

	/**
	 * 
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @param aMessage
	 */
	protected void debug(String aMessage) {
		M_log.info(aMessage);

		if (Base.logOut != null) {
			try {
				Base.logOut.write(aMessage);
				Base.logOut.write("\n");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			try {
				Base.logOut.flush();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			// System.out.println("Bing!");
		}
	}

	/**
	 * 
	 * @param aMessage
	 */
	public static void debugStatic(String aMessage) {
		System.out.println (aMessage);
		//logger.info(aMessage);
	}

	/**
	 * 
	 * @param anError
	 */
	public static void setError(String anError) {
		// TODO Auto-generated method stub

	}

	/**
	 * 
	 * @param aMessage
	 */
	public static String getLastError() {
		return (lastError);
	}

	/**
	 * 
	 * @param aMessage
	 */
	public static String getLastErrorEncoded() {
		byte[] encodedBytes = Base64.encodeBase64(lastError.getBytes());

		String encodedError = new String(encodedBytes);

		return (encodedError);
	}

	/**
	 * 
	 * @param aMessage
	 */
	public static void setLastError(String aMessage) {
		lastError = aMessage;
		/*
		if (logger != null) {
			logger.info("Setting lastError to: " + aMessage);
		} else {
			Base.debugStatic(aMessage);
		}
		*/
		Base.debugStatic(aMessage);
	}
}
