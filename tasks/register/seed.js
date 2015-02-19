module.exports=function(grunt){

    grunt.registerTask('seed',function(){
      var sails=require('sails');
      console.log(sails);
      //not positive
      // sails.config.models.Metro.create([{
      //   name: "Melbourne",
      //   country: "Australia"
      //   },
      //   {
      //   name: "Adelaide",
      //   country: "Australia"
      //   }]).exec(function(err,created) {
      //     console.log(error)
      //     console.log(created)
      //   })
      console.log('ran the task!');
    });


}