import { Injectable } from "@angular/core";
import { KeycloakProfile } from "keycloak-js";
import { KeycloakEventType, KeycloakService } from "keycloak-angular";

@Injectable({ providedIn: "root" })
export class SecurityService {
  public profile?: KeycloakProfile;

  constructor(public kcService: KeycloakService) {
    this.init();
  }

  init() {
    this.kcService.keycloakEvents$.subscribe({
      next: (e) => {
        if (e.type == KeycloakEventType.OnAuthSuccess) {
          this.loadUserProfile();
        }
      },
    });

    // Load user profile when the application starts
    this.loadUserProfile();
  }


  private loadUserProfile() {
    this.kcService
      .loadUserProfile()
      .then((profile) => {
        this.profile = profile;
        console.log("User Profile:", this.profile);
      })
      .catch((error) => {
        console.error("Error loading user profile:", error);
      });
  }

  public getAuthenticatedUsername(): string | undefined {
    return this.profile?.username;
  }

  public async getAuthenticatedUserId(): Promise<string | undefined> {
    await this.init();
    return this.profile?.id;
  }

  public hasRoleIn(roles: string[]): boolean {
    let userRoles = this.kcService.getUserRoles();
    for (let role of roles) {
      if (userRoles.includes(role)) return true;
    }
    return false;
  }

  public isAuthenticated(): boolean {
    return this.kcService.isLoggedIn();
  }
}
