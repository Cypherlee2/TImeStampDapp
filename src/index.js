const { hexToString, stringToHex } = require("viem");
const crypto = require('crypto');

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const documentHashes = {};

function hashDocument(document) {
  return crypto.createHash('sha256').update(document).digest('hex');
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payloadString = hexToString(data.payload);
  console.log(`Converted payload: ${payloadString}`);

  try {
    const payload = JSON.parse(payloadString);
    let response;

    switch (payload.action) {
      case "timestamp":
        const hash = hashDocument(payload.document);
        const timestamp = Date.now();
        documentHashes[hash] = timestamp;
        response = `Document timestamped. Hash: ${hash}, Timestamp: ${timestamp}`;
        break;
      case "verify":
        const storedTimestamp = documentHashes[payload.hash];
        response = storedTimestamp
          ? `Document verified. Timestamp: ${storedTimestamp}`
          : "Document not found or not timestamped";
        break;
      default:
        response = "Invalid action";
    }

    const outputStr = stringToHex(response);
    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: outputStr }),
    });
  } catch (error) {
    console.error("Error processing request:", error);
  }
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const payload = data["payload"];
  const route = hexToString(payload);

  let responseObject;
  if (route === "all_timestamps") {
    responseObject = JSON.stringify(documentHashes);
  } else if (route === "hashes") {
    responseObject = JSON.stringify(Object.keys(documentHashes));
  } else {
    responseObject = "route not implemented";
  }

  const report_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: stringToHex(responseObject) }),
  });

  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();