export const calcular_promedio_ventas = (ventas) => {
    if (ventas.length === 0) return 0;
  
    const totalVentas = ventas.reduce((acumulador, venta) => acumulador + venta.total, 0);
    return totalVentas / ventas.length;
  };