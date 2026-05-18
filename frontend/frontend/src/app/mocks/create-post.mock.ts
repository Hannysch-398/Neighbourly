import { CreatePostRequest } from '../models/create-post-request.model';

const mockLocation = {
  lat: 53.0793,
  lng: 8.8017,
  precision: 'APPROXIMATE',
  radius_m: 500
};

export const eventCreatePostMock: CreatePostRequest = {
  title: 'Community dinner',
  description: 'Dinner with neighbours',
  type: 'EVENT',
  postMode: 'OFFER',
  isUrgent: false,
  urgentUntil: null,
  location: mockLocation,
  details: {
    detailType: 'EVENT',
    startDate: '2026-06-01T18:00:00',
    endDate: '2026-06-01T20:00:00',
    venue: 'Community Center'
  }
};

export const skillCreatePostMock: CreatePostRequest = {
  title: 'German tutoring',
  description: 'Helping with German homework',
  type: 'SKILL',
  postMode: 'OFFER',
  isUrgent: false,
  urgentUntil: null,
  location: mockLocation,
  details: {
    detailType: 'SKILL',
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
  location: mockLocation,
  details: {
    detailType: 'PRODUCT',
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
  location: mockLocation,
  details: {
    detailType: 'HOUSING',
    housingType: 'APARTMENT',
    rent: 900
  }
};
