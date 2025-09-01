import bcrypt from "bcryptjs";

const users = [];

// function to add a new user
export const addUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);
  return user;
};

// function to find user
export const findUser = (username) => {
  return users.find(u => u.username === username);
};

export default users;
