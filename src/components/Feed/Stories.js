import React, { useEffect, useState } from 'react';
import faker from '@faker-js/faker';
import Story from './Story';
function Stories() {

    const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
        ...faker.helpers.contextualCard(),
        id: i,
    }))

    setSuggestions(suggestions);

  }, []);
  return (
  <div className='flex space-x-3 py-6 mt-0 bg-black sm:mt-8
      rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black'>
       
       
        {suggestions.map(profile => (
            <Story 
            key={profile.id} 
            img={profile.avatar}
            userName={profile.username}/>
        ))}

    </div>)
  
}

export default Stories;