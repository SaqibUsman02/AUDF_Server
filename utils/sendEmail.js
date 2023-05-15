const nodeMailer = require('nodemailer');

module.exports = async (Email,subject,text) => {
    try{
        // console.log(`=============== ${process.env.USER}   ${Email}  ${subject}  ${text} ==========`)
        const transporter = nodeMailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });



        await transporter.sendMail({

            from: process.env.USER,
            to: Email,
            subject: subject,
            text: text


        });
        console.log("Email Send Successfully");

    }
    catch(err){
        console.log("Email not send");
        console.log(err);

    }
}