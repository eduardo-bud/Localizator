const { Material, Pedido } = require('../models');

// Store alerts in memory with timestamps
const activeAlerts = new Map();

async function getSystemAlerts() {
  const alerts = [];
  const now = new Date();

  try {
    // Low stock alerts
    const lowStock = await Material.findAll();

    lowStock.forEach((m) => {
      const atual = Number(m.estoque_atual) || 0;
      const minimo = Number(m.estoque_minimo) || 0;

      if (minimo > 0 && atual <= minimo) {
        const alertKey = `low_stock_${m.id}`;

        // If alert doesn't exist, create it with current timestamp
        if (!activeAlerts.has(alertKey)) {
          activeAlerts.set(alertKey, {
            type: 'warning',
            message: `Estoque baixo: ${m.nome} (atual: ${atual}, mínimo: ${minimo})`,
            emitted_at: formatDateTime(now),
            timestamp: now.getTime(),
          });
        } else {
          // Update message but keep original timestamp
          const existing = activeAlerts.get(alertKey);
          existing.message = `Estoque baixo: ${m.nome} (atual: ${atual}, mínimo: ${minimo})`;
          activeAlerts.set(alertKey, existing);
        }

        alerts.push(activeAlerts.get(alertKey));
      } else {
        // Remove alert if stock is normal
        const alertKey = `low_stock_${m.id}`;
        activeAlerts.delete(alertKey);
      }
    });
  } catch (e) {
    console.error('Error fetching low stock materials', e);
  }

  try {
    // Pending orders alert
    const totalPedidos = await Pedido.count();
    const alertKey = 'pedido_count';

    if (totalPedidos > 0) {
      if (!activeAlerts.has(alertKey)) {
        activeAlerts.set(alertKey, {
          type: 'info',
          message: `${totalPedidos} pedidos registrados no sistema`,
          emitted_at: formatDateTime(now),
          timestamp: now.getTime(),
        });
      } else {
        const existing = activeAlerts.get(alertKey);
        existing.message = `${totalPedidos} pedidos registrados no sistema`;
        activeAlerts.set(alertKey, existing);
      }

      alerts.push(activeAlerts.get(alertKey));
    } else {
      activeAlerts.delete(alertKey);
    }
  } catch (e) {
    console.error('Error counting pedidos', e);
  }

  return alerts;
}

function formatDateTime(date) {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

module.exports = { getSystemAlerts };
