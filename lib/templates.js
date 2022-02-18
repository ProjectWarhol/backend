require('dotenv').config();

exports.resetTemplate = (token) => {
  const template = `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title></title>
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
                <style>
                body{
                    font-family: 'Inter', sans-serif;
                }
                div {
                    padding: 10px;
                    text-align: center;
                }
                h1{
                    font-family: 'Inter', sans-serif;
                    font-size: 56px;
                    font-weight: 700;
                    color: #FFF;  
                }
                h2{
                    margin-bottom: 40px;
                    font-size: 26px;   
                }
                p{
                    font-weight: 500;
                    line-height: 30px;
                }
                button{
                    font-family: 'Inter', sans-serif;
                    background-color: #FF4B75;
                    border: none;
                    color: yellow;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 10px;
                    line-height: 30px;
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                button:hover{
                    background-color: #FFF;
                    transition: 0.3s;
                }
                @media only screen and (max-width: 650px){
                    body{
                    font-family: 'Inter', sans-serif;
                }
                div {
                    padding: 10px;
                    text-align: center;
                }
                button{
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                p{
                    font-weight: 500;
                    line-height: 30px;
                }
                }
                </style>
            </head>
            <body>
                <div class = "container">
                    <h1>Project Warhol</h1>
                    <h2>Password Reset</h2>
                    <p>Hi There, please click the following button to reset your password.</p>
                    <a href="${process.env.FRONTEND_URL}/login/updatePassword/${token}"><button type="button">Reset Password</button></a>
                    <p>This link will expire in 1 hour after receiving this email. if so please go to the following link : <a href="${process.env.FRONTEND_URL}/login/resetPassword">${process.env.FRONTEND_URL}/login/resetPassword</a></p>
                </div>
                <script src="" async defer></script>
            </body>
        </html>`;
  return template;
};

exports.welcomeTemplate = (token) => {
  const template = `<!DOCTYPE html>
          <html>
              <head>
                  <meta charset="utf-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <title></title>
                  <meta name="description" content="">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
                  <style>
                body{
                    font-family: 'Inter', sans-serif;
                }
                div {
                    padding: 10px;
                    text-align: center;
                }
                h1{
                    font-family: 'Inter', sans-serif;
                    font-size: 56px;
                    font-weight: 500;
                    color: #092c4c;  
                }
                h2{
                    margin-bottom: 40px;
                    font-size: 26px;   
                }
                p{
                    font-weight: 500;
                    line-height: 30px;
                }
                button{
                    font-family: 'Inter', sans-serif;
                    background-color: #FF4B75;
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 10px;
                    line-height: 30px;
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                button:hover{
                    background-color: #27AE9E;
                    transition: 0.3s;
                }
                @media only screen and (max-width: 650px){
                    body{
                    font-family: 'Inter', sans-serif;
                }
                div {
                    padding: 10px;
                    text-align: center;
                }
                button{
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                p{
                    font-weight: 500;
                    line-height: 30px;
                }
                }
                </style>
              </head>
              <body>
                  <div class = "container">
                  <h1>Project Warhol</h1>
                      <h2>Welcome to Project Warhol</h2>
                        <p>To begin setting up your account</p>
                        <a href="${process.env.FRONTEND_URL}/login/updatePassword/${token}"><button type="button">click me</button></a>
                        <p>holding TEXT</p>
                  </div>
                  <script src="" async defer></script>
              </body>
          </html>`;
  return template;
};

exports.newUserTemplate = (token) => {
  const template = `<!DOCTYPE html>
          <html>
              <head>
                  <meta charset="utf-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <title></title>
                  <meta name="description" content="">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
                  <style>
                body{
                    font-family: 'Inter', sans-serif;
                }
                div {
                    padding: 10px;
                    text-align: center;
                }
                h1{
                    font-family: 'Inter', sans-serif;
                    font-size: 56px;
                    font-weight: 500;
                    color: #092c4c;  
                }
                h2{
                    margin-bottom: 40px;
                    font-size: 26px;   
                }
                p{
                    font-weight: 500;
                    line-height: 30px;
                }
                button{
                    font-family: 'Inter', sans-serif;
                    background-color: #FF4B75;
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 10px;
                    line-height: 30px;
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                button:hover{
                    background-color: #27AE9E;
                    transition: 0.3s;
                }
                @media only screen and (max-width: 650px){
                    body{
                    font-family: 'Inter', sans-serif;
                }
                div {
                    padding: 10px;
                    text-align: center;
                }
                button{
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                p{
                    font-weight: 500;
                    line-height: 30px;
                }
                }
                </style>
              </head>
              <body>
                  <div class = "container">
                  <h1>Project Warhol</h1>
                      <h2>Welcome to Project Warhol</h2>
                        <p>To validate your email and set your password</p>
                        <a href="${process.env.FRONTEND_URL}/login/updatePassword/${token}"><button type="button">click me</button></a>
                        <p>holding TEXT</p>
                  </div>
                  <script src="" async defer></script>
              </body>
          </html>`;
  return template;
};
