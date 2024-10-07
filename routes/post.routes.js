// codigo sobre posteoss
import { Router } from "express";
import { readFile, writeFile  } from 'fs/promises' 

const router = Router()
 
const getData = async()=>{
    const filePost = await readFile('./data/posts.json', 'utf-8') 
    return JSON.parse(filePost)
}

router.get('/', async (req,res)=>{
   
    const postsData = await getData()

    if(postsData){
        res.status(200).json(postsData)
    }else{
        res.status(400).json({status:false})
    }
})

router.post('/add', async (req,res)=>{
    /*
        input = {author, text}
    */
    const data = req.body
    const postsData = await getData()
    data.likes= 0
    data.id = postsData[postsData.length-1].id + 1

    console.log(data) // {author:'johndoe', text:'hola mundo', likes:0, id:5}
    postsData.push(data)
   
    writeFile('./data/posts.json', JSON.stringify(postsData,null,2));
    res.status(200).json('Post creado')
})

router.put('/like/:id', async (req,res)=>{
    const id = req.params.id
    const postsData = await getData()
    try{
        const index = postsData.findIndex(e => e.id == id)
        if(index > -1){
            postsData[index].likes++
        }
        writeFile('./data/posts.json', JSON.stringify(postsData,null,2));
        res.sendStatus(200);

    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})



router.delete('/delete/:id', async (req,res)=>{
    const id = req.params.id
    const postsData = await getData()
    try{
        const newPost = postsData.filter(post => post.id != id)
        console.log(newPost)
        writeFile('./data/posts.json', JSON.stringify(newPost,null,2));
        res.sendStatus(200);

    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

export default router
