const https = require("https");
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-central-1" });
const sqs = new AWS.SQS();
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

let response;
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const S3_BUCKET = process.env.S3_BUCKET;

function httpGet(newOptions) {
  return new Promise((resolve, reject) => {
    const projectId = 3472737;
    const jobId = 997420788; // TODO move to core lambda with loop
    const defaults = {
      host: "gitlab.com",
      path: `/api/v4/projects/${projectId}/jobs/${jobId}`,
      method: "GET",
      timeout: 10000,
      headers: {
        "PRIVATE-TOKEN": GITLAB_TOKEN,
        "Content-Type": "application/json",
      },
    };

    const options = Object.assign({}, defaults, newOptions);

    const req = https.request(options, (res) => {
      console.log(`response.statusCode ${res.statusCode}`);
      let returnData = "";

      if (res.statusCode >= 200 && res.statusCode < 300) {
        res.on("data", (chunk) => {
          returnData += chunk;
        });

        res.on("end", () => {
          //console.log(returnData);
          resolve(returnData);
        });
      }

      //resolve('Success');
    });

    req.on("error", (e) => {
      reject(e.message);
    });

    // send the request
    req.write("");
    req.end();
  });
}

// TODO is this a good practice (having multiple functions in one file)
exports.handler = async (event) => {
  console.log(`found ${event.Records.length} records in event`);
  console.log(event.Records);

  // TODO loop records

  const { body, attributes } = event.Records[0];
  const bodyObj = JSON.parse(body);
  const dataContainer = Object.assign({}, bodyObj); // must be parsed as well
  console.log(dataContainer);

  const glData = await httpGet({
    path: `/api/v4/projects/3472737/jobs/997420788/trace`,
  });
  console.log(`string length ${glData.length}`);

  // TODO env & path from somewhere automated
  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: `dev/pipeline-jobs-secscan/${dataContainer.id}.json`,
    Body: JSON.stringify(dataContainer),
  };
  console.log(uploadParams);

  try {
    const s3Feedback = await s3.upload(uploadParams).promise();
    console.log(s3Feedback);
  } catch (e) {
    console.error(e);
  }

  response = {
    statusCode: 200,
    body: JSON.stringify({
      status: "ok",
    }),
  };

  return response;
};
