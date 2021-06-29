import dotenv from "dotenv";
import fs from "fs";

import CONTACTS from "./contacts.json";

dotenv.config({ path: ".env" });

let output = ``;
Object.entries(CONTACTS).forEach(([group, contacts]) => {
  output += `# ${group}\n\n`;

  contacts.forEach((contact) => {
    output += `- **${contact.name} ([LLAMAR](tel:${
      contact.phone.split(" ")[1]
    }) | [WHATSAPP](https://api.whatsapp.com/send?phone=${contact.phone.replace(" ", "")}))**\n`;
  });

  output += `\n\n`;
});
fs.writeFileSync("./scripts/contacts/contacts.md", output);

console.log("Contacts files created");
