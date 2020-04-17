'use strict';
var AWS = require('aws-sdk');

async function sender(input) {
  const { BigQuery } = require("@google-cloud/bigquery");
  const file = "covidselfreport-272015-98a7fa8f1eac.json";
  let options = {
    projectId: "covidselfreport-272015",
    datasetId: "data",
    tableId: "smsnums",
    keyFilename: file
  };
  let payload = [];
  let date = new Date(Date.now())
    .toISOString()
    .replace("T", " ")
    .split(".")[0];
  input.forEach(z => payload.push({ date: date, number: z }));

  const bigquery = new BigQuery(options);
  return await bigquery
    .dataset("data")
    .table("smsnums")
    .insert(payload);
}

async function sendsms(number){
 console.log("GOT HERE!!!!!!!!!!!!!")
 var aws_region = "eu-west-1";
 // var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
 // AWS.config.credentials = credentials;
 // var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
 // AWS.config.credentials = credentials;
 AWS.config.update({region:aws_region});
 var pinpoint = new AWS.Pinpoint({apiVersion: '2016-12-01'});

var destinationNumber = number;

  var params = {
    ApplicationId: "3185fed2335d430e85f4e49058be5108",
    MessageRequest: {
      Addresses: {
        [destinationNumber]: {
          "BodyOverride": "Dear friend, please report your covid health status on https://covidselfreport.co.za",
          ChannelType: 'SMS'
        }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: "Dear friend, please report your covid health status on https://covidselfreport.co.za",
          MessageType: "PROMOTIONAL",
           SenderId: "AWS",
        }
      }
    }
  };

  let y = await pinpoint.sendMessages(params).promise();
  console.log(y)

}



async function getter(input) {
  const { BigQuery } = require("@google-cloud/bigquery");
  const file = "covidselfreport-272015-98a7fa8f1eac.json";
  let options = {
    projectId: "covidselfreport-272015",
    datasetId: "data",
    tableId: "smsnums",
    keyFilename: file
  };
  const bigquery = new BigQuery(options);
  let qrystring = "";
  input.forEach((z, idx) => {
    if (idx < input.length - 1) qrystring += ` number='` + z + `' or `;
    else qrystring += ` number='` + z + `'`;
  });
  const sqlQuery =
    `SELECT   number, max(date) as date   FROM \`covidselfreport-272015.data.smsnums\` where ` +
    qrystring +
    ` group by number`;
  const qryoptions = {
    query: sqlQuery,
    // Location must match that of the dataset(s) referenced in the query.
    location: "US"
  };
  return await bigquery.query(qryoptions);
}

exports.handler = async event => {
  // TODO implement
  // let body = JSON.parse(event)
  let nums = JSON.parse(event.body);
  let res = await getter(nums);
  let out = [];
  nums.forEach(z => out.push({ number: z, date: null }));
  out.forEach(z => {
    let found = res[0].find(a => a.number === z.number);
    if (found) {
      z.date = new Date(found.date.value + ".000Z");
    } else {
      z.date = new Date("2000-01-01T00:00:00.000Z");
    }
  });
  let today = new Date(Date.now());
  today.setHours(today.getHours() - 0);
  out = out.filter(z => z.date < today);
  if (out.length > 0) {
    let newnums = [];
    out.forEach(z => newnums.push(z.number));
    await sender(newnums);
    await Promise.all(newnums.map(sendsms))

  }
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://covidselfreport.co.za",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST"
    },
    body: JSON.stringify({ result: "thanks" })
  };
  return response;
};
