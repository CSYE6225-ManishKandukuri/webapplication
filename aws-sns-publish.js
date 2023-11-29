const logger = require('./logger/log');
const AWS = require('aws-sdk');

//const awsProfile = 'sbanala2dev';
//AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: awsProfile });
const snsTopicArn = process.env.ARNSNSTOPIC;
const snsregion = process.env.AWS_SNS_REGION;
AWS.config.update({ region: 'us-east-1' });
const sns = new AWS.SNS();

const publishMessageToSNS = async (request, response) => {
  const message = `Assignment posted by User - ${request.user_email} for Assignment ID - ${request.assignmentID}`;

  const attributes = {
    submission_url: {
      DataType: "String",
      StringValue: request.submission_url
    },
    user_email: {
      DataType: "String",
      StringValue: request.user_email
    },
    assignmentID: {
      DataType: "String",
      StringValue: request.assignmentID,
    },
    submissionID: {
      DataType: "String",
      StringValue: request.submissionID,
    }
  };

  const params = {
    TopicArn: snsTopicArn,
    Message: message,
    MessageAttributes: attributes
  };

  console.log(params);

  try {
    const data = await new Promise((resolve, reject) => {
      sns.publish(params, (error, result) => {
        if (error) {
          logger.error(`Error in publishing the message to SNS: ${error.message}`);
          reject(error);
        } else {
          logger.info(`Successfully Published Message to SNS with Message ID - ${result.MessageId}`);
          resolve(result);
        }
      });
    });

    return data;
  } catch (error) {
    return error;
  }
};

module.exports = publishMessageToSNS;
