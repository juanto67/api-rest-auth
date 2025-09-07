const users = []; // "Base de datos" temporal

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static findByEmail(email) {
    return users.find(u => u.email === email);
  }

  static save(user) {
    users.push(user);
  }

  static getAll() {
    return users.map(u => ({ username: u.username, email: u.email }));
  }
}

module.exports = User;
