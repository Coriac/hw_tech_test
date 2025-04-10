const PE_CLIENT_ID = process.env.PE_CLIENT_ID;
const PE_CLIENT_SECRET = process.env.PE_CLIENT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

console.log(JSON.stringify(process.env.MONGO_URI));

module.exports = {
  PE_CLIENT_ID,
  PE_CLIENT_SECRET,
  MONGO_URI,
};
