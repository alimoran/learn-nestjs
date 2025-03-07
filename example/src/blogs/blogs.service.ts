import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  blogId: number;
  userId: number;
  createdAt: Date;
}

export interface UserFollowing {
  userId: number;
  followingIds: number[];
}

@Injectable()
export class BlogsService {
  private blogs: Blog[] = [];
  private comments: Comment[] = [];
  private userFollowing: UserFollowing[] = [];
  private blogIdCounter = 1;
  private commentIdCounter = 1;

  create(createBlogDto: CreateBlogDto): Blog {
    const blog = {
      id: this.blogIdCounter++,
      ...createBlogDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      comments: [],
    };
    this.blogs.push(blog);
    return blog;
  }

  findAll(): Blog[] {
    return this.blogs;
  }

  findOne(id: number): Blog {
    const blog = this.blogs.find(blog => blog.id === id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }

  findByAuthor(authorId: number): Blog[] {
    return this.blogs.filter(blog => blog.authorId === authorId);
  }

  update(id: number, updateBlogDto: Partial<CreateBlogDto>): Blog {
    const blogIndex = this.blogs.findIndex(blog => blog.id === id);
    if (blogIndex === -1) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    
    this.blogs[blogIndex] = {
      ...this.blogs[blogIndex],
      ...updateBlogDto,
      updatedAt: new Date(),
    };
    
    return this.blogs[blogIndex];
  }

  remove(id: number): void {
    const blogIndex = this.blogs.findIndex(blog => blog.id === id);
    if (blogIndex === -1) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    this.blogs.splice(blogIndex, 1);
  }

  // Comments functionality
  addComment(createCommentDto: CreateCommentDto): Comment {
    const comment = {
      id: this.commentIdCounter++,
      ...createCommentDto,
      createdAt: new Date(),
    };
    this.comments.push(comment);
    
    // Add comment to blog
    const blog = this.findOne(createCommentDto.blogId);
    blog.comments.push(comment);
    
    return comment;
  }

  getComments(blogId: number): Comment[] {
    return this.comments.filter(comment => comment.blogId === blogId);
  }

  // Likes functionality
  likeBlog(blogId: number): Blog {
    const blog = this.findOne(blogId);
    blog.likes++;
    return blog;
  }

  unlikeBlog(blogId: number): Blog {
    const blog = this.findOne(blogId);
    if (blog.likes > 0) {
      blog.likes--;
    }
    return blog;
  }

  // Following functionality
  followAuthor(userId: number, authorId: number): UserFollowing {
    let userFollowing = this.userFollowing.find(uf => uf.userId === userId);
    
    if (!userFollowing) {
      userFollowing = {
        userId,
        followingIds: [],
      };
      this.userFollowing.push(userFollowing);
    }

    if (!userFollowing.followingIds.includes(authorId)) {
      userFollowing.followingIds.push(authorId);
    }

    return userFollowing;
  }

  unfollowAuthor(userId: number, authorId: number): UserFollowing {
    let userFollowing = this.userFollowing.find(uf => uf.userId === userId);
    
    if (!userFollowing) {
      userFollowing = {
        userId,
        followingIds: [],
      };
      this.userFollowing.push(userFollowing);
    }

    userFollowing.followingIds = userFollowing.followingIds.filter(id => id !== authorId);
    return userFollowing;
  }

  getFollowing(userId: number): number[] {
    const userFollowing = this.userFollowing.find(uf => uf.userId === userId);
    return userFollowing ? userFollowing.followingIds : [];
  }

  getFeed(userId: number): Blog[] {
    const following = this.getFollowing(userId);
    return this.blogs
      .filter(blog => following.includes(blog.authorId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
} 