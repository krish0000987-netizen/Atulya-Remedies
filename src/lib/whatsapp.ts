export const openWhatsApp = (name: string, phone: string, city: string, extra = "") => {
  const message = `Hello Atulya Remedies,

Name: ${name}
Phone: ${phone}
City: ${city}

I am interested in your pharma products / franchise.${extra ? "\n" + extra : ""}`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/917697555159?text=${encoded}`, "_blank");
};
