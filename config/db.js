require('dotenv').config()
// console.log(process.env.DATABASE);
const knex = require('knex')({
    client: 'pg',
    connection: 'postgres://pawan:navgurukul@localhost:5432/blog_db2'
  })

knex.schema.createTable('userDetails', t=>{
    t.increments("id").primary()
    t.string("name")
    t.string("email")
    t.string("password")
}).then(()=>{
    console.log("table userDetails created")
}).catch(err=>{
    console.log(err.message)
})



knex.schema.createTable('post', t=>{
    t.increments("id").primary()
    t.integer("userUniqueId")
    t.string("postTitle")
    t.date("dateOfPost")
        
}).then(()=>{
    console.log("table likeDislike created")
}).catch(err=>{
    console.log(err.message)
})




knex.schema.createTable('likeDislike', t=>{
    t.increments("id").primary()
    t.integer("userUniqueId")
    t.integer("postId")
    t.boolean('like')
    t.boolean('dislike')
}).then(()=>{
    console.log("table post  created")
}).catch(err=>{
    console.log(err.message)
})




module.exports = knex