const jsonServer = require("json-server");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const fs = require("fs");
const jwt = require("jsonwebtoken");
erver.use(jsonServer.bodyParser);
server.use(middlewares);

const getUsersDb = () => {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "users.json"), "UTF-8")
  );
};

//加密字幅串
const SECRET = "FSDDFSDFSDFA123";
//持續時間
const expiresIn = "1h";
// 用戶註冊信息
const createToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

const isAuthenticated = ({ email, password }) => {
  return (
    getUsersDb().users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
};

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (isAuthenticated({ email, password })) {
    const user = getUsersDb().users.find(
      (u) => u.email === email && u.password === password
    );
    const { nickname, type } = user;
    // jwt
    const jwToken = createToken({ nickname, type, email });
    return res.status(200).json(jwToken);
  } else {
    const status = 401;
    const message = "Incorrect email or password";
    return res.status(status).json({ status, message });
  }
});

server.use(router);
server.listen(3003, () => {
  console.log("JSON Server is running");
});
