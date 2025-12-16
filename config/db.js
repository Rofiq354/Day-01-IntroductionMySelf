import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  max: 10,
});

db.connect().then((result) => result);

export default db;

// const test = db.query("SELECT * FROM public.projects");

// const data = test
//   .then((result) => result)
//   .then((data) => data)
//   .catch((error) => error);

// console.log(data);

// function fetchUserData(userId) {
//   console.log(`Fetching data for User ID ${userId}...`);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (userId === 123) {
//         const rawResponse = {
//           id: 123,
//           first: "Jane",
//           last: "Doe",
//           status: "active",
//         };
//         resolve(rawResponse);
//       } else {
//         reject(new Error("User not found!"));
//       }
//     }, 1000);
//   });
// }

// fetchUserData(123)
//   .then((result) => {
//     console.log("First .then(): Processing raw response...");
//     // const fullName = `${result.first} ${result.last}`;
//     return result;
//   })
//   .then((proccesedName) => {
//     console.log("Second .then(): Final data ready.");
//     // console.log(`The user's full name is : ${proccesedName}`);
//     const { first, last } = proccesedName;
//     const dataPlusFullName = {
//       ...proccesedName,
//       fullName: `${first} ${last}`,
//     };
//     console.log(dataPlusFullName);
//   })
//   .catch((error) =>
//     console.log("An error occurred in the chain:", error.message)
//   );
