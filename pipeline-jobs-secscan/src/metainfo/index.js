const https = require('https');
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-central-1" });
const sqs = new AWS.SQS();

let response;
const META_INFO_QUEUE_URL = process.env.META_INFO_QUEUE_URL;
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;

function httpGet(newOptions) {
  return new Promise((resolve, reject) => {
    const projectId = 3472737;
    const jobId = 997420788; // TODO move to core lambda with loop
    const defaults = {
        host: 'gitlab.com',
        path: `/api/v4/projects/${projectId}/jobs/${jobId}`,
        method: 'GET',
        timeout: 10000,
        headers: {
          "PRIVATE-TOKEN": GITLAB_TOKEN,
          "Content-Type": "application/json",
        },
    };

    const options = Object.assign({}, defaults, newOptions);

    const req = https.request(options, (res) => {
      console.log(`response.statusCode ${res.statusCode}`);
      let returnData = '';
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        res.on('data', (chunk => {
          returnData += chunk;
        }));
        
        res.on('end', () => {
          //console.log(returnData);
          resolve(returnData);
        });
      }
      
      //resolve('Success');
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    // send the request
    req.write('');
    req.end();
  });
}

// TODOs
/*
 * DLQ an diese Lambda für die ASYNC invokes
 * foreach durch irgendwas streamiges ersetzen
 * sns publish innerhalb des Streams
 */
exports.handler = async (event) => {
  console.info("metaInfoQueue URL is: " + META_INFO_QUEUE_URL);
  console.log(event);

  console.log("--- query gitlab");
  const glData = JSON.parse(await httpGet());
  const jobObject = {
    id: glData.id,
    status: glData.status,
    createdAt: glData.created_at,
    startedAt: glData.started_at,
    finishedAt: glData.finished_at,
    duration: glData.duration,
    securityScanDone: false
  };

  const traceArtifact = glData.artifacts.filter(artifact => artifact.file_type === 'trace')
  if (traceArtifact.length === 1) {
    jobObject.trace = {
      size: traceArtifact[0].size,
      sizeInKb: traceArtifact[0].size / 1024
    }
  } else {
    //TODO
    console.error("trace should be available only once")
  }

  console.log(jobObject);
  console.log("--- finish gitlab query");

  let dataContainer = {};
  let _attributes = {}

  //console.log(`found ${event.Records.length} records in event`);
  event.Records.forEach((record) => {
    console.log(record);
    const { body, attributes } = record;
    const bodyObj = JSON.parse(body);
    dataContainer = Object.assign({}, JSON.parse(bodyObj.Message)); // must be parsed as well
    _attributes = attributes;
    console.log(
      `some values are - subject: ${bodyObj.Subject}; message: ${bodyObj.Message}`
    );
    console.log(body);
    console.log(attributes);
    console.log(
      `meta attributes are - ApproximateReceiveCount: ${attributes.ApproximateReceiveCount}`
    );
  });

  try {
    console.log('writing to data container')
    dataContainer.payload = jobObject;
    dataContainer['meta']['queues'] = {
      queue: 'core-metainfo',
      ApproximateReceiveCount: parseInt(_attributes.ApproximateReceiveCount, 10)
    };
  } catch (e) {
    console.log(e);
  }
  console.log(dataContainer);

  var params = {
    MessageBody: JSON.stringify(dataContainer),
    QueueUrl: META_INFO_QUEUE_URL,
  };

  let data = "";
  try {
    data = await sqs.sendMessage(params).promise();
  } catch (e) {
    console.log(e);
  }

  console.log(`Queue return data is`);
  console.log(data);

  response = {
    statusCode: 200,
    body: JSON.stringify({
      status: "ok",
    }),
  };

  return response;
};