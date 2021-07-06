import dotenv from "dotenv";
import fs from "fs";

import CONTACTS from "./contacts.json";
import BUSINESS from "./business.json";

dotenv.config({ path: ".env" });

let output = ``;
Object.entries(CONTACTS).forEach(([group, contacts]) => {
  output += `# ✪ ${group}\n\n`;

  contacts
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .forEach((contact) => {
      const phone = contact.phone.includes("+57")
        ? `[LLAMAR](tel:${contact.phone.split(" ")[1]})`
        : "";
      const whatsapp = contact.phone
        ? `[WHATSAPP](https://api.whatsapp.com/send?phone=${contact.phone.replace(" ", "")})`
        : "";
      const instagram = contact.instagram
        ? `[INSTAGRAM](https://instagram.com/${contact.instagram})`
        : "";

      output += `- **${contact.name} [${[phone, whatsapp, instagram]
        .filter(Boolean)
        .join(" | ")}]**\n`;
    });

  output += `\n\n`;
});
fs.writeFileSync("./scripts/contacts/contacts.md", output);

console.log("Contacts created");

// ---

output = ``;
BUSINESS.data
  .sort((a, b) => (a.name > b.name ? 1 : -1))
  .forEach((business) => {
    const phone = business.phone ? `[llamar](tel:${business.phone.split(" ")[1]})` : "";
    const whatsapp = business.phone
      ? `[wp](https://api.whatsapp.com/send?phone=${business.phone.replace(" ", "")})`
      : "";
    const instagram = business.instagram
      ? `[@${business.instagram}](https://instagram.com/${business.instagram})`
      : "";

    output += `- **${business.name} [${[phone, whatsapp, instagram]
      .filter(Boolean)
      .join(" | ")}]**\n`;
  });
fs.writeFileSync("./scripts/contacts/business.md", output);

console.log("Business created");
