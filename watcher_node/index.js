require("dotenv").config();

const db = require("./db");

const getBTCBalances = () => {
  return db.query("SELECT recipient FROM btc_balance");
};

const addBalanceToAddress = (address, value = 0.0) => {
  console.log(
    `update btc_balance set amount = amount + ${value} WHERE recipient=\'${address}\'`
  );

  return db.query(
    `update btc_balance set amount = amount + ${value} WHERE recipient=\'${address}\'`
  );
};

const RpcClient = require("bitcoind-rpc");

const config = {
  protocol: "http",
  host: "127.0.0.1",
  user: process.env.BTCRPCUSER,
  pass: process.env.BTCRPCPWD,
  port: "18332"
};

const rpc = new RpcClient(config);
const zmq = require("zeromq");
const sock = zmq.socket("sub");
const addr = "tcp://127.0.0.1:29000";

function getRawTransaction(tx) {
  return new Promise((resolve, reject) => {
    rpc.getrawtransaction(tx.toString("hex"), 1, (err, resp) => {
      if (err || !resp) return reject(err);
      return resolve(resp);
    });
  });
}

async function decodeBlockHash(hash) {
  let { rows } = await getBTCBalances();
  rows = rows.map(row => row.recipient);

  rpc.getBlock(hash, async (err, resp) => {
    if (err || !resp) return console.error(err);

    //ideally needs a queue
    for (const tx of resp.result.tx) {
      if (!tx) continue;
      let value = await getRawTransaction(tx);
      if (!value) continue;
      for (const vout of value.result.vout) {
        if (!vout.scriptPubKey || !vout.scriptPubKey.addresses) continue;

        for (address of vout.scriptPubKey.addresses) {
          if (rows.indexOf(address) > -1) {
            addBalanceToAddress(address, vout.value);
          }
        }
      }
    }
  });
}

sock.connect(addr);
sock.subscribe("hash");

sock.on("message", function(topic, message) {
  if (topic == "rawtx") {
    rpc.decodeRawTransaction(message.toString("hex"), function(err, resp) {
      if (!resp || err) return console.error(resp, err);
      console.log(JSON.stringify(resp, null, 4));
    });
  } else if (topic == "hashblock") {
    let blockHash = message.toString("hex", 0, 80);
    console.log(blockHash);

    decodeBlockHash(blockHash);
  }
});
