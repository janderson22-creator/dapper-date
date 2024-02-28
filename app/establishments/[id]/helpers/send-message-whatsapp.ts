async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const countryCode = "+55"; // Código do país para o Brasil
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;
  const encodedMessage = encodeURIComponent(message);

  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    let apiUrl = "whatsapp://";
    const fullUrl = `${apiUrl}send?phone=${fullPhoneNumber}&text=${encodedMessage}`;

    window.open(fullUrl, "_blank");
  } else {
    let apiUrl = "https://api.whatsapp.com/send";

    const fullUrl = `${apiUrl}?phone=${fullPhoneNumber}&text=${encodedMessage}`;
    window.open(fullUrl, "_blank");
  }
}

export default sendWhatsAppMessage;
