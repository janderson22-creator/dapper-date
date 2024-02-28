async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const countryCode = "+55"; // Código do país para o Brasil
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  const apiUrl = "https://api.whatsapp.com/send";
  const encodedMessage = encodeURIComponent(message);
  const fullUrl = `${apiUrl}?phone=${fullPhoneNumber}&text=${encodedMessage}`;

  // Abrir uma nova janela com o link do WhatsApp
  window.open(fullUrl, "_blank");
}

export default sendWhatsAppMessage;
