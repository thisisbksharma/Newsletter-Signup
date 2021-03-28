// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mailchimp.setConfig({
    apiKey: "6b4155f2834ff844d7a06b2e6f0043eb-us1",
    server: "us1",
});
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req, res) {
    const run = async function() {
        const firstName = req.body.fName;
        const lastName = req.body.lName;
        const email = req.body.email;
        const response = await mailchimp.lists.batchListMembers("c7b2b35e68", {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                    }
                }
                
            ]
        });
        console.log(response);
        const jsonData = JSON.stringify(response);
    };
    run();
    const url = "https://us1.api.mailchimp.com/3.0/lists/c7b2b35e68";
    const options = {
        method: "POST", 
        auth: "bkunsolved:6b4155f2834ff844d7a06b2e6f0043eb-us1"
    };
    https.get(url, options, function(response){
        var code = response.statusCode;
        console.log("Status-Code:"+" "+ code);
        if(code === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    });
});
app.post("/failure", function(req, res) {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000);