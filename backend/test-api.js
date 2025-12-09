// Script para testar os endpoints da API
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testando /api/usuarios sem autenticação...');
    const response = await fetch('http://localhost:3001/api/usuarios');
    console.log('Status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.status === 401) {
      console.log('Precisa de autenticação - esperado');
    } else if (response.status === 500) {
      const text = await response.text();
      console.log('Erro 500:', text);
    } else {
      const data = await response.json();
      console.log('Dados recebidos:', data);
    }
  } catch (err) {
    console.error('Erro ao conectar:', err.message);
  }
}

testAPI();
