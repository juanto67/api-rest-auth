const posts = []; // "Base de datos" temporal

class Post {
  constructor(title, content, author) {
    this.title = title;
    this.content = content;
    this.author = author; // email del usuario
  }

  static save(post) {
    posts.push(post);
  }

  static getAll() {
    return posts;
  }

  static getByAuthor(author) {
    return posts.filter(p => p.author === author);
  }
}

module.exports = Post;
