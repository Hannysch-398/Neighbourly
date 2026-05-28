import { CreatePostRequest } from '../models/create-post-request.model';

export const eventCreatePostMock: CreatePostRequest = {
  title: 'Community dinner',
  description: 'Dinner with neighbours',
  type: 'EVENT',
  postMode: 'OFFER',
  isUrgent: false,
  urgentUntil: null,
  details: {
    eventDate: '2026-06-01T18:00:00',
    locationName: 'Community Center'
  }
};

export const skillCreatePostMock: CreatePostRequest = {
  title: 'German tutoring',
  description: 'Helping with German homework',
  type: 'SKILL',
  postMode: 'OFFER',
  isUrgent: false,
  urgentUntil: null,
  details: {
    skillName: 'German',
    experienceLevel: 'ADVANCED'
  }
};

export const productCreatePostMock: CreatePostRequest = {
  title: 'Selling bicycle',
  description: 'Used city bike in good condition',
  type: 'PRODUCT',
  postMode: 'OFFER',
  isUrgent: false,
  urgentUntil: null,
  details: {
    productName: 'City Bike',
    price: 150
  }
};

export const housingCreatePostMock: CreatePostRequest = {
  title: 'Apartment search',
  description: 'Looking for a small apartment',
  type: 'HOUSING',
  postMode: 'REQUEST',
  isUrgent: false,
  urgentUntil: null,
  details: {
    housingType: 'APARTMENT',
    rent: 900
  }
};
