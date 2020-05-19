// fucntions.js
// ========

// Includes
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Variables
//const Backend_base = path.dirname(__dirname); // parent directory
const Backend_base = __dirname;
const images_dir = Backend_base + "/public/images/";
const email_templates_dir = Backend_base + "/public/EmailTemplates";

// console.log("functions.js Backend_base: " + Backend_base);

module.exports = {

      EMAIL_TEMPLATE_REGISTRATION:    {
        htmlFile: email_templates_dir + "/Registration.html",
        image2: "MailRegistration.png",
        field1: "[NAME]",
        field2: "[EMAIL]",
      },
      EMAIL_TEMPLATE_ANSWER_RECEIVED:    {
        htmlFile: email_templates_dir + "/AnswerReceived.html",
        image2: "MailAnswerReceived.png",
        field1: "[NICKNAME]",
        field2: "[MESSAGE]",
      },
      EMAIL_TEMPLATE_FORGOT_PASSWORD:    {
        htmlFile: email_templates_dir + "/ForgotPassword.html",
        image2: "",
        field1: "[CODE]",
        field2: "[EMAIL]",
      },
      EMAIL_TEMPLATE_PAYMENT_CONFIRMATION:    {
        htmlFile: email_templates_dir + "/PaymentConfirmation.html",
        image2: "MailPaymentConfirmation.png",
        field1: "[NICKNAME]",
      },
      EMAIL_TEMPLATE_SUBSCRIPTION:    {
        htmlFile: email_templates_dir + "/Subscription.html",
        image2: "MailSubscription.png",
        field1: "[NICKNAME]",
      },

      // Send email with selected HTML template
      // Exmaple Usage:
      // functions.sendMail("xip2me@gmail.com", "mail1", functions.EMAIL_TEMPLATE_REGISTRATION);
      send_mail_custom: function (mailTo, mailSubject, mailTemplate, field1, field2, isAdminCopy) {

        // send mail
        let transporter = nodemailer.createTransport({
            host: 'ingloball.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'info@wifball.com',
                pass: 'Bh$LK]yWY5AD'
            }
        });

        // Get mail template
        var mailBody = fs.readFileSync(mailTemplate.htmlFile, 'utf8');

        // Update fields
        if (field1) {
          mailBody = mailBody.replace(mailTemplate.field1, field1);
        }
        if (field2) {
          mailBody = mailBody.replace(mailTemplate.field2, field2);
        }

        var mailOptions = {
          from:     'Wifball.com <info@wifball.com>',
          to:       mailTo,
          subject:  mailSubject,
          html:     mailBody,

          attachments:[
            {
              cid:        'image1@logo',
              filename:   'logo.png',
              path:       images_dir + 'logo.png'
            },
          ]
        };
        // if has 2nd image...
        if (mailTemplate.image2 !== "") {
          mailOptions.attachments.push({                
            cid:        'image2@body',
            filename:   mailTemplate.image2,
            path:       images_dir + mailTemplate.image2
          });
        }

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent to '" + mailTo + "' with subject (" + mailSubject + ")");
                // Admin copy for testing...
                if (!isAdminCopy) {
                  if (mailTo !== "xip2me@gmail.com") {
                      module.exports.send_mail_custom("xip2me@gmail.com", "Admin Copy - " + mailSubject, mailTemplate, field1, field2, true);
                  }
                  // module.exports.send_mail_custom("wifball.pro@gmail.com", "Admin Copy - " + mailSubject, mailTemplate, field1, field2, true);
                }
            }
        });
    },
    getEmailTemplate: function () {
      // whatever
    },
    RandomString(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result.toUpperCase();
    }
   
  };
  