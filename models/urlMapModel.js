const mongoose=require('mongoose');


const blogMapSchema=mongoose.Schema({
    parent_blog_id:{type:Number,required:true},
    english: {
        url: { type: String, required: true },
        id: { type: String, required: true }
      },
      dutch: {  // Nederlands
        url: { type: String, required: false },
        id: { type: String, required: false }
      },
      french: {  // Français
        url: { type: String, required: false },
        id: { type: String, required: false }
      },
      portuguese: {  // Português
        url: { type: String, required: false },
        id: { type: String, required: false }
      },
      spanish: {  // Español
        url: { type: String, required: false },
        id: { type: String, required: false }
      },
      german: {  // Deutsch
        url: { type: String, required: false },
        id: { type: String, required: false }
      },
      japanese: {  // 日本語
        url: { type: String, required: false },
        id: { type: String, required: false }
      },
      italian: {  // Italiano
        url: { type: String, required: false },
        id: { type: String, required: false }
      },
      chinese: {  // 简体中文
        url: { type: String, required: false },
        id: { type: String, required: false }
      }
    
},
    {
    timestamps: true,
    }
);





const User = mongoose.model("blogMap", blogMapSchema);
module.exports = User;
