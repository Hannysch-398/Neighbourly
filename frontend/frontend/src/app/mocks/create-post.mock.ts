import { CreatePostRequest } from '../models/post.model';
import {CreatePostLocationDto} from '../models/post.model';

const mockLocation: CreatePostLocationDto = {
  city: 'Bremen',
  postalCode: '28195',
  address: 'Musterstraße 12',
  lat: 53.0793,
  lng: 8.8017,
  precision: 'EXACT',
  radiusM: 50,
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
    skillTags: ['German'],
    availabilityNote: 'Nachmittags oder am Wochenende',
    experienceLevel: 'ADVANCED',
  },
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
    price: 150,
    currency: 'EUR',
    condition: 'USED',
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
    rent: 900,
    rooms: 2,
    availableFrom: '2026-06-01'
  }
};
