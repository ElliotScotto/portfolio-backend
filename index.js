require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
app.get("/", (req, res) => {
  res.send("Le serveur est en marche !");
});
app.post("/send-email", async (req, res) => {
  console.log("Requête reçue pour l'envoi d'un email:", req.body);
  let data = req.body;

  let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  let mailOptions = {
    from: data.email,
    to: "scotto.elliot@gmail.com",
    subject: `[Portfolio] Nouveau message de ${data.name}: ${data.subject}`,
    html: `
            <p>${data.message}</p>
        `,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error("Erreur lors de l'envoi du mail:", error);
      res.status(500).send(error);
    } else {
      console.log("Mail envoyé avec succès:", response);
      res.send("Success");
    }
  });

  smtpTransport.close();
});
app.get("*", (req, res) => {
  res.status(404).send("Page non trouvée !");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
