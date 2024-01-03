const createMailOptions = (email, token) => {
  return {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Email Verification',

      html: `<main
          style="
              backdrop-filter: blur(10px);
              box-shadow: 0 0 10px #af5111;
              padding: 10px;
          "
      >
          <h1 style="color: green; text-align: center">Email Verification</h1>
          <p style="color: magenta; font-weight: bold">
              Please click on the link below to verify your email address and activate
              your account
          </p>
          <a
              href=${process.env.SITE_URL}/user/verify/${token}
              target="_blank"
              style="color: red; font-weight: bold; text-decoration: none"
              >Verify Email Address</a
          >
          <ul
              style="
                  color: blue;
                  width: 100%;
                  height: 100%;
                  padding: 4px;
                  gap: 14px;
                  text-align: left;
                  margin-left: 10px;
                  flex-wrap: wrap;
                  text-wrap: balance;
                  list-style-type: square;
                  list-style-position: calc(40px-60px);
                  list-style-image: url('https://img.icons8.com/ios-filled/14/right') !important;
              "
          >
              <li>If you did not register with us then you can ignore this email</li>
              <li>
                  if you have any query then you can contact us by replying to this
                  email we will try to resolve your query as soon as possible
              </li>
              <li>
                  if you have not registered with us then we will delete your email
                  address from our database within 1 hour
              </li>
          </ul>
          <h3 style="color: green; text-align: center">Thank You</h3>
          <h3 style="color: green; text-align: center">Hospitalo Team</h3>
      </main>`
  };
};

const adminMailoption= (email, msg="")=>{
    return {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "User email verified and account activated",
        html: ` <main
                    style="
                      backdrop-filter: blur(10px);
                      box-shadow: 0 0 10px #af5111;
                      padding: 10px;
                    "
                    >
                    <h1 style="color: green; text-align: center">User email verified and account activated</h1>
                    <p style="color: magenta; font-weight: bold">
                      User email verified and account activated
                    </p>    
                    <ul
                      style="
                        color: blue;
                        width: 100%;
                        height: 100%;
                        padding: 4px;
                        gap: 14px;
                        text-align: left;
                        margin-left: 10px;
                        flex-wrap: wrap;
                        text-wrap: balance;
                        list-style-type: square;
                        list-style-position: calc(40px-60px);
                        list-style-image: url('https://img.icons8.com/ios-filled/14/right') !important;
                      "
                    >
                        <li>
                            User email verified and account activated
                            ${msg}
                        </li>
                    </ul>
                    <h3 style="color: green; text-align: center">Thank You</h3>
                    <h3 style="color: green; text-align: center">Hospitalo Team</h3>
                    </main>`,
      };

}

const welcomeMailToUser =(email)=>{
    return {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Welcome to Hospitalo",
        html: ` <main
                    style="
                      backdrop-filter: blur(10px);
                      box-shadow: 0 0 10px #af5111;
                      padding: 10px;
                    "
                    >
                    <h1 style="color: green; text-align: center">Welcome to Hospitalo</h1>
                    <p style="color: magenta; font-weight: bold">
                      You have successfully verified your email address and activated your
                      account
                    </p>    
                    <ul
                      style="
                        color: blue;
                        width: 100%;
                        height: 100%;
                        padding: 4px;
                        gap: 14px;
                        text-align: left;
                        margin-left: 10px;
                        flex-wrap: wrap;
                        text-wrap: balance;
                        list-style-type: square;
                        list-style-position: calc(40px-60px);
                        list-style-image: url('https://img.icons8.com/ios-filled/14/right') !important;
                      "
                    >
                        <li>
                            If you have any query then you can contact us by replying to this
                            email we will try to resolve your query as soon as possible
                        </li>
                        <li>
                            if you have not registered with us then we will delete your email
                            address from our database within 1 hours
                        </li>
                    </ul>
                    <h3 style="color: green; text-align: center">Thank You</h3>
                    <h3 style="color: green; text-align: center">Hospitalo Team</h3>
                    </main>`,
      };
}

module.exports = { createMailOptions, adminMailoption, welcomeMailToUser };