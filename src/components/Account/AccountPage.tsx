import React, {useEffect, useState} from 'react';
import Header from '../Nav/Header';
import {useLocation} from 'react-router-dom'
import 'firebase/firestore';
import {
    getFollowersCount,
    getFollowingCount,
    getPosts,
    getProfile
} from "../../firebase/apiCalls";
import PostsGrid from "./PostsGrid";
import Stories from "./Stories";
import UserInformation from "./UserInformation";

interface user {
    photoUrl: string,
    name: string
    uid: string,
}

interface post {
    uid: string,
    image: string,
}

function AccountPage() {
    const userId = useLocation().state.userId;
    const [user, setUser] = useState<user>();
    const [posts, setPosts] = useState<post[]>();
    const [followersCount, setFollowersCount] = useState<number>();
    const [followingCount, setFollowingCount] = useState<number>();

    async function fetchPosts() {
        try {
            const posts = await getPosts();
            const usersPosts = posts.filter((post: any) => post.uid === userId);
            setPosts(usersPosts as any);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchUserData() {
        try {
            const user = await getProfile(userId);
            const followersCount = await getFollowersCount(userId);
            const followingCount = await getFollowingCount(userId);
            setUser(user as any)
            setFollowersCount(followersCount);
            setFollowingCount(followingCount);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchUserData();
        fetchPosts();
    }, []);

    return (
        <div className="bg-black w-screen h-screen overflow-y-scroll scrollbar-hide flex items-start text-white">
            <Header/>
            <section className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center  max-w-[1000px] h-full px-14 py-6">
                    {user &&
                        <>
                            <UserInformation
                                user={user as user}
                                postsCount={posts?.length ?? 0}
                                followersCount={followersCount ?? 0}
                                followingCount={followingCount ?? 0}
                            />
                            <Stories user={user as user}/>
                            <PostsGrid posts={posts as post[]}/>
                        </>
                    }
                </div>
            </section>
        </div>
    )
}

export default AccountPage;
