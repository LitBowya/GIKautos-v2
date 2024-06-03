import bcrypt from "bcryptjs";

const users = [
  {
    name: "Agbaga Benjamin Kekeli",
    username: "Kekeli Lit",
    email: "b@gmail.com",
    profilePicture: "/images/Lubricants/lub1.webp",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Nathan Sitsofe",
    username: "Natty",
    email: "nathan@example.com",
    profilePicture: "/images/Lubricants/lub2.webp",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Kekeli Mawulolo",
    username: "Lit",
    email: "kekeli@example.com",
    profilePicture: "/images/Lubricants/lub3.webp",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

export default users;