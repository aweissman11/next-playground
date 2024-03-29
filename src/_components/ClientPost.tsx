import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Post } from '../types/post';
import { Delete, Star, StarBorder } from '@mui/icons-material';

const ClientPost = ({
  post,
  setPosts,
}: {
  post: Post;
  setPosts: Dispatch<SetStateAction<Post[]>>;
}) => {
  const [pending, setPending] = useState(false);

  const deletePost = async () => {
    setPending(true);
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application-json',
      },
      body: JSON.stringify(post),
    });
    setPosts((posts) => posts.filter((p) => p.id !== post.id));
    setPending(false);
  };

  const starPost = async () => {
    setPending(true);
    await fetch('/api/posts', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application-json',
      },
      body: JSON.stringify({ post, action: 'star' }),
    });
    setPosts((posts) => {
      const updatedPosts = posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            starred: !post.starred,
          };
        }
        return p;
      });

      const thisIndex = updatedPosts.findIndex((p) => p.id === post.id);
      updatedPosts.push(...updatedPosts.splice(0, thisIndex));
      return updatedPosts;
    });
    setPending(false);
  };

  return (
    <ListItem key={post.id}>
      <ListItemButton onClick={starPost} disabled={pending}>
        <ListItemIcon>{post.starred ? <Star /> : <StarBorder />}</ListItemIcon>
      </ListItemButton>
      <ListItemText primary={post.name} />
      <IconButton type="submit" disabled={pending} onClick={deletePost}>
        <Delete />
      </IconButton>
    </ListItem>
  );
};

export default ClientPost;
