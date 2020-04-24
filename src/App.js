import React from "react";
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      otherNumberCount: [1, 1, 1],
      payload: {
        language: "english",
        country: "ZA",
        type: "self",
        id: "",
        phone: "",
        fine: false,
        sicksuspect: false,
        sicknotsuspect: false,
        sickconfirmed: false,
        recovered: false,
        fever: false,
        pain: false,

        cough: false,
        gps: { text: "", geo: { latitude: "", longitude: "" } },
        otherpeople: ["", "", ""],
      },
      done: false,
      wait: false,
      errorCheck: false,
      languageList: ["English", "isiZulu", "Venda"],
      text: {
        english: {
          header: "Covid 19 self reporting",
          line1:
            "Report your Covid19 status so we can monitor the spread of the virus",
          line2: "Your ID and phone number are not shared with 3rd parties.",
          yourid: "Your ID #",
          yourmobile: "Your phone #",
          yourstatus: "Your status",
          optionfine: "Fine. Not sick",
          optionsicknoncovid: "Sick. Covid19 not suspected",
          optionsickcovid: "Sick. Confirmed Covid19",
          optionsicksuspect: "Sick. Suspect Covid",
          optionrecovered: "Recovered",
          optionfever: "Fever",
          optioncoughing: "Coughing",
          optionpain: "Pain",
          otherpeople:
            "If you've been in close contact with others in the last week, please add their phone numbers here so we can ask them their status.",
          submitreport: "Submit your report",
          addnumbutton: "Add another number",
          yourlocation: "Your address",
          usegps: "Use phone GPS",
          ormanualgps: "or, manually add address",
          copytext: "Copy and send text to your friend",
          invitetext:
            "Dear friend, please report your covid health status on https://covidselfreport.co.za",
        },
        isizulu: {
          header: "ZZCovid 19 self reporting",
          line1:
            "ZReport your Covid19 status so we can monitor the spread of the virus",
          line2: "Your ID and phone number are not shared with 3rd parties.",
          yourid: "Your ID #",
          yourmobile: "Your phone #",
          yourstatus: "ZZZYour status",
          optionfine: "Fine. Not sick",
          optionsicknoncovid: "Sick. Covid19 not suspected",
          optionsickcovid: "Sick. Confirmed Covid19",
          optionsicksuspect: "Sick. Suspect Covid",
          optionrecovered: "Recovered",
          optionfever: "Fever",
          optioncoughing: "Coughing",
          optionpain: "Pain",
          otherpeople:
            "If you've been in close contact with others in the last week, please add their phone numbers here so we can ask their status.",
          submitreport: "Submit your report",
          addnumbutton: "Add another number",
          yourlocation: "Your address",
          usegps: "Use phone GPS",
          ormanualgps: "or, manually add address",
          copytext: "Copy and send text to your friend",
          invitetext:
            "Dear friend, please report your covid health status on https://covidselfreport.co.za",
        },
        venda: {
          header: "VVCovid 19 self reporting",
          line1:
            "VReport your Covid19 status so we can monitor the spread of the virus",
          line2: "VYour ID and phone number are not shared with 3rd parties.",
          yourid: "Your ID #",
          yourmobile: "Your phone #",
          yourstatus: "VVVYour status",
          optionfine: "Fine. Not sick",
          optionsicknoncovid: "Sick. Covid19 not suspected",
          optionsickcovid: "Sick. Confirmed Covid19",
          optionsicksuspect: "Sick. Suspect Covid",
          optionrecovered: "Recovered",
          optionfever: "Fever",
          optioncoughing: "Coughing",
          optionpain: "Pain",
          otherpeople:
            "If you've been in close contact with others in the last week, please add their phone numbers here so we can ask their status.",
          submitreport: "Submit your report",
          addnumbutton: "Add another number",
          yourlocation: "Your address",
          usegps: "Use phone GPS",
          ormanualgps: "or, manually add address",
          copytext: "Copy and send text to your friend",
          invitetext:
            "Dear friend, please report your covid health status on https://covidselfreport.co.za",
        },
      },
    };
  }
  updatePayload(item, input) {
    let payload = this.state.payload;
    payload[item] = input;
    this.setState({ payload });
  }
  updateChecks(item, input) {
    let payload = this.state.payload;
    payload.fine = false;
    payload.sicksuspect = false;
    payload.sicknotsuspect = false;
    payload.sickconfirmed = false;
    payload.recovered = false;
    payload[item] = input;
    this.setState({ payload });
  }
  updateSymptom(item, input) {
    let payload = this.state.payload;
    payload[item] = input;
    this.setState({ payload });
  }
  getGPS() {
    if ("geolocation" in navigator) {
      window.navigator.geolocation.getCurrentPosition((success) => {
        let payload = this.state.payload;
        payload.gps.geo = {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        };
        this.setState({ payload });
      });
    }
  }
  async sendInfo() {
    this.setState({ wait: true, done: false });
    let s = await fetch(
      "https://dv1hr88i1c.execute-api.eu-west-1.amazonaws.com/production/covidsend",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.payload),
      }
    );
    let r = await s.json();
    if (r) this.setState({ done: true, wait: false });
    this.setState({
      error: false,
      otherNumberCount: [1, 1, 1],
      payload: {
        language: "english",
        id: "",
        phone: "",
        country: "ZA",
        type: "self",
        fine: false,
        sicksuspect: false,
        sicknotsuspect: false,
        sickconfirmed: false,
        recovered: false,
        fever: false,
        pain: false,
        cough: false,
        gps: { text: "", geo: { latitude: "", longitude: "" } },
        otherpeople: ["", "", ""],
      },
    });
    let nums = this.state.payload.otherpeople.filter((z) => z !== "");
    nums = [...new Set(nums)];
    if (nums.length > 0) {
      // console.log(nums);
      let p = await fetch(
        "https://dv1hr88i1c.execute-api.eu-west-1.amazonaws.com/production/covidsms",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nums),
        }
      );
      let q = await p.json();
      // console.log(q);
    }
  }
  render() {
    return (
      <div style={{ marginLeft: 5, color: "#333" }}>
        {this.state.languageList.map((e, i) => (
          <button
            key={i}
            style={{
              color:
                e.toLowerCase() === this.state.payload.language
                  ? "#fff"
                  : "#000",
              fontWeight:
                e.toLowerCase() === this.state.payload.language
                  ? "bold"
                  : "normal",
              backgroundColor:
                e.toLowerCase() === this.state.payload.language
                  ? "#00f"
                  : "#ccc",
              borderWidth: 0,
              padding: 10,
              borderRadius: 3,
              margin: 3,
            }}
            onClick={() => {
              let payload = this.state.payload;
              payload.language = e.toLowerCase();
              this.setState({ payload });
            }}
          >
            {e}
          </button>
        ))}
        <h1>{this.state.text[this.state.payload.language].header}</h1>
        <p>{this.state.text[this.state.payload.language].line1}</p>
        <p>{this.state.text[this.state.payload.language].line2}</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ width: 100 }}>
            {this.state.text[this.state.payload.language].yourid}
          </div>

          <input
            value={this.state.payload.id}
            onChange={(change) => {
              this.updatePayload("id", change.target.value);
            }}
            type="tel"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ width: 100 }}>
            {this.state.text[this.state.payload.language].yourmobile}
          </div>

          <input
            value={this.state.payload.phone}
            onChange={(change) => {
              this.updatePayload("phone", change.target.value);
            }}
            type="tel"
          />
        </div>
        <div>
          <h2>{this.state.text[this.state.payload.language].yourstatus}</h2>
          <p>
            <input
              type="checkbox"
              checked={this.state.payload.fine}
              onChange={(change) => {
                this.updateChecks("fine", change.target.checked);
              }}
            />
            {this.state.text[this.state.payload.language].optionfine}
          </p>
          <p>
            <input
              type="checkbox"
              checked={this.state.payload.sicksuspect}
              onChange={(change) => {
                this.updateChecks("sicksuspect", change.target.checked);
              }}
            />
            {this.state.text[this.state.payload.language].optionsicksuspect}
          </p>
          <div style={{ marginLeft: 20 }}>
            <p>
              <input
                type="checkbox"
                checked={this.state.payload.fever}
                onChange={(change) => {
                  this.updateSymptom("fever", change.target.checked);
                }}
              />
              {this.state.text[this.state.payload.language].optionfever}
            </p>
            <p>
              <input
                type="checkbox"
                checked={this.state.payload.pain}
                onChange={(change) => {
                  this.updateSymptom("pain", change.target.checked);
                }}
              />
              {this.state.text[this.state.payload.language].optionpain}
            </p>
            <p>
              <input
                type="checkbox"
                checked={this.state.payload.cough}
                onChange={(change) => {
                  this.updateSymptom("cough", change.target.checked);
                }}
              />
              {this.state.text[this.state.payload.language].optioncoughing}
            </p>
          </div>
          <p>
            <input
              type="checkbox"
              checked={this.state.payload.sicknotsuspect}
              onChange={(change) => {
                this.updateChecks("sicknotsuspect", change.target.checked);
              }}
            />
            {this.state.text[this.state.payload.language].optionsicknoncovid}
          </p>
          <p>
            <input
              type="checkbox"
              checked={this.state.payload.sickconfirmed}
              onChange={(change) => {
                this.updateChecks("sickconfirmed", change.target.checked);
              }}
            />
            {this.state.text[this.state.payload.language].optionsickcovid}
          </p>
          <p>
            <input
              type="checkbox"
              checked={this.state.payload.recovered}
              onChange={(change) => {
                this.updateChecks("recovered", change.target.checked);
              }}
            />
            {this.state.text[this.state.payload.language].optionrecovered}
          </p>
          <h4>{this.state.text[this.state.payload.language].yourlocation}</h4>
          <p>
            <button
              style={{
                color: "#fff",
                fontWeight: "bold",
                backgroundColor: "#00f",
                borderWidth: 0,
                padding: 10,
                borderRadius: 3,
                margin: 3,
              }}
              onClick={() => {
                this.getGPS();
              }}
            >
              {this.state.text[this.state.payload.language].usegps}
            </button>
            {this.state.payload.gps.geo.latitude !== ""
              ? this.state.payload.gps.geo.latitude.toFixed(2) +
                "," +
                this.state.payload.gps.geo.longitude.toFixed(2)
              : ""}
          </p>
          <p>
            {this.state.text[this.state.payload.language].ormanualgps}
            <input
              value={this.state.payload.gps.text}
              onChange={(change) => {
                let payload = this.state.payload;
                payload.gps.text = change.target.value;
                this.setState({ payload });
              }}
              type="tel"
            />
          </p>
          <h4>{this.state.text[this.state.payload.language].otherpeople}</h4>
          {this.state.otherNumberCount.map((elem, ind) => (
            <p key={ind}>
              <input
                value={this.state.payload.otherpeople[ind]}
                onChange={(change) => {
                  let payload = this.state.payload;
                  payload.otherpeople[ind] = change.target.value;
                  this.setState({ payload });
                }}
                type="tel"
              />
            </p>
          ))}
          <p>
            <button
              style={{
                color: "#fff",
                fontWeight: "bold",
                backgroundColor: "#00f",
                borderWidth: 0,
                padding: 10,
                borderRadius: 3,
                margin: 3,
              }}
              onClick={() => {
                let otherNumberCount = this.state.otherNumberCount;
                otherNumberCount.push(1);
                let payload = this.state.payload;
                payload.otherpeople.push("");
                this.setState({ otherNumberCount, payload });
              }}
            >
              {this.state.text[this.state.payload.language].addnumbutton}
            </button>
          </p>
          <p style={{ color: "#f00" }}>
            {this.state.error === true
              ? "You must add your id and phone number"
              : ""}
          </p>
          <p style={{ color: "#0f0" }}>
            {this.state.done === true
              ? "Submitted. Thank you and stay safe!"
              : ""}
          </p>
          <p>{this.state.wait === true ? "Please wait..." : ""}</p>
          <p>
            <button
              style={{
                color: "#fff",
                fontWeight: "bold",
                backgroundColor: "#00f",
                borderWidth: 0,
                padding: 10,
                borderRadius: 3,
                margin: 3,
              }}
              onClick={() => {
                if (
                  this.state.payload.id.trim() === "" ||
                  this.state.payload.phone.trim() === ""
                ) {
                  this.setState({ error: true });
                } else {
                  this.sendInfo();
                }
              }}
            >
              {this.state.text[this.state.payload.language].submitreport}
            </button>
          </p>
        </div>
        <h4>{this.state.text[this.state.payload.language].copytext}</h4>
        <p>{this.state.text[this.state.payload.language].invitetext}</p>
      </div>
    );
  }
}
