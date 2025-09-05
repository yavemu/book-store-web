import { 
  LoginDto, 
  LoginResponseDto, 
  RegisterResponseDto, 
  RegisterUserDto, 
  UserProfileResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
  PasswordResetRequestDto,
  PasswordResetConfirmDto
} from "@/types/auth";
import { apiClient } from "../client";

class AuthService {
  private getAuthToken(): string | null {
    console.log("🔑 AuthService: getAuthToken");
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  private setAuthToken(token: string): void {
    console.log("🔑 AuthService: setAuthToken", token);
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      console.log("🔑 AuthService: creado", token);
    }
  }

  private removeAuthToken(): void {
    console.log("🔑 AuthService: removeAuthToken");
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(registerData: RegisterUserDto): Promise<RegisterResponseDto> {
    try {
      const response = await apiClient.post<RegisterResponseDto>("/auth/register", registerData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginDto): Promise<LoginResponseDto> {
    console.log("Estoy en login");
    const authId = Math.random().toString(36).substr(2, 9);
    try {
      console.log(`🔄 AuthService [${authId}]: Enviando login request a /auth/login con:`, loginData);
      const response = await apiClient.post<LoginResponseDto>("/auth/login", loginData);
      console.log(`📡 AuthService [${authId}]: Respuesta recibida:`, response);

      if (response.access_token) {
        console.log(`🔑 AuthService [${authId}]: Guardando token en localStorage:`, response.access_token);
        this.setAuthToken(response.access_token);
      } else {
        console.warn(`⚠️ AuthService [${authId}]: No se recibió access_token en la respuesta`);
      }

      return response;
    } catch (error) {
      console.error(`❌ AuthService [${authId}]: Error en login:`, error);
      throw error;
    }
  }

  async getProfile(): Promise<UserProfileResponseDto> {
    try {
      const response = await apiClient.get<UserProfileResponseDto>("/auth/me");
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(updateData: UpdateProfileDto): Promise<UserProfileResponseDto> {
    try {
      const response = await apiClient.put<UserProfileResponseDto>("/auth/me", updateData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(passwordData: ChangePasswordDto): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put<{ success: boolean; message: string }>("/auth/change-password", passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(requestData: PasswordResetRequestDto): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>("/auth/reset-password", requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async confirmPasswordReset(confirmData: PasswordResetConfirmDto): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>("/auth/reset-password/confirm", confirmData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.removeAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getToken(): string | null {
    return this.getAuthToken();
  }
}

export const authService = new AuthService();
