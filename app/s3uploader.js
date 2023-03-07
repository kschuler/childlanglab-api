/*global crypto*/
const crypto = require("crypto");
const CreateUUID = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  );
const S3 = require("aws-sdk/clients/s3");

/**
* Use AWS SDK to create pre-signed POST data.
* We also put a file size limit (100B - 10MB).
* @param key
* @param contentType
* @returns {Promise<object>}
*/
const createPresignedPost = ({ key, contentType }) => {
  const s3 = new S3({endpoint: 'nyc3.digitaloceanspaces.com'});
  console.log("key",key,"contentType",contentType);
  const params = {
    Expires: 60,
    Bucket: "recordings.childlanglab",
    Fields: {
      "Content-Type": contentType,
      key
    }
  };
  return new Promise(async (resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};
/**
* We need to respond with adequate CORS headers.
* @type Access-Control-Allow-Origin
*/
const headers = {
  "Access-Control-Allow-Origin": "https://upenn.pcibex.net",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Methods": "OPTIONS,GET",
  "Access-Control-Allow-Headers": "content-type"
};
module.exports.getPresignedPost = async (event,context) => {
  try {
    const { filename , mimetype } = event.queryStringParameters;
    const presignedPostData = await createPresignedPost({
      key: `${CreateUUID()}_${filename}`,
      contentType: mimetype
    });
    const r = presignedPostData.fields;
    r.url = presignedPostData.url;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(r)
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: true,
        data: null,
        message: e.message
      })
    };
  }
};