require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Le serveur est en marche !");
});
app.post("/send-email", async (req, res) => {
  console.log("Requête reçue pour l'envoi d'un email:", req.body);
  let data = req.body;

  let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.USER_EMAIL,
    to: process.env.USER_EMAIL,
    subject: `[Portfolio]${data.subject}`,
    html: `
            <p>De la part de ${data.name} (${data.email})...<br/><br/><br/>${data.message}</p>
        `,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error("Erreur lors de l'envoi du mail:", error);
      res.status(500).json("error");
    } else {
      console.info("Mail envoyé avec succès:", response);
      res.json("success");
    }
  });

  smtpTransport.close();
});
app.get("*", (req, res) => {
  res.status(404).send("Page non trouvée !");
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `Le serveur du portfolio d'Elliot Scotto a démarré sur le port ${PORT}`
  );
});
