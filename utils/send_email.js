import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
   service:"gmail",
    auth: {
        user: "devidafd07@gmail.com",
        pass: "vbkq lhpa inru jqkd"
    }
})

export const SuccesSendEmail = "Succes Send Email";


export const TemplateForActiveEmail = (id,gender,name) => {
  let nama ="";
  if(gender.toUpperCase() === "MALE") {
     nama = "Mr " + name;
  } else {
    nama = "Ms " + name;
  }
  return  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
  
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
  
      h1 {
        color: #333;
      }
  
      p {
        color: #555;
      }
  
      .button {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        text-align: center;
        text-decoration: none;
        background-color: #007BFF;
        color: white;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Activate Account</h1>
      <p>Dear ${nama},</p>
      <p>You have requested to activate account. Click the button below to activate it:</p>
      
      <a class="button" href='http://localhost:5000/active/${id}'>Activate Account</a>
      
      <p>If you did not request a activate account, please ignore this email.</p>
      <p>Thank you!</p>
    </div>
  </body>
  </html>
  `
};

export const TemplateForResetEmail = (id) => {
    return  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
    }

    p {
      color: #555;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      text-align: center;
      text-decoration: none;
      background-color: #007BFF;
      color: white;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset</h1>
    <p>Dear user,</p>
    <p>You have requested to reset your password. Click the button below to reset it:</p>
    
    <a class="button" href='http://localhost:5000/forget-password/${id}'>Reset Password</a>
    
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you!</p>
  </div>
</body>
</html>
`;}

export const SendEmail = (to, subject, message) => {
    let mailDetails = {
        from: 'devidafd07@gmail.com',
        to: to,
        subject: subject,
        html: message,
      };

   transporter.sendMail(mailDetails, function(err, data, next) {
        if(err) {
            console.log(err)
            return err;
        } else {
           return SuccesSendEmail;
        }
    }) 
    
}