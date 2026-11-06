const m=require('mongoose'),S=m.Schema;
const Content=m.model('Content',new S({type:{type:String,index:true},title:String,slug:{type:String,index:true},excerpt:String,body:String,tags:[String],image:String,live:String,github:String,verify:String,meta:String,published:{type:Boolean,default:true}},{timestamps:true}));
const Review=m.model('Review',new S({name:String,rating:{type:Number,min:1,max:5},text:String,postSlug:{type:String,default:''},approved:{type:Boolean,default:false}},{timestamps:true}));
const Message=m.model('Message',new S({name:String,email:String,subject:String,message:String},{timestamps:true}));
module.exports={Content,Review,Message};
