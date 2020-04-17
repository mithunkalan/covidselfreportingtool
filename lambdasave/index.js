async function sender(input){
  const { BigQuery } = require("@google-cloud/bigquery");
  const file = "covidselfreport-272015-98a7fa8f1eac.json";
  let options = {
    projectId: "covidselfreport-272015",
    datasetId: "data",
    tableId: "data",
    keyFilename: file
  };
  let payload = {}
  payload.date = (new Date(Date.now())).toISOString().replace("T"," ").split(".")[0]
  payload.country = input.country
  payload.type =input.type
  payload.language = input.language
  payload.id = input.id
  payload.phone = input.phone
  payload.fine = input.fine
  payload.sicksuspect = input.sicksuspect
  payload.sicknotsuspect = input.sicknotsuspect
  payload.sickconfirmed = input.sickconfirmed
  payload.recovered = input.recovered
  payload.fever = input.fever
  payload.pain = input.pain
  payload.cough = input.cough
  payload.gpstext = input.gps.text
  payload.latitude = null
  if (input.gps.geo.latitude !== "") payload.latitude = input.gps.geo.latitude
  payload.longitude = null
  if (input.gps.geo.longitude !== "") payload.longitude = input.gps.geo.longitude
  let list = input.otherpeople.filter(z=>z!=="")
  list = [...new Set(list)]
  payload.otherpeople = list.join(",")
  const bigquery = new BigQuery(options);
  return await bigquery
    .dataset("data")
    .table("data")
    .insert([payload]);
}

exports.handler = async(event) => {
    // TODO implement

    // let body = JSON.parse(event.body)
    // console.log(body)
    await sender(JSON.parse(event.body))
    const response = {
        statusCode: 200,
        'headers': {
            "Access-Control-Allow-Origin": "https://covidselfreport.co.za",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify({result:"thanks"})
    };
    return response;
};
