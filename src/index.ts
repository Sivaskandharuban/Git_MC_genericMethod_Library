// module.exports exports the function getContests as a promise and exposes it as a module.
// we can import an exported module by using require().
const axios = require("axios");
export default class mcGenericMethods {
  public async getOAuthAccessToken(
    clientId: any,
    clientSecret: any,
    grantType: string,
    code: any,
    redirect_uri: any
  ) {
    // Importing the Axios module to make API requests
    let result: any;

    let postBody;
    let headers = {
      "Content-Type": "application/json",
    };

    if (grantType === "client_credentials") {
      postBody = {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      };
    } else if (grantType === "authorization_code") {
      postBody = {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirect_uri,
      };
    }

    let sfmcAuthServiceApiUrl =
      "https://mcj6cy1x9m-t5h5tz0bfsyqj38ky.auth.marketingcloudapis.com/v2/token";

    await axios // Making a GET request using axios and requesting information from the API
      .post(sfmcAuthServiceApiUrl, postBody, { headers: headers })
      .then((response: any) => {
        // If the GET request is successful, this block is executed
        result = response; // The response of the API call is passed on to the next block
      })
      .catch((err: any) => {
        result = "Error getting access token >>> ";
        result += err; // Error handler
      });
    return result; // The contest data is returned
  }

  //Helper method to get refresh token
  public async getRefreshToken(
    refreshToken: string,
    tssd: string,
    clientId: any,
    clientSecret: any
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let sfmcAuthServiceApiUrl =
        "https://" + tssd + ".auth.marketingcloudapis.com/v2/token";
      let headers = {
        "Content-Type": "application/json",
      };
      console.log("sfmcAuthServiceApiUrl:" + sfmcAuthServiceApiUrl);
      let postBody1 = {
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      };
      await axios
        .post(sfmcAuthServiceApiUrl, postBody1, { headers: headers })
        .then((response: any) => {
          const customResponse = {
            refreshToken: response.data.refresh_token,
            oauthToken: response.data.access_token,
          };
          return resolve(customResponse);
        })
        .catch((error: any) => {
          let errorMsg = "Error getting refresh Access Token.";
          errorMsg += "\nMessage: " + error.message;
          errorMsg +=
            "\nStatus: " + error.response ? error.response.status : "<None>";
          errorMsg +=
            "\nResponse data: " + error.response
              ? JSON.stringify(error.response.data)
              : "<None>";
          return reject(errorMsg);
        });
    });
  }
}
