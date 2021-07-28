const User = require("../../models/user");
const jwt = require("jsonwebtoken"); //generates token for sessions(cookies)


exports.signup = (req,res)=>{
        
    User.findOne({ email: req.body.email})
    .exec((error,user)=>{
        if(user) return res.status(400).json({
            message: "Admin already registered"
        });

        const {
            firstname,
            lastname,
            email,
            password
        } = req.body;
        const _user = new User({ firstname, lastname, email, password, username: Math.random().toString(),role:"admin"});
        _user.save((error, data)=>{
            if(error){
                console.log(error);
                return res.status(400).json({
                    message: "Something went wrong"
                });
            }if(data){
                return res.status(201).json({
                    message: "Admin created successfully"
                })
            }
        })
    });
}

exports.signin = (req,res)=>{
    User.findOne({email: req.body.email})
    .exec((error,user)=>{
        if(error) return res.status(400).json({error});
        if(user){
            if(user.authenticate(req.body.password) && user.role === "admin"){
                const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn: "1h"});
                const {_id,firstname,lastname,email,role,fullname} = user;
                res.status(200).json({
                    token,
                    user: {
                        _id,firstname, lastname, email, role, fullname
                    }
                });
            }else{
                return res.status(400).json({
                    message: "Invalid Password"
                })
            }
        }else{
            return res.status(400).json({message: "Something went wrong"});
        }
    })
}


exports.requireSignin = (req,res,next) =>{
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
    // jwt.decode()
}