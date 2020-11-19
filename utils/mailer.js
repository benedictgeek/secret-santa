const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const util = require("util");
var hbs = require("nodemailer-handlebars");
const readFile = util.promisify(fs.readFile);
module.exports = async (
  userEmail,
  subject,
  template,
  htmlInputData,
  attachments = []
) => {
  try {
    // let htmlTemplatePath = path.resolve(
    //   process.cwd(),
    //   "email_templates",
    //   `${template}.hbs`
    // );
    //prepare the htmlstream
    // let htmlString = await readFile(htmlTemplatePath, { encoding: "utf-8" });

    // let htmlTemplate = Handlebars.compile(htmlString);
    // let readyHtml = htmlTemplate(htmlInputData);
    let transporter = nodemailer.createTransport({
      // service: 'Gmail',
      host: "smtp.clubly.io",
      port: 587,
      secure: false,
      tls: {
        minVersion: "TLSv1",
        rejectUnauthorized: false,
      },
      auth: {
        user: "no-reply@clubly.io",
        pass: "x1VqU+%@5cmh",
      },
    });

    if (process.env.NODE_ENV !== "test") {
      var options = {
        extName: ".hbs",
        viewEngine: {
          extName: ".hbs",
          layoutsDir: path.resolve(process.cwd(), "views", "layouts"),
          partialsDir: path.resolve(process.cwd(), "views", "partials"),
          defaultLayout: "layout",
        },
        viewPath: path.resolve(process.cwd(), "views"),
      };
      transporter.use("compile", hbs(options));
      let mailOptions = {
        from: '"SecretSanta" no-reply@clubly.io',
        to: userEmail,
        subject: subject,
        template: template,
        context: { ...htmlInputData, linkText: "View" },
        text: "test_mail",
        // html: "Hello",
        attachments: attachments != null ? attachments : null,
      };
      let sentMail = await transporter.sendMail(mailOptions);
      console.log(sentMail);
    }
  } catch (error) {
    console.log("error sending mail");
    console.log(error.toString().substring(0, 400));
  }
};
