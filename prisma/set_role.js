const Database = require('better-sqlite3');
const db = new Database('./dev.db');

// Update admin role
const result = db.prepare("UPDATE Usuario SET role = 'DONO' WHERE email = 'admin@acaigo.com.br'").run();
console.log('Role DONO atualizado para admin:', result.changes, 'linha(s)');

// Show all users
const users = db.prepare("SELECT id, email, role FROM Usuario").all();
console.log('Usuários:', users);

db.close();
console.log('Concluído!');
