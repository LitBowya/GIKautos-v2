import bcrypt from "bcryptjs";

const users = [
  {
    name: "Agbaga Benjamin Kekeli",
    username: "Kekeli Lit",
    email: "b@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Nathan Sitsofe",
    username: "Natty",
    email: "nathan@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Kekeli Mawulolo",
    username: "Lit",
    email: "kekeli@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

export default users;