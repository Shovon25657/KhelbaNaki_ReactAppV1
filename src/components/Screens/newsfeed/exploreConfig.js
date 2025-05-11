export const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'recent', label: 'Recent' },
    { id: 'following', label: 'Following' },
  ];
  
  export const initialPosts = [
    {
      id: '1',
      type: 'trending',
      user: {
        id: 'user1',
        username: 'ProGamer99',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        followers: ['user3'],
      },
      content: 'Just built my dream gaming PC! RTX 4090, i9-13900K, 32GB DDR5.',
      media: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620',
      likes: ['user2', 'user3'],
      comments: [
        {
          id: 'c1',
          user: { id: 'user2', username: 'GamerGirl42' },
          text: 'Awesome setup!',
          timestamp: '2023-07-20T15:30:00Z',
        },
      ],
      shares: 12,
      timestamp: '2023-07-20T13:00:00Z',
    },
    {
      id: '2',
      type: 'recent',
      user: {
        id: 'user2',
        username: 'GamerGirl42',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        followers: [],
      },
      content: 'Finally got my hands on the new Zelda game! Who else is playing?',
      media: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d',
      likes: ['user1'],
      comments: [],
      shares: 5,
      timestamp: '2023-07-20T14:00:00Z',
    },
  ];
  
  export const defaultUser = {
    id: 'user3',
    username: 'CurrentUser',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    following: ['user1'],
  };