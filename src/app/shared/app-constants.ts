export class AppConstants {
  public static get BASE_URL(): string {
    return 'http://localhost:8081/api/smartschool';
  }

  public static get AVATAR_URL(): string {
    return `${this.BASE_URL}/avatars/download`;
  }

  public static get JWT_STORAGE_KEY(): string {
    return 'JWT';
  }

  public static get LANGUAGE_STORAGE_KEY(): string {
    return 'lang';
  }
}
