export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    
    // Usar formato ISO más explícito para evitar problemas de hidratación entre servidor/cliente
    // Esto evita diferencias de zona horaria y localización
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${day}/${month}/${year}`;
  } catch {
    return "Fecha inválida";
  }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    
    // Usar formato manual para evitar problemas de hidratación
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch {
    return "Fecha inválida";
  }
};

export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Hora inválida";
    }
    
    // Usar formato manual para evitar problemas de hidratación
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  } catch {
    return "Hora inválida";
  }
};