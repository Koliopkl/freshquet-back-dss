export class CreateUserDto {
  name: string;
  phone_number: string;
  email: string;
  created_at: Date;
  username: string;
  password: string;
  direction: string;
  latitude: number;
  longitude: number;
  biography: string;
  userType: string;
  profile_picture?: string;
  adsInSeeLater: string[];
}
