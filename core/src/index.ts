import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";
import { format as DateFormat } from "date-fns";

const REGION = "eu-central-1";
const sns = new SNSClient({ region: REGION });

const fanoutTopicArn = process.env.FANOUT_TOPIC_ARN;
const itemsToCreate = process.env.ITEMS_TO_CREATE || "1";

// https://gitlab.com/inkscape/inkscape/-/jobs/997420788
const PROJECT_ID = 3472737;
const JOB_ID = 997420788;

const awsDateFormat = "yyyy-MM-dd'T'HH:mm:ss.sss'Z'";

const formatDate = (date: Date) =>
  DateFormat(new Date(date), awsDateFormat);

export const handler = async (): Promise<void> => {
  let loopCount = 0;
  try {
    loopCount = parseInt(itemsToCreate, 10);
  } catch (e) {
    console.error(e);
  }

  const sentMessageIds = [];
  try {
    for (let i = 0; i < loopCount; i++) {
      const messagePayload = {
        jobId: JOB_ID,
        projectId: PROJECT_ID,
        id: uuidv4(),
        payload: {},
        meta: {
          runtimes: {
            coreStartDatetime: formatDate(new Date())
          },
          queues: {
    
          }
        }
      };
    
      const params = {
        Subject: "WORKER There will be subject " + new Date().getTime(),
        Message: JSON.stringify(messagePayload),
        TopicArn: fanoutTopicArn,
        MessageAttributes: {
          data_type: { DataType: "String", StringValue: "pipelinejob" },
        },
      };

      const message = await sns.send(new PublishCommand(params));
      sentMessageIds.push(message.MessageId);
    }
  } catch (e) {
    console.log("Error", e);
  }
  console.log(
    `Sent ${sentMessageIds.length} messages: ${sentMessageIds.join(", ")}`
  );
};
