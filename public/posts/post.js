export const getPost = async ()=>{
    try{
      const response = await fetch('http://localhost:3000/posts',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if(!response.ok){
        throw new Error(`Error: ${response.status}`)
      }

      const posts = await response.json()
      return posts
    }catch(error){
      console.error('Error al traer posts: ', error)
    }
}

export const addPost = async(data)=>{
   try{
    const response = await fetch('http://localhost:3000/posts/add',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if(!response.ok){
      throw new Error(`Error: ${response.status}`)
    }

    const res = await response.json()
    return res

   }catch(error){
    console.error('Error al crear un post: ', error)
   }
}

export const likePost = async(id)=>{
  try{
    const response = await fetch(`http://localhost:3000/posts/like/${id}`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if(!response.ok){
      const errorMsg = await response.text()
      throw new Error(`Error: ${errorMsg}`)
    }

    const res = await res.text()
    return res
  }catch(error){
    console.error('Error al dar like: ', error)
  }
}

export const deletePost = async(id)=>{
  try{
    const response = await fetch(`http://localhost:3000/posts/delete/${id}`,{
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if(!response.ok){
      const errorMsg = await response.text()
      throw new Error(`Error: ${errorMsg}`)
    }

    const res = await res.text()
    return res
  }catch(error){
    console.error('Error al dar like: ', error)
  }
}