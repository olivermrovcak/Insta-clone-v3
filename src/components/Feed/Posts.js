import { collection, onSnapshot, orderBy, query, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import Post from './Post';

function Posts() {

    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
     
       return onSnapshot(query(collection(db, 'posts'), orderBy('timeStamp', 'desc')), (snapshot) => {
            setPosts(snapshot.docs)
            
       })
    

    }, [db])

  return (

    <div>

   {posts.map((posts)=>(
            <Post key={posts.id}
                  id={posts.id}
                  username={posts.data().username} 
                  userImg={posts.data().profileImg}
                  postImg={posts.data().image}
                  caption={posts.data().caption}
                  userId={posts?.data()?.uid}
            />
        ))}
     


</div>

  )
}

export default Posts;
