const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app = express();
const cors = require('cors')


app.use(cors())
// app.use(express.json({ extended: false }));
// app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({extended:true, parameterLimit:100000, limit:"50mb"}))
app.use(bodyParser.json({limit:"50mb"}))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});



var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dskqkgbbq', 
    api_key: '842911467567667', 
    api_secret: 'WHrqCE7kEBTvx09SHFfYTysDBB4' 
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  const uploadImage = (image) => { //image is converted to base64
    // console.log(image)
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.unsigned_upload(image,'newupload',(error,result)=>{
            if (result && result.secure_url) {
                // console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.log(error.message);
            return reject({message: error.message});
        });
    });
  };



mongoose
  .connect("mongodb+srv://balajink:FR4VHBHy31j8pApH@mycluster.lekkiwf.mongodb.net/authentication?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connected to mongo"))
  .catch((err) => console.log("Connection failed", err));

  const bcrypt = require("bcrypt");

  const { User } = require("./model/usr");
  const { Otp } = require("./model/otp");
  const { Login } = require("./model/login");
  const { Cropdata } = require("./model/cropdata")
  const { Cropname } = require("./model/cropname")
  const { Dealeruser} = require("./model/dealeruser")
  const { Dealdone } = require("./model/dealdone")
  const { Order } = require("./model/order")
  const { Request } = require("./model/requestList")
  const { Reject } = require("./model/rejectedReq")


  app.post('/newData',async(req, res)=>{
    try{
        const username = req.body.username;
        const mobile = req.body.mobile;
        const type = req.body.selectedOption;

        if(type === "farmer"){

        let user = await User.findOne({ username: username, mobile: mobile });
        
        if(user){
          return res.status(404).json({info: "Username already registered as Farmer"})
        }
        else{
          const newUser = new User({
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            address : req.body.address,
            mobile : req.body.mobile,
            type : req.body.selectedOption
          })
          await newUser.save()
       }
      }
      else{
        let user = await Dealeruser.findOne({ username: username, mobile: mobile });
        
        if(user){
          return res.status(404).json({info: "Username already registered as Dealer"})
        }
        else{
          const newUser = new Dealeruser({
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            address : req.body.address,
            mobile : req.body.mobile,
            type : req.body.selectedOption
          })
          await newUser.save()
       }

      }
    }catch(err){
      return res.status(400).json({ info: err });
    }
  });
  
  app.post('/sendData', async (req, res) => {
    try {
      const username = req.body.username
      const input = req.body.mobile

      //check login
      let log = await Login.findOne({username:username})
  
      // validating user
      let user = await User.findOne({ username: username, mobile: input });
      // if (user) return res.status(409).json({ info: "User already registered" });

      if(log===null){
      if (user !== null){       
        // generating otp
        let random = Math.floor(Math.random() * 90000) + 10000;
        console.log(random);
        console.log("Otp generated");
    
        // saving otp in db
        const otp = new Otp({ username: username, mobile: input, otp: random });
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const result = await otp.save();
        console.log("saved", result);
        return res.status(200).json({ iuserExists: true });
      }

      else{
        console.log("User:", user); 

        return res.status(200).json({ iuserExists: false });

      }
    }
    else{
      console.log("loggedIn")

      return res.status(200).json({loggedIn: true})
    }

    } catch (err) {
      return res.status(400).json({ info: "error" });
    }
  });
  
  app.post('/verifyData', async (req, res) => {
    try {
      const username = req.body.username;
      const input = req.body.mobile;
      const pwd = req.body.OTP;
  
      if (pwd.length === 0){
        console.log('Password cannot be blank');}
        
      else{
      // verifying user
      const otp = await Otp.find({ mobile: input });
      if (!otp) {console.log('otp not found');}
      
      else{
      // comparing otp
      const details = otp[otp.length - 1];
      const valid = await bcrypt.compare(pwd, details.otp);

      if(valid){
        console.log('otp verified');
        // const usr = new User({ number: input });
        // await usr.save();
      var token
      if (input === details.mobile && valid) {
        // generating token
        const login = new Login({ username: username,mobile: input });
        await login.save();
        token = login.generateTkn();
        // todo - save jwt tkn in db for comparison later
        // access_token for further usage
        console.log('token generated',token);
        // localStorage.setItem('authToken',token);
      }
      return res.status(200).json({ otptry : true, token : token });
      } else {
        console.log('bad token');
        return res.status(200).json({ otptry : false})
      }
    }
  }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ info: err });
    }
  });

  app.post('/sendDealData', async (req, res) => {
    try {
      const username = req.body.dusername
      const input = req.body.dmobile

      //check log
      let log = await Login.findOne({username:username})
  
      // validating user
      let user = await Dealeruser.findOne({ username: username, mobile: input });
      // if (user) return res.status(409).json({ info: "User already registered" });

      if(log===null){
      if (user !== null){       
        // generating otp
        let random = Math.floor(Math.random() * 90000) + 10000;
        console.log(random);
        console.log("Otp generated");
    
        // saving otp in db
        const otp = new Otp({ username: username, mobile: input, otp: random });
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const result = await otp.save();
        console.log("saved", result);
        return res.status(200).json({ iuserExists: true });
      }     

      else{
        console.log("User:", user); 

        return res.status(200).json({ iuserExists: false });

      }
    }
    else{
      console.log("loggedIn")

      return res.status(200).json({loggedIn: true})
    }
    } catch (err) {
      return res.status(400).json({ info: "error" });
    }
  });
  
  app.post('/verifyDealData', async (req, res) => {
    try {
      const username = req.body.dusername;
      const input = req.body.dmobile;
      const pwd = req.body.dOTP;
  
      if (pwd.length === 0){
        console.log('Password cannot be blank');}
        
      else{
      // verifying user
      const otp = await Otp.find({ mobile: input });
      if (!otp) {console.log('otp not found');}
      
      else{
      // comparing otp
      const details = otp[otp.length - 1];
      const valid = await bcrypt.compare(pwd, details.otp);

      if(valid){
        console.log('otp verified');
        // const usr = new User({ number: input });
        // await usr.save();  
        var token
      if (input === details.mobile && valid) {
        // generating token
        const login = new Login({ username: username,mobile: input });
        await login.save();
        token = login.generateTkn();
        // todo - save jwt tkn in db for comparison later
        // access_token for further usage
        console.log('token generated',token);
        // localStorage.setItem('authToken',token);
      }
      return res.status(200).json({ otptry : true,token : token });
      } else {
        console.log('bad token');
        return res.status(200).json({ otptry : false})
      }
    }
  }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ info: err });
    }
  });

  app.post('/logout',async(req,res)=>{
    const name = req.body.username

    await Login.deleteMany({username:name})

    res.status(200).json({info:"logout success"})

    console.log(name)
  })


  app.post('/getCropData', async(req,res)=>{
      const name = req.body.name
      // console.log(name)
      await Cropdata.find({crop:name}).then((data)=>{
        res.json(data)
      })
    
  })

  app.get('/getCropName', async (req,res)=>{

      await Cropname.find({}).then((data)=>{
        res.json(data)
      })
    

  })


  app.post('/newCropData', async (req,res)=>{
    const cropname = req.body.crop;
    // const dname = req.body.dname;

    const cname = await Cropname.findOne({ name:cropname });

    if(cname===null){
      const newName = new Cropname({
        name:crop
      })
      await newName.save()
    }
    else{
      console.log(cname)
    }
    
    const newData = new Cropdata({
      company : req.body.company,
      GST : req.body.gst,
      dname : req.body.dname,
      crop : req.body.crop,
      cropname : req.body.cropname,
      rate : req.body.rate,
      quantype : req.body.quantype,
      note : req.body.note,
      quan : req.body.quan,
      image : req.body.picture
    })
    await newData.save()

    return res.status(200).json({test:'success'})

  })

  app.post('/getMyPO', async(req,res)=>{
    const dname = req.body.dname;

    await Cropdata.find({dname:dname}).then((data)=>{
      res.json(data)
    })

  })

  app.post('/getMyOrder', async(req,res)=>{
    const dname = req.body.dname

    await Dealdone.find({dname:dname}).then((data)=>{
      res.json(data)
    })
  })

  app.post('/sellCroptest', async(req,res)=>{
    const cropname = req.body.cropname
    // console.log(cropname)
    const dname = req.body.dname
    const quan = req.body.quan

    const data = await Cropdata.findOne({dname:dname, cropname:cropname});
    // console.log(data)

    // const quanNew = parseInt(quan)
    // const quanData = parseInt(data.quan)

    // const updatedquan = (quanData - quanNew).toString();
    // console.log(updatedquan);

    // if (updatedquan !== '0'){

    //   const updateData = await Cropdata.updateOne({

    //     dname:dname, 
    //     cropname:cropname
  
    //   },{
  
    //     company : data.company,
    //     GST : data.GST,
    //     dname : data.dname,
    //     crop : data.crop,
    //     cropname : data.cropname,
    //     rate : data.rate,
    //     quantype : data.quantype,
    //     // note : data.note,
    //     quan : updatedquan,
    //     image : data.image
           
    //   })
    //     // await updateData.save()

    // }else{

    //   const deleteData = await Cropdata.deleteOne({dname:dname,cropname:cropname});
    // }


    const newData = new Request({

      company : data.company,
      GST : data.GST,
      dname : data.dname,
      crop : data.crop,
      cropname : data.cropname,
      rate : data.rate,
      quantype : data.quantype,
      // note : data.note,
      fname : req.body.fname,
      quan : quan,
      image : data.image

  })
    await newData.save()

    res.status(200).json({info:"success"})

  })

  app.post('/deleteOrdertest',async(req,res)=>{
    
    const dname = req.body.dname
    const cropname = req.body.cropname

    const deleteData = await Cropdata.deleteOne({dname:dname,cropname:cropname});   
      
  })

  app.post('/cancellDealtest', async(req,res)=>{
    const id = req.body.id
    const cropname = req.body.cropname
    const dname = req.body.dname

    const data = await Dealdone.findOne({_id: id });
    console.log(data)

    const prevData = await Cropdata.findOne({dname:dname, cropname:cropname});
    console.log(prevData)

    const quanNew = parseInt(data.quan)

    if (prevData !== null){

    const quanOld = parseInt(prevData.quan)

    const updatedquan = (quanOld + quanNew).toString();

    
    const updateData = await Cropdata.updateOne({

        dname:dname, 
        cropname:cropname
  
      },{
  
        company : data.company,
        GST : data.GST,
        dname : data.dname,
        crop : data.crop,
        cropname : data.cropname,
        rate : data.rate,
        quantype : data.quantype,
        // note : data.note,
        quan : updatedquan,
        image : data.image
           
      })
        // await updateData.save()

      const deleteData = await Dealdone.deleteOne({_id:id})

    }else{

      const createData = await new Cropdata({

        company : data.company,
        GST : data.GST,
        dname : data.dname,
        crop : data.crop,
        cropname : data.cropname,
        rate : data.rate,
        quantype : data.quantype,
        // note : data.note,
        quan : data.quan,
        image : data.image

      });
      await createData.save();

      const deleteData = await Dealdone.deleteOne({_id:id})
    }

  })



  app.post('/uploadImage',async(req,res)=>{

    // console.log(req.body.image)

    await uploadImage(req.body.image)
    .then((url)=>{
      console.log(url)
      return res.json({urlid: url})
  })
    .catch((err)=>{
      console.log(err)
    });
  });
  
  app.post('/getMyRequest',async(req,res)=>{
    
    const dname = req.body.dname;
    
    await Request.find({dname:dname})
    .then((data)=>{
      res.json(data)
    })

  })

  app.post('/getMyFaRequest',async(req,res)=>{
    
    const fname = req.body.fname;
    
    await Request.find({fname:fname})
    .then((data)=>{
      console.log(data)
      res.json(data)
    })

  })

  app.post('/getMyFaReject',async(req,res)=>{
    
    const fname = req.body.fname;
    
    await Reject.find({fname:fname})
    .then((data)=>{
      console.log(data)
      res.json(data)
    })

  })



  app.post('/acceptRequest',async(req,res)=>{

    const id = req.body.id
    const quan = req.body.quan

    const intQuan = parseInt(quan);

    const data = await Request.findOne({_id:id});

    const prevData = await Cropdata.findOne({dname:data.dname, cropname:data.cropname});

    const quanNew = parseInt(data.quan)
    const quanData = parseInt(prevData.quan)

    const updatedquan = (quanData - intQuan).toString();
    console.log(updatedquan);

    if (updatedquan !== '0'){

      const updateData = await Cropdata.updateOne({

        dname:data.dname, 
        cropname:data.cropname
  
      },{
  
        company : data.company,
        GST : data.GST,
        dname : data.dname,
        crop : data.crop,
        cropname : data.cropname,
        rate : data.rate,
        quantype : data.quantype,
        // note : data.note,
        quan : updatedquan,
        image : data.image
           
      })
        // await updateData.save()

    }else{

      const deleteData = await Cropdata.deleteOne({dname:data.dname,cropname:data.cropname});
    }

    if( intQuan !== quanNew ){

      const rejQuan = (quanNew-intQuan).toString();

      const reject = await new Reject({

        company : data.company,
        GST : data.GST,
        dname : data.dname,
        crop : data.crop,
        cropname : data.cropname,
        rate : data.rate,
        quantype : data.quantype,
        // note : data.note,
        quan : rejQuan,
        image : data.image,
        fname : data.fname

      })
      await reject.save();
    }


    const newData = new Dealdone({

      company : data.company,
      GST : data.GST,
      dname : data.dname,
      crop : data.crop,
      cropname : data.cropname,
      rate : data.rate,
      quantype : data.quantype,
      // note : data.note,
      fname : data.fname,
      quan : quan,
      image : data.image

  })
    await newData.save()

    const reqDeleteData = await Request.deleteOne({_id:id})

  })

  app.post('/cancelRequest',async(req,res)=>{
    
    const id = req.body.id;

    const data = await Request.findOne({_id:id})

    const newRej = await new Reject({

      company : data.company,
      GST : data.GST,
      dname : data.dname,
      crop : data.crop,
      cropname : data.cropname,
      rate : data.rate, 
      quantype : data.quantype,
      // note : data.note,
      fname : data.fname,
      quan : data.quan,
      image : data.image

    })
    await newRej.save()
    
    const deleteReq = await Request.deleteOne({_id:id});

  })


  app.post('/profileData', async(req,res)=>{
    
    const username = req.body.username;

    const data = await User.findOne({username:username});

    if(data){

      return res.status(200).json({name:data.name, email:data.email, mobile:data.mobile, address:data.address})

    }
    else{

      console.log(data);
    
    }

  })

  app.post('/dprofileData', async(req,res)=>{
    
    const username = req.body.username;

    const data = await Dealeruser.findOne({username:username});

    if(data){

      return res.status(200).json(data)
      
    }
    else{

      console.log(data);
    
    }

  })

  app.post('/getData',async(req,res)=>{
    
    const  username = req.body.dname;

    const data = await Dealeruser.findOne({username:username});

    if(data){

      console.log(data);

      return res.status(200).json({userData:data})
      
    }
    else{

      console.log(data);
    
    }
  })

  app.post('/search',async(req,res)=>{
    const { q, sort }  = req.query;
    var sortBy

    // console.log(sort)

    if(sort==="asc"){
      sortBy={name:1}
    }
    else if (sort==='dsc'){
      sortBy={name:-1}
    }

    const data = await Cropname.find({}).sort(sortBy)

    // console.log(data)

    const keys=["name"];

    const search = (data) => {
      return data.filter((item)=>
      keys.some((key)=>item[key].toLowerCase().includes(q))
      );
    }
    res.json(search(data));
  })

  app.post('/search2',async(req,res)=>{
    const { q, sort }  = req.query;
    const name = req.body.name;
    var sortBy

    if(sort==="a"){
      sortBy={cropname:1}
    }

    const data = await Cropdata.find({crop:name}).sort(sortBy)


    const keys=["cropname"];

    const search = (data) => {
      return data.filter((item)=>
      keys.some((key)=>item[key].toLowerCase().includes(q))
      );
    }
    res.json(search(data));
  })

  app.post('/editProfile',async(req,res)=>{

    const id = req.body.id
    
    const edit = await Dealeruser.updateOne({

      _id:id
    
    },{
    
      name:req.body.name,
      email:req.body.email,
      address:req.body.address,
      mobile:req.body.mobile
    
    });
  })



  

// driver code
const port = 3000;
app.listen(port, () => {
  console.log(`Application started at: http://localhost:${port}`);
});
