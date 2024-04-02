const Note = require('../models/notes');
const mongoose = require('mongoose');

exports.dashboard = async(req,res)=>{
    let perPage = 12;
    let page = req.query.page || 1;
    const locals = {
        title:'Dashboard'
    };

    try {
        // Mongoose "^7.0.0 Update
        const notes = await Note.aggregate([
          { $sort: { updatedAt: -1 } },
          { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
          {
            $project: {
              title: { $substr: ["$title", 0, 30] },
              body: { $substr: ["$body", 0, 100] },
            },
          },
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    
        const count = await Note.countDocuments();
    
        res.render('dashboard/index', {
          userName: req.user.firstName,
          locals,
          notes,
          layout: "../views/layouts/dashboard",
          current: page,
          pages: Math.ceil(count / perPage)
        });
       } catch (error) {
        console.log(error);
      }
    };


    // View Note
    exports.dashboardViewNote= async(req,res)=>{
      const note = await Note.findById({_id:req.params.id})
      .where({user:req.user.id}).lean();

      if(note){
        res.render('dashboard/view-notes',{
          noteID: req.params.id,
          note,
          layout: '../views/layouts/dashboard'
        });
      }else{
        res.send("Error!!")
      }


    }


    // Put request
    exports.dashboardUpdateNote= async(req,res)=>{
      try{
        await Note.findOneAndUpdate(
          {_id: req.params.id },
          {title: req.body.title,body:req.body.body}
          ).where({user:req.user.id});

          res.redirect('/dashboard');
      }catch(err){
        console.log(err);
      }
    }


    // Delete note
    exports.dashboardDeleteNote = async(req,res)=>{
      try{  
        await Note.deleteOne({_id: req.params.id}).where({user:req.user.id});
        res.redirect('/dashboard');
      }catch(err){
        console.log(err);
      }
    }

// Add Note
exports.dashboardAddNote = async(req,res)=>{
  res.render('dashboard/add',{
    layout: '../views/layouts/dashboard'
  });
}

// post add
exports.dashboardAddNoteSubmit = async(req,res)=>{
  try{
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard');
  }catch(err){
    console.log(err);
  }
}

    


