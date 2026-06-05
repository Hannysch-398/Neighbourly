import { Component, Input } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostResponse } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css'],
})
export class PostCard {
  @Input({ required: true }) post!: PostResponse;
}
