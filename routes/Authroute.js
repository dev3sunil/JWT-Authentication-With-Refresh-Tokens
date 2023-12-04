const express=require('express');
const router=express.Router();
const createError=require('http-errors');
const User=require('../Models/user');

const {authSchema}=require('../helpers/validation_schema');
const { isAuthenticated } = require("../helpers/helper");
const { verifyRefresh } = require("../helpers/helper");
const jwt = require("jsonwebtoken");

router.post('/register',async(req,res,next)=>{
    
    try{
        // const {email,password}=req.body
        //if(!email || !password) throw createError.BadRequest()

        const result=await authSchema.validateAsync(req.body);


        const doesExists=await User.findOne({email:result.email})
        if (doesExists) 
        throw createError.Conflict(`${result.email} is already being registered`)

        const user=new User({ ...result})
        const savedUser=await user.save()

        const { email,password,firstName, user_id } = req.body;
        
        const accessToken = jwt.sign({ user, email:email, password:password, firstName:firstName, user_id:user_id}, "accessSecret", {
         expiresIn: "25m",
         });
        const refreshToken = jwt.sign({ userId: savedUser.id }, 'refreshSecret', {
          expiresIn: '7d',
        });
        return res.status(200).json({id: user._id, accessToken,refreshToken, message:"User Token is Created", });
    }catch(error){
        if(error.isJoi===true) error.status=422;
            next(error);
        }
      
    }
)
     
router.get("/protected", isAuthenticated, (req, res) => {
    res.json({ success: true, msg: "Welcome user!!", user_id: req.user_id, firstName: req.firstName, email: req.email, password: req.password,
    });
});

router.post('/refresh', (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
      throw createError.BadRequest('Refresh token is missing');
  }

  if (!refreshTokens.includes(refreshToken)) {
      throw createError.Unauthorized('Invalid refresh token');
  }

  jwt.verify(refreshToken, 'refreshSecret', (err, user) => {
      if (err) {
          throw createError.Unauthorized('Invalid refresh token');
      }

      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
  });
});

// router.delete('/logout',async(req,res,next)=>{
//     try{

//         const {refreshToken}=req.body
//         if(!refreshToken) throw createError.BadRequest()
//         //now delete both access tokens and refresh tokens to logout user

//     }catch(error){
//         next(error)
//     }
// })
const tokenBlacklist = [];
router.delete('/logout', async (req, res) => {
    try {
      // const { authorization } = req.headers;
      const token = req.headers['auth'];
      const email = req.email;
  
      if (!token || email) {
        throw createError.Unauthorized('Authorization header is missing');
      }
        
      // Check if the token is in the blacklist
      if (tokenBlacklist.includes(token)) {
        throw createError.Unauthorized('Token has already been revoked');
      }

      // Add the token to the blacklist
      tokenBlacklist.push(token);
  
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  });

module.exports=router