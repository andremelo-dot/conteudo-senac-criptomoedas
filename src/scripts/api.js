/** *****************************************************************************
 **
 ** FileName: APIWrapper.js
 **
 ****************************************************************************** */

/** *****************************************************************************
 **
 ** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
 ** exclusive, royalty free, license to use, modify and redistribute this
 ** software in source and binary code form, provided that i) this copyright
 ** notice and license appear on all copies of the software; and ii) Licensee does
 ** not utilize the software in a manner which is disparaging to CTC.
 **
 ** This software is provided "AS IS," without a warranty of any kind.  ALL
 ** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
 ** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
 ** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
 ** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
 ** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
 ** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
 ** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
 ** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
 ** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE POSSIBILITY
 ** OF SUCH DAMAGES.
 **
 ****************************************************************************** */

/** *****************************************************************************
 ** This file is part of the ADL Sample API Implementation intended to provide
 ** an elementary example of the concepts presented in the ADL Sharable
 ** Content Object Reference Model (SCORM).
 **
 ** The purpose in wrapping the calls to the API is to (1) provide a
 ** consistent means of finding the LMS API implementation within the window
 ** hierarchy and (2) to validate that the data being exchanged via the
 ** API conforms to the defined CMI data types.
 **
 ** This is just one possible example for implementing the API guidelines for
 ** runtime communication between an LMS and executable content components.
 ** There are several other possible implementations.
 **
 ** Usage: Executable course content can call the API Wrapper
 **      functions as follows:
 **
 **    javascript:
 **          var result = doLMSInitialize();
 **          if (result != true)
 **          {
 **             // handle error
 **          }
 **
 **    authorware
 **          result := ReadURL("javascript:doLMSInitialize()", 100)
 **
 ****************************************************************************** */

// Responsável por condicionar se as opções de debug serão ativas ou não.
let debug = $('body').attr('data-debug');

// Lista dos códigos de erros previstos na documentação do SCORM 1.2.
// https://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/
let errorCodes = {
  noError: 0,
  generalException: 101,
  serverBusy: 102,
  invalidArgumentError: 201,
  elementCannotHaveChildren: 202,
  elementIsNotAnArray: 203,
  notInitialized: 301,
  notImplementedError: 401,
  invalidSetValue: 402,
  elementIsReadOnly: 403,
  elementIsWriteOnly: 404,
  incorrectDataType: 405,
};

/** *****************************************************************************
 **
 ** Function findAPI(win)
 ** Inputs:  win - a Window Object
 ** Return:  If an API object is found, it's returned, otherwise null is returned
 **
 ** Description:
 ** This function looks for an object named API in parent and opener windows
 **
 ****************************************************************************** */
let scormAPI = null;

const findAPI = function (win) {
  let attempts = 0;

  if (scormAPI) {
    return scormAPI;
  }

  while (win.API == null && win.parent != null && win.parent != win) {
    attempts += 1;

    if (attempts > 7) {
      return 'false';
    }

    // eslint-disable-next-line no-param-reassign
    win = win.parent;
  }

  scormAPI = win.API;

  return scormAPI;
};

/** *****************************************************************************
 **
 ** Function getAPI()
 ** Inputs:  none
 ** Return:  If an API object is found, it's returned, otherwise null is returned
 **
 ** Description:
 ** This function looks for an object named API, first in the current window's
 ** frame hierarchy and then, if necessary, in the current window's opener window
 ** hierarchy (if there is an opener window).
 **
 ****************************************************************************** */
const getAPI = function () {
  let api = findAPI(window);

  if (api == null && window.opener != null && typeof window.opener != 'undefined') {
    api = findAPI(window.opener);
  }

  return api;
};

/** *****************************************************************************
 **
 ** Function ErrorHandler()
 ** Inputs:  None
 ** Return:  The current value of the LMS Error Code
 **
 ** Description:
 ** Determines if an error was encountered by the previous API call
 ** and if so, displays a message to the user.  If the error code
 ** has associated text it is also displayed.
 **
 ****************************************************************************** */
const errorHandler = function () {
  let api = scormAPI !== null ? scormAPI : getAPI();

  if (api == null) {
    return 'false';
  }

  let errCode = api.LMSGetLastError();

  if (errCode != errorCodes.noError) {
    let errDescription = api.LMSGetErrorString(errCode);

    if (debug === true) {
      errDescription += `\n${api.LMSGetDiagnostic(null)}`;

      throw new Error(`Error: ${errCode} | Description: ${errDescription}`);
    }
  }

  // eslint-disable-next-line consistent-return
  return errCode;
};

/** *****************************************************************************
 **
 ** Function: doLMSInitialize()
 ** Inputs:  None
 ** Return:  CMIBoolean true if the initialization was successful, or
 **          CMIBoolean false if the initialization failed.
 **
 ** Description:
 ** Initialize communication with LMS by calling the LMSInitialize
 ** function which will be implemented by the LMS.
 **
 ****************************************************************************** */
export const doLMSInitialize = function () {
  let api = scormAPI !== null ? scormAPI : getAPI();

  if (api == null) {
    return 'false';
  }

  let result = api.LMSInitialize('');

  if (result.toString() != 'true') {
    errorHandler();

    return 'false';
  }

  return result.toString();
};

/** *****************************************************************************
 **
 ** Function doLMSFinish()
 ** Inputs:  None
 ** Return:  CMIBoolean true if successful
 **          CMIBoolean false if failed.
 **
 ** Description:
 ** Close communication with LMS by calling the LMSFinish
 ** function which will be implemented by the LMS
 **
 ****************************************************************************** */
export const doLMSFinish = function () {
  let api = scormAPI !== null ? scormAPI : getAPI();

  return api == null ? 'false' : 'true';
};

/** *****************************************************************************
 **
 ** Function doLMSGetValue(name)
 ** Inputs:  name - string representing the cmi data model defined category or
 **             element (e.g. cmi.core.student_id)
 ** Return:  The value presently assigned by the LMS to the cmi data model
 **       element defined by the element or category identified by the name
 **       input value.
 **
 ** Description:
 ** Wraps the call to the LMS LMSGetValue method
 **
 ****************************************************************************** */
export const doLMSGetValue = function (name) {
  let api = scormAPI !== null ? scormAPI : getAPI();

  if (api == null) {
    let { hostname } = window.location;
    let localhost = hostname === '127.0.0.1' || hostname === 'localhost';
    let sessionStorageOptions = Object.prototype.hasOwnProperty.call(sessionStorage, name);

    // Verifica se o ambiente é localhost e se sim, busca as informações no sessionStorage.
    if (localhost && sessionStorageOptions) {
      return sessionStorage.getItem(name);
    }

    return '';
  }

  let value = api.LMSGetValue(name);
  let errCode = +api.LMSGetLastError();

  if (errCode != errorCodes.noError) {
    return '';
  }

  return value != null && typeof value === 'object' ? value.toString() : value;
};

/** *****************************************************************************
 **
 ** Function doLMSSetValue(name, value)
 ** Inputs:  name -string representing the data model defined category or element
 **          value -the value that the named element or category will be assigned
 ** Return:  CMIBoolean true if successful
 **          CMIBoolean false if failed.
 **
 ** Description:
 ** Wraps the call to the LMS LMSSetValue function
 **
 ****************************************************************************** */
export const doLMSSetValue = function (name, value) {
  let api = scormAPI !== null ? scormAPI : getAPI();

  if (api == null) {
    let { hostname } = window.location;
    let localhost = hostname === '127.0.0.1' || hostname === 'localhost';

    // Verifica se o ambiente é localhost e se sim, salva as informações no sessionStorage.
    if (localhost) {
      sessionStorage.setItem(name, value);
    }
  } else {
    let result = api.LMSSetValue(name, value);

    if (result.toString() != 'true') {
      errorHandler();
    }

    scormAPI = null;
    getAPI();
  }
};

/** *****************************************************************************
 **
 ** Function doLMSCommit()
 ** Inputs:  None
 ** Return:  None
 **
 ** Description:
 ** Call the LMSCommit function
 **
 ****************************************************************************** */
export const doLMSCommit = function () {
  let api = scormAPI !== null ? scormAPI : getAPI();

  if (api == null) {
    return 'false';
  }

  let result = api.LMSCommit('');

  if (result != 'true') {
    errorHandler();
  }

  return result.toString();
};

/** *****************************************************************************
 **
 ** Function doLMSGetLastError()
 ** Inputs:  None
 ** Return:  The error code that was set by the last LMS function call
 **
 ** Description:
 ** Call the LMSGetLastError function
 **
 ****************************************************************************** */
export const doLMSGetLastError = function () {
  let api = scormAPI !== null ? scormAPI : getAPI();

  // General Error
  return api == null ? errorCodes.generalException : api.LMSGetLastError().toString();
};

/** *****************************************************************************
 **
 ** Function doLMSGetErrorString(errorCode)
 ** Inputs:  errorCode - Error Code
 ** Return:  The textual description that corresponds to the input error code
 **
 ** Description:
 ** Call the LMSGetErrorString function
 **
 ******************************************************************************* */
export const doLMSGetErrorString = function (errorCode) {
  let api = scormAPI !== null ? scormAPI : getAPI();

  return api.LMSGetErrorString(errorCode).toString();
};

/** *****************************************************************************
 **
 ** Function doLMSGetDiagnostic(errorCode)
 ** Inputs:  errorCode - Error Code(integer format), or null
 ** Return:  The vendor specific textual description that corresponds to the
 **          input error code
 **
 ** Description:
 ** Call the LMSGetDiagnostic function
 **
 ****************************************************************************** */
export const doLMSGetDiagnostic = function (errorCode) {
  let api = scormAPI !== null ? scormAPI : getAPI();

  return api.LMSGetDiagnostic(errorCode).toString();
};

/** *****************************************************************************
 **
 ** Function LMSIsInitialized()
 ** Inputs:  none
 ** Return:  true if the LMS API is currently initialized, otherwise false
 **
 ** Description:
 ** Determines if the LMS API is currently initialized or not.
 **
 ****************************************************************************** */
export const LMSIsInitialized = function () {
  let api = scormAPI !== null ? scormAPI : getAPI();

  if (api == null) {
    return 'false';
  }

  let errCode = api.LMSGetLastError();

  if (errCode == errorCodes.notInitialized) {
    return 'false';
  }

  return true;
};