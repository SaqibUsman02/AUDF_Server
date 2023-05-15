const express = require("express");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
const axios = require('axios');

const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const QueryData = require("../models/querySchema");
const Contact = require("../models/ContactSchema");
const CommentVoteData = require("../models/CommentVoteSchema")

const { parse } = require("path");
const { Console } = require("console");
const FeedbackData = require("../models/feedbackSchema");
const ReportData = require("../models/reportSchema");

const CommentData = require("../models/commentSchema");
const VoteData = require("../models/Vote");

const UserImage = require("../models/ImageSchema");
const passport = require("passport");
const { Query } = require("mongoose");

const app = express();
app.use(cookieParser());
const router = express.Router();


//##################### Admin ###############################

// total user find API

// router.get("/usersCount", async (req, res) => {
//   const userExist = await QueryData.find();

//   if (userExist.length > 0) {
//     res.send({ Length: userExist.length });
//   } else {
//     res.send({ Length: 0 });
//   }
// });

// total queries API

// router.get("/queriesCount", async (req, res) => {
//   const userExist = await QueryData.find();
//   let queryCount=0;
//   let total_queries = "Total queries";

//   if (userExist.queryData ) {
//     queryCount++;
//     res.send({ Total queries:  queryCount });
//   } else {
//     res.send({ "No query "  });
//   }
// });



// router.get("/queriesCount", async (req, res) => {
//   const userExist = await QueryData.find();
//   const queryCount = userExist.QueryDetails;
//   const message = queryCount > 0 ? `TotalQueries: ${queryCount}` : "No queries found";

//   res.send({ message });
// });


router.get("/queriesCount", async (req, res) => {
  const queryCount = QueryData.countDocuments;
    // const message = queryCount > 0 ? `TotalQueries: ${queryCount}` : "No  found";

  res.send({ queryCount });
});



router.get("/check", async (req, res) => {
  console.log("sdasdasdasdasd");

});



router.get("/queryCount", async (req, res) => {
  QueryData.find((err,docs)=>{
    if(docs){
      res.send({status:200,data:docs})
    }
    else{
      res.send({status:500, error:err})
    }
  })
 
});


router.get("/usersCount", async (req, res) => {
  User.find((err,docs)=>{
    if(docs){
      res.send({status:200,data:docs})
    }
    else{
      res.send({status:500, error:err})
    }
  })
 
});

router.get("/usersList", async (req, res) => {
  try {
    // console.log("-------------------");
    const users = await User.find({}, {name: 1, Email: 1, id:1});
      res.status(200).send(users);

    // console.log(users)
    // console.log('trying')


  } catch (error) { 
    console.error("Error fetching users list:", error);
    res.status(500).send({status: 500, error: error});
  }
});


router.get("/contact", async (req, res) => {
  try {
    const contact = await Contact.find().sort({_id: -1,});;
    console.log(contact);
      res.status(200).send(contact);

  } catch (error) { 
    console.error("Error fetching Contact list:", error);
    res.status(400).send({status: 400, error: error});
  }
});


router.get("/queryCategory", async (req, res) => {
  ReportData.find((err,docs)=>{
    if(docs){
      res.send({status:200,data:docs})


    }
    else{
      console.log('err ========', err)
      res.send({status:500, error:err})
    }
  })
 
});


//######################  Client #########################

//---------------Comment Vote------------------

router.post("/CommentVote", async (req, res) => {
  const { UserID, PostID,CommentID, Type, UpVote, DeVote } = req.body;
  console.log(req.body); 
  try {

    if (!UserID || !PostID || !CommentID || !Type  ) {
      console.log("8888888888888888888");
      return res
        .status(400)
        .json({ message: "please filled the field properly" });
    }
    const userData = await CommentVoteData.findOne({ UserID: UserID, PostID: PostID, CommentID: CommentID});
    if(!userData){
      console.log("99999999999999999999");

      user = new CommentVoteData({ UserID, PostID,CommentID, Type });
      await user.save();

      if(Type ==="upvote"){

        const filter = {"Comment._id":  CommentID};
        const update = { $inc: { "Comment.$.Upvote": 1 } };
         await QueryData.findOneAndUpdate(filter, update); 
  
      }
      else{
        const filter = {"Comment._id":  CommentID};
        const update = { $inc: { "Comment.$.Devote": 1 } };
         await QueryData.findOneAndUpdate(filter, update); 
  
      }
     
      return res.status(201).json({ message: "Voted Successfully" });


    }
    else
    {
      console.log("0000000000000000000000");
      if (userData.Type === "upvote" && Type ==="upvote"){
        const filter = { UserID: UserID, PostID: PostID, CommentID: CommentID};
        const update = { Type: "nothing" };
    
        await CommentVoteData.findOneAndUpdate(filter, update);
        performCommentVote( CommentID, UpVote,"Upvote");



        return res.status(300).json({message: "Already UpVoted"});
      }
      else if (userData.Type === "devote" && Type ==="devote"){
        const filter = { UserID: UserID, PostID: PostID, CommentID: CommentID};
        const update = { Type: "nothing" };
    
        await CommentVoteData.findOneAndUpdate(filter, update);
        performCommentVote( CommentID, DeVote,"Devote");

        return res.status(300).json({message: "Already DeVoted"});

      }
      else if (userData.Type === "upvote" && Type ==="devote"){
        return res.status(300).json({message: "Already Upvoted , Either Upvote or Devote"});

      }
      else if (userData.Type === "devote" && Type ==="upvote"){
        return res.status(300).json({message: "Already Devoted , Either Upvote or Devote"});

      }
      else{
        const filter = { UserID: UserID, PostID: PostID, CommentID: CommentID};
        const update = { Type: Type };
    
        await CommentVoteData.findOneAndUpdate(filter, update);
        if(Type ==="upvote"){

          const filter = {"Comment._id":  CommentID};
          const update = { $inc: { "Comment.$.Upvote": 1 } };
           await QueryData.findOneAndUpdate(filter, update); 
    
        }
        else{
          const filter = {"Comment._id":  CommentID};
          const update = { $inc: { "Comment.$.Devote": 1 } };
           await QueryData.findOneAndUpdate(filter, update); 
    
        }

      return res.status(300).json({ message: "Successfully " + Type });
      }
    }

    // let like = Upvote;
    // like = like + 1;
    // console.log("PostID" + PostID + "Like:::" + like );
    //   const filter = { PostID: PostID };
    //   const update = { Upvote: like };
  
    //   await QueryData.findOneAndUpdate(filter, update);
    //   res.status(201).json({ message: "Your Query Successfully Posted" });
    //   console.log("Your Query Successfully Posted");
    
  } catch (err) {
    console.log("87777777777777777777777777");

    console.log(err);
  }
});

















router.post("/Uploads", async (req, res) => {

  try {
    const { postImage, Email } = req.body;
    const userData = await User.findOne({ Email: Email});
  
    if (userData) {
  
      const filter = { Email: Email};
      const update = { Photo: postImage};
  
      await User.findOneAndUpdate(filter, update);
      res.status(201).json({message: "Your Data Successfully Posted"});
      console.log("Your Data Successfully Posted");
    }

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});




// =============== Image Uplaod ===================
router.post("/Upload", async (req, res) => {

  try {
    const { postImage, Title } = req.body;

    const commentData = new UserImage({ postImage, Title });
    await commentData.save();
    res.status(201).json({ msg: "New image uploaded...!" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

let userExist = "";
router.get("/OwnQuestion", Authenticate, async (req, res) => {
  console.log("helo Own Question page");

  const userData = await QueryData.find({ UserID: req.cookies["Email"]}).sort({
    _id: -1,
  });

  res.send(userData);
});


router.get("/getOtherProfileQuery", Authenticate, async (req, res) => {

  const userData = await QueryData.find({ UserID: req.query.UserID}).sort({
    _id: -1,
  });
  console.log(userData);

  return res.status(200).send(userData);
});

router.get("/getOtherProfileUser", Authenticate, async (req, res) => {

  const userData = await User.findOne({ Email: req.query.UserID });
   
  console.log(userData);

  return res.status(200).send(userData);
});






router.get("/trendingQuery",async (req, res) => {

  QueryData.find().sort({ Upvote: -1 }).limit(10)
  .then(queries => {
    res.send(queries);

    // const queryTexts = queries.map(query => query.QueryTitle);
    // console.log(queryTexts);
  })
  .catch(err => console.error(err))

});

router.get("/OtherUserProfile", Authenticate, async (req, res) => {

  const name = req.query.PostID;

  const userData = await QueryData.findOne({PostID: name });
  res.send(userData.UserID);
});


router.get("/OwnQuestionn", Authenticate, async (req, res) => {
  console.log("helo Own Question2 page");

  const userData = await User.findOne({ Email: req.cookies["Email"]  });

  res.send(userData);
});

//***************** Fetching Comment ******************* */
router.get("/getAllComment", Authenticate, async (req, res) => {

  const name = req.query.PostID;

  const userData = await QueryData.findOne({PostID: name });
  await res.send(userData.Comment);
});


router.get("/VoteData", Authenticate, async (req, res) => {

  const Email = req.query.Email;
    const PostID = req.query.PostID;
  const QueryVote = await VoteData.find({UserID: Email,PostID: PostID });
  

  res.send(QueryVote);
});

router.get("/CommentVoteData", Authenticate, async (req, res) => {

  const Email = req.query.Email;
    const PostID = req.query.PostID;
    const CommentID = req.query.CommentID;
    console.log(Email +  PostID + CommentID);


  const userData = await CommentVoteData.find({UserID: Email,PostID: PostID,CommentID: CommentID });
  console.log("2222" + userData);
  res.send(userData);
});


// feed wale bandon ki profile pic

router.get("/OwnPhoto", Authenticate, async (req, res) => {
  const Email = req.query.Email;
  const OtherUserData = await User.findOne({Email: Email });
  const LoginUserData = await User.findOne({Email: req.cookies["Email"] });

  const responseData = {
    LoginUserData: LoginUserData,
    OtherUserData: OtherUserData
  };

  // console.log(responseData);

  return res.status(200).send(responseData);
});


//---------------- User ki apni Profile Pic ----------------
router.get("/OwnProfile_Pic", Authenticate, async (req, res) => {
  const userData = await User.findOne({Email: req.cookies["Email"] });
  res.send(userData);
});

router.get("/OwnProfileDetails", Authenticate, async(req,res) =>{
  const userData = await User.findOne({Email: req.cookies["Email"]});
  if(userData){ res.send(userData);}
});

router.get("/Question", Authenticate, async (req, res) => {
  const userExist = await QueryData.find().sort({ _id: -1 });
  res.send(userExist);
});

router.get("/FetchReport", Authenticate, async (req, res) => {
  // const userExist = await QueryData.find({ UserID: "tech54qi@gmail.com" }).sort({ _id: -1 });
  const userExist = await ReportData.find().sort({ _id: -1 });
  res.send(userExist);
});





router.get("/getData", Authenticate, (req, res) => {
  res.send(req.rootUser);
});

let contactData;
router.post("/contact", async (req, res) => {
  const { name, Email, Subject, Message } = req.body;
  try {
    if (!name || !Email || !Subject || !Message) {
      console.log("filled contact form");
      return res.json("please filled the data");
    }else{
      contactData = new Contact({ name,Email,Subject,Message });
      contactData.save();
      res.status(201).json({ message: "Your Contact Successfully Posted" });
      console.log("Your Contact Successfully Posted");
    }
   
  } catch (error) {
    console.log(error);
  }
});

//-------------- Post Comment API------------------

let commentData;
router.post("/comment", async (req, res) => {
  const {Photo, ID,Name, PostID, comment } = req.body;
  try {
    if ( !Photo || !ID || !Name || !PostID || !comment) {
      console.log("Missing Answer Data");
      res.status(400).json({ error: "Please Filled the Field Properly" });
    } else {

      let quer= await QueryData.findOne({ PostID: PostID });
    if (quer) {
      const userMessage = await quer.addMessage(Photo,ID, Name, PostID, comment);
      console.log("*************************"); 

      await quer.save();

      res.status(201).json({ message: "Comment Successfully" });
    }
    }
  } catch (err) {
    console.log(err);
  }
});

//------------------- Forgot Pass Change ------------------

router.post("/forgot_pass_save", async (req,res) => {
  const { Email, New_Password, Confirm_Password} = req.body;

try{
  const userData = await User.findOne({ Email: Email});
  if(userData){
    const filter = { Email: Email};
    this.New_Password = await bcrypt.hash(New_Password,12);
    this.Confirm_Password= await bcrypt.hash(Confirm_Password,12);
    const update = { Password: this.New_Password, Confirm_Password: this.Confirm_Password};
    let userr =  await User.findOneAndUpdate(filter,update);
  
    res.status(201).json({message: "Your Data Successfully Posted"});
    console.log("Your Data Successfully Posted");

  }
}catch(err){
  console.log(err);

}
});


// --------------- Change Password -----------------

router.post("/change_pass", async(req,res) => {
  // console.log("chagneeeeeeeeeeee");
  const {Email, Password, New_Password, Confirm_Password} = req.body;
  try{
    
    const userData = await User.findOne({ Email: Email});
    if(userData){
      const isMatch = await bcrypt.compare(Password, userData.Password);
      if (!isMatch) {
        console.log("pass incorrect");

        return res.status(400).json({ message: "Invalid Credentials" });
      }
      else{
        const filter = { Email: Email};
        this.New_Password = await bcrypt.hash(New_Password,12);
        this.Confirm_Password= await bcrypt.hash(Confirm_Password,12);
        const update = { Password: this.New_Password, Confirm_Password: this.Confirm_Password};
        let userr =  await User.findOneAndUpdate(filter,update);
        res.status(201).json({message: "Your Data Successfully Posted"});
        console.log("Your Data Successfully Posted");

      }
      

    }


  }catch(err){
    console.log(err);
  }

});

//------------------ Update Profile------------------
let updateData;
router.post("/UpdateProfile",async(req,res) => {
  const {Email, name,  Password, Phone, Gender, Website, Github, Twitter } = req.body;

  try{
  const userData = await User.findOne({ Email: Email});

  if (userData) {

    const filter = { Email: Email};
    const update = { Phone: Phone ,Gender: Gender, Website: Website, Github: Github, Twitter: Twitter};

    await User.findOneAndUpdate(filter, update);
    res.status(201).json({message: "Your Data Successfully Posted"});
    console.log("Your Data Successfully Posted");
  }
    
   
  }catch(err){
      console.log(err);
  }
});


//-----------Report API-------------------------

let reportData;
router.post("/report", async (req, res) => {
  const { PostID,ID, Category, Report } = req.body;
  try {
    if (!PostID || !ID 
      ||   !Category 
       || !Report) {
      console.log("Missing Report Data");
      res.status(400).json({ error: "Please Filled the Field Properly" });
    } else {
      reportData = new ReportData({ PostID,ID, Category, Report });
      reportData.save();
      res.status(201).json({ message: "Your Report Successfully Posted" });
      console.log("Your Report Successfully Posted");
    }
  } catch (err) {
    console.log(err);
  }
});

//-----------Feedback API-------------------------

// let feedbackData;
// router.post("/feedback", async (req, res) => {
//   const { ID, Category, Feedback } = req.body;
//   try {
//     if (!ID || !Category || !Feedback) {
//       console.log("Missing Feedback Data");
//       res.status(400).json({ error: "Please Filled the Field Properly" });
//     } else {
//       feedbackData = new FeedbackData({ ID, Category, Feedback });
//       feedbackData.save();
//       res.status(201).json({ message: "Your Feedback Successfully Posted" });
//       console.log("Your Feedback Successfully Posted");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });




let feedbackData;
router.post("/feedback", async (req, res) => {
  const { ID, Category, Feedback } = req.body;
  try {
    if (!ID || !Category || !Feedback) {
      console.log("Missing Feedback Data");
      res.status(400).json({ error: "Please fill the fields properly" });
    } else {
     

      // Send data to the AI server
      const aiServerURL = 'http://localhost:5000/feedback'; // Replace with your AI server URL
      const response = await axios.post(aiServerURL, {
        feedback: Feedback,
      });

      if (response.status === 200) {
        const Review = response.data;
        console.log(Review);
        console.log(Review);
        feedbackData = new FeedbackData({ ID, Category, Feedback, Review });
        feedbackData.save();
        res.status(201).json({ message: "Your Feedback Successfully Posted" });
      } else {
        console.log("Error communicating with the AI server");
        res.status(500).json({ error: "Error communicating with the AI server" });
      }
    }
  } catch (err) {
    console.log("err");
    res.status(500).json({ error: "Internal server error" });
  }
});









// ------------- Query Post API ------------------

let queryData;
router.post("/Question", async (req, res) => {
  const {
    UserID,
    UserName,
    PostID,
    QueryCategory,
    QueryTitle,
    QueryDetails,
    QueryTags,
  } = req.body;

  try {
    if (
      !UserID ||
      !PostID ||
      !UserName ||
      !QueryCategory ||
      !QueryTitle ||
      !QueryDetails ||
      !QueryTags
    ) {
      console.log("Missing Data");

      return res
        .status(400)
        .json({ error: "Please Filled the Field Properly" });
    } else {

      queryData = new QueryData({
        UserID,
        UserName,
        PostID,
        QueryCategory,
        QueryTitle,
        QueryDetails,
        QueryTags,
      });
      await queryData.save();

      res.status(201).json({ message: "Your Query Successfully Posted" });
      console.log("Your Query Successfully Posted");
    }
  } catch (err) {
    console.log(err);
  }
});


//---------------Query Vote------------------

router.post("/QueryVote", async (req, res) => {
  const { UserID, PostID, Type, UpVote, DeVote } = req.body;
  console.log(req.body); 
  try {

    if (!UserID || !PostID || !Type ) {
      console.log("8888888888888888888");
      return res
        .status(400)
        .json({ message: "please filled the field properly" });
    }
    const userData = await VoteData.findOne({ UserID: UserID, PostID: PostID});
    if(!userData){
      console.log("99999999999999999999");

      user = new VoteData({ UserID, PostID, Type });
      await user.save();

      if(Type ==="upvote"){
        const filter = {PostID: PostID };
        const update = { Upvote: (parseInt(UpVote) + 1).toString() };    
        await QueryData.findOneAndUpdate(filter, update); 
  
      }
      else{
        const filter = {PostID: PostID };
        const update = { Devote: (parseInt(DeVote) + 1).toString() };    
        await QueryData.findOneAndUpdate(filter, update);
  
      }
     
      return res.status(201).json({ message: "Voted Successfully" });


    }
    else
    {
      console.log("0000000000000000000000");
      if (userData.Type === "upvote" && Type ==="upvote"){
        const filter = {UserID: UserID ,PostID: PostID };
        const update = { Type: " " };
    
        await VoteData.findOneAndUpdate(filter, update);
        performVote( PostID, UpVote,"Upvote");



        return res.status(300).json({message: "Already UpVoted"});
      }
      else if (userData.Type === "devote" && Type ==="devote"){
        const filter = {UserID: UserID ,PostID: PostID };
        const update = { Type: " " };
    
        await VoteData.findOneAndUpdate(filter, update);
        performVote( PostID, UpVote,"Devote");

        return res.status(300).json({message: "Already DeVoted"});

      }
      else if (userData.Type === "upvote" && Type ==="devote"){
        return res.status(300).json({message: "Already Upvoted , Either Upvote or Devote"});

      }
      else if (userData.Type === "devote" && Type ==="upvote"){
        return res.status(300).json({message: "Already Devoted , Either Upvote or Devote"});

      }
      else{
        const filter = {UserID: UserID ,PostID: PostID };
        const update = { Type: Type };
    
        await VoteData.findOneAndUpdate(filter, update);
        if(Type ==="upvote"){
          const filter = {PostID: PostID };
          const update = { Upvote: (parseInt(UpVote) + 1).toString() };    
          await QueryData.findOneAndUpdate(filter, update); 
    
        }
        else{
          const filter = {PostID: PostID };
          const update = { Devote: (parseInt(DeVote) + 1).toString() };    
          await QueryData.findOneAndUpdate(filter, update);
    
        }

      return res.status(300).json({ message: "Successfully " + Type });
      }
    }

    // let like = Upvote;
    // like = like + 1;
    // console.log("PostID" + PostID + "Like:::" + like );
      // const filter = { PostID: PostID };
    //   const update = { Upvote: like };
  
    //   await QueryData.findOneAndUpdate(filter, update);
    //   res.status(201).json({ message: "Your Query Successfully Posted" });
    //   console.log("Your Query Successfully Posted");
    
  } catch (err) {
    console.log("87777777777777777777777777");

    console.log(err);
  }
});

const performVote = async (PostID, votedata,UpdateData) => {
    const filter = {PostID: PostID };
    const update = { [UpdateData]: (parseInt(votedata) - 1).toString() };    
    await QueryData.findOneAndUpdate(filter, update);

  
}

const performCommentVote = async (CommentID, votedata,UpdateData) => {
  const filter = {"Comment._id":  CommentID};
  const update = { $inc: { [`Comment.$.${UpdateData}`]: -1 } };
  await QueryData.findOneAndUpdate(filter, update);


}


//------------------Query upvote ---------------------

router.post("/QueryUpvote", async (req, res) => {
  const {PostID,Upvote} = req.body;
  try {
    let like = Upvote;
    like = like + 1;
    console.log("PostID" + PostID + "Like:::" + like );
      const filter = { PostID: PostID };
      const update = { Upvote: like };
  
      await QueryData.findOneAndUpdate(filter, update);
      res.status(201).json({ message: "Your Query Successfully Posted" });
      console.log("Your Query Successfully Posted");
    
  } catch (err) {
    console.log(err);
  }
});

// **************** Query Devote *********************
router.post("/QueryDevote", async (req, res) => {
  const {PostID,Devote} = req.body;
  try {
    let dislike = Devote;
    dislike = dislike + 1;
    console.log("PostID:::" + PostID  + "Dislike:::" + dislike );
      const filter = { PostID: PostID };
      const update = { Devote: dislike };
      await QueryData.findOneAndUpdate(filter, update);

      res.status(201).json({ message: "Your Query Successfully Posted" });
      console.log("Your Query Successfully Posted");
    
  } catch (err) {
    console.log(err);
  }
});




// ---------------- Forgot Pass -------------------

router.post("/Forgot_Pass", async (req,res) =>{
const {Email} = req.body;
try{
  if(!Email) {
    return res
    .status(400)
    .json({ error: "please filled the field properly" });
    }

    if (Email.endsWith("@students.au.edu.pk")) {
      const userExist = await User.findOne({ Email: Email });
      if (userExist) {
        
        let token = jwt.sign({ _id: this._id}, process.env.SECRET_KEY);
        const url = `${process.env.BASE_URL}users/${Email}/forgot_pass/${token}`;
        await sendEmail(Email, "Password Reset Mail", url);
        return res.status(201).json({ message: "An email send to your account please verify." });
      }
    } else {
      return res.status(400).json({ error: "Invalid Data" });
    }

}catch(err){
  console.log(err);
}
});


// ------------- SIGN UP -------------
let user;
let token;

router.post("/signup", async (req, res) => {
  
  const { name, Email, Password, Confirm_Password } = req.body;

  try {
    if (!name || !Email || !Password || !Confirm_Password) {
      return res
        .status(400)
        .json({ error: "please filled the field properly" });
    }

    if (Email.endsWith("@students.au.edu.pk")) {
      const userExist = await User.findOne({ Email: Email });
      if (userExist) {

        return res.status(400).json({ error: "Email already Exist" });
      } else if (Password != Confirm_Password) {

        return res.status(400).json({ error: "Password are not Matching" });
      } else {
        let Photo = "../images/avatar.png";
        let Category;
        if (/\d+/.test(Email.split('@')[0])) {
          Category="Student";
        } else if (/[a-zA-Z]+/.test(Email.split('@')[0])) {
          Category="Teacher";
        }
        user = new User({ name, Email, Password, Confirm_Password, Category,Photo });
        await user.save();
token = await user.generateAuthToken();
  const url = `${process.env.BASE_URL}users/${user._id}/verify/${token}`;
        await sendEmail(user.Email, "Verification Mail", url);

        // console.log("user reg successfully");
        return res.status(201).json({ message: "An email send to your account please verify." });
      }
    } else {
      return res.status(400).json({ error: "Invalid Data" });
    }
  } catch (err) {

    console.log(err);
    return res.status(400).json({ error: "Invalid Data" });
  }
});

// ---------------

router.get("/users/:id/verify/:token", async (req, res) => {
  try {
   
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    const token = await User.findOne({
      _id: user._id,
      "Tokens.token": req.params.token,
    });


    if (!token) {
      console.log("Token dont exist");
      return res.status(400).send({ message: "Invalid Link" });
    }

    if (token) {
      console.log("Token  exist");
    }

    const filter = { _id: user._id };
    const update = { verified: true };

    await User.findOneAndUpdate(filter, update);

    res.status(200).send({ message: "Email Verified Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Internal Server Eror" });
  }
});



//----------Login Route-----

router.post("/login", async (req, res) => {





  const { Email, Password } = req.body;
  try {
    if (!Email || !Password) {
      console.log("missing login credentials");
  
      return res.status(400).json({ error: "please filled the field properly" });
    }

    if(Email === "admin@austd.com" && Password === "adminpass"){
      console.log("88888");
      return res.status(200).send({message : 'Admin'})

    }

    userExist = await User.findOne({ Email: Email });
    if (userExist) {
      const isMatch = await bcrypt.compare(Password, userExist.Password);

      if (!isMatch) {
        console.log("pass incorrect");

        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const verify = userExist.verified;
      // console.log(verify);

      if (!verify) {
        token = await userExist.generateAuthToken();
        const url = `${process.env.BASE_URL}users/${userExist._id}/verify/${token}`;
        await sendEmail(userExist.Email, "verify Email", url);
        console.log("An Email sent to your account please Verifyyyyyyyyyy");
        return res
          .status(403)
          .send({ message: "An Email sent to your account please Verify" });
      } else {
        token = await userExist.generateAuthToken();
        res.cookie("jwToken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });

        res.cookie("Name", userExist.name, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: false,
        });
    
        res.cookie("Email", userExist.Email, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: false,
        });
  
        // console.log("" + userExist);
        console.log("successfully login");

        return res.status(200).json(
          // { message: "User Signin Successfully" }
          userExist
        );
      }

      
    } else {
      console.log("email is incorrect");

      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", async (req, res) => {
  try{
    console.log("helloo to logout");
    res.clearCookie("jwToken", { path: "/" });  
    res.clearCookie("Name", { path: "/" });
    res.clearCookie("Email", { path: "/" });
    return res.status(200).json({ message: "Logout Succeessfully" });
  }catch(e){
    console.log(e);
  }
 
});

let resp;

router.get("/login/success", async (req, res) => {
	console.log("----------------------------");
	if (req.user) {

    const userExistance = await User.findOne({ Email: req.user.emails[0].value });
    if(!userExistance){
      let name =  req.user.name.givenName;
      let Email = req.user.emails[0].value;
      console.log(req.user.photos[0].value);
      // let Photo = "../images/avatar.png";
      let Photo = req.user.photos[0].value;
      let Category;
        if (/\d+/.test(Email.split('@')[0])) {
          Category="Student";
        } else if (/[a-zA-Z]+/.test(Email.split('@')[0])) {
          Category="Teacher";
        }
        user = new User({ name, Email, Photo , verified: true, Category });
        await user.save();

        token = await user.generateAuthToken();
        res.cookie("jwToken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
    }else{
      console.log("8888888888888888888888888888888888888");
      token = await userExistance.generateAuthToken();
      res.cookie("jwToken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
        }


    res.cookie("Name", req.user.name.givenName, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: false,
    });

    res.cookie("Email", req.user.emails[0].value, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: false,
    });

    res.redirect(200, "http://localhost:3001/dashboard/");
		// return res.status(200).json({
		// 	error: false,
		// 	message: "Successfully Logged In",
		// 	user: req.user,	
		// });
    
	} else {
		return res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
  console.log("+++++++++++++++++++");
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: "/login/success",
		failureRedirect: "http://localhost:3001/signup/",
	}),

  

);  

module.exports = router;
