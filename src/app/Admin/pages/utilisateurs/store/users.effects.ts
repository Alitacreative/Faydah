import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, from } from 'rxjs';
import { map, catchError, switchMap, filter } from 'rxjs/operators';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import * as UsersActions from './users.actions';
import { ApiUser, User, ApiResponse, PaginatedResponse, UserFormData } from '../../utilisateurs/modals/users.model';

// ✅ CONSTANTES POUR UNIFORMITÉ DES RÔLES
export const USER_ROLES = {
  USER: 'FAYDA_ROLE_USER',
  DISCIPLE: 'FAYDA_ROLE_DISCIPLE',
  DAHIRA_RESP: 'FAYDA_ROLE_DAHIRA',
  MOUQADAM: 'FAYDA_ROLE_MOUQADAM',
  ADMIN: 'FAYDA_ROLE_ADMIN'
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.USER]: 'Utilisateur',
  [USER_ROLES.DISCIPLE]: 'Disciple',
  [USER_ROLES.DAHIRA_RESP]: 'Responsable Dahira',
  [USER_ROLES.MOUQADAM]: 'Mouqadam',
  [USER_ROLES.ADMIN]: 'Administrateur'
} as const;

export const LEGACY_ROLE_MAPPING = {
  'Disciples': USER_ROLES.DISCIPLE,
  'Mouqadam': USER_ROLES.MOUQADAM,
  'Resp. Dahira': USER_ROLES.DAHIRA_RESP,
  'Visiteurs': USER_ROLES.USER,
  'DISCIPLE': USER_ROLES.DISCIPLE,
  'ADMIN': USER_ROLES.ADMIN
} as const;

@Injectable()
export class UsersEffects {
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private readonly debug = !environment.production;

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  // ✅ EFFET LOAD USERS
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(({ page = 0, size = 50 }) =>
        from(this.fetchUsers(page, size)).pipe(
          map(response => {
            const users = response.users;
            const totalElements = response.totalElements;
            const totalPages = response.totalPages;
            return UsersActions.loadUsersSuccess({ users, totalElements, totalPages });
          }),
          catchError(error => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  // ✅ EFFET CREATE USER CORRIGÉ
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      
      ofType(UsersActions.createUser),
      
      filter(({ userData }) => {
        const isValid = userData && typeof userData === 'object' && userData.firstName;
        if (!isValid) {
          console.warn('🚫 Action createUser ignorée - données invalides:', userData);
        }
        return Boolean(isValid);
      }),
      switchMap(({ userData, file }) => {
        this.log('🔍 EFFECT - userData reçu:', userData);
        this.log('🔍 EFFECT - file reçu:', file);

        return from(this.createUser(userData, file)).pipe(
          map(user => {
            this.log('✅ Utilisateur créé avec succès:', user);
            return UsersActions.createUserSuccess({ user });
          }),
          catchError(error => {
            console.error('❌ Erreur création utilisateur:', error);
            
         let errorMessage = error.message || 'Erreur de création';
            
           if (error.message?.includes('déjà utilisé') || error.message?.includes('déjà pris') || error.message?.includes('existe déjà')) {
              errorMessage = error.message;
           } else {
              if (userData && typeof userData === 'object') {
                const localUser = this.createUserWithFallback(userData);
                const serializableUser = JSON.parse(JSON.stringify(localUser));
                this.store.dispatch(UsersActions.addUserLocally({ user: serializableUser }));
                errorMessage = 'Utilisateur créé localement (problème serveur)';
              }
            }
            
            return of(UsersActions.createUserFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  // ✅ EFFET UPDATE USER CORRIGÉ AVEC DEBUG
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap(({ userId, userData }) => {
        // ✅ Debug complet pour identifier le problème
        console.log('🔍 === UPDATE USER EFFECT DEBUG ===');
        console.log('🔍 userId:', userId);
        console.log('🔍 userData:', userData);
        console.log('🔍 API_BASE_URL:', this.API_BASE_URL);
        console.log('🔍 URL complète:', `${this.API_BASE_URL}/users/${userId}`);
        console.log('🔍 Type userId:', typeof userId);
        console.log('🔍 Type API_BASE_URL:', typeof this.API_BASE_URL);
        
        // ✅ Validation préliminaire
        if (!userId || userId === 'undefined' || userId === 'null') {
          console.error('❌ userId invalide:', userId);
          return of(UsersActions.updateUserFailure({ error: 'ID utilisateur invalide' }));
        }
        
        if (!this.API_BASE_URL || this.API_BASE_URL.includes('undefined')) {
          console.error('❌ API_BASE_URL invalide:', this.API_BASE_URL);
          return of(UsersActions.updateUserFailure({ error: 'URL API non configurée' }));
        }
        
        return from(this.updateUser(userId, userData)).pipe(
          map(user => {
            console.log('✅ Update user success:', user);
            return UsersActions.updateUserSuccess({ user });
          }),
          catchError(error => {
            console.error('❌ Update user error:', error);
            console.error('❌ Error details:', {
              message: error.message,
              status: error.response?.status,
              url: error.config?.url
            });
            
            // ✅ Fallback local si possible
            if (userData) {
              const localUser = { id: userId, ...userData } as User;
              this.store.dispatch(UsersActions.updateUserLocally({ user: localUser }));
            }
            return of(UsersActions.updateUserFailure({ error: error.message || 'Erreur de mise à jour' }));
          })
        );
      })
    )
  );

  // ✅ EFFET DELETE USER
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ userId }) =>
        from(this.deleteUser(userId)).pipe(
          map(() => UsersActions.deleteUserSuccess({ userId })),
          catchError(error => {
            this.store.dispatch(UsersActions.removeUserLocally({ userId }));
            return of(UsersActions.deleteUserFailure({ error }));
          })
        )
      )
    )
  );

  // ✅ EFFET TOGGLE STATUS
  toggleUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.toggleUserStatus),
      map(({ userId, active }) =>
        UsersActions.updateUser({ userId, userData: { active } })
      )
    )
  );

  // ✅ RECHARGEMENT APRÈS SUCCÈS
  reloadAfterSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UsersActions.createUserSuccess,
        UsersActions.updateUserSuccess,
        UsersActions.deleteUserSuccess
      ),
      map(() => UsersActions.loadUsers({}))
    )
  );

  // ================================
  // MÉTHODES PRIVÉES POUR LES APPELS API
  // ================================

  private async fetchUsers(page: number, size: number): Promise<{ users: User[], totalElements: number, totalPages: number }> {
    const token = this.getToken();
    const response = await axios.get<ApiResponse<PaginatedResponse<ApiUser>>>(
      `${this.API_BASE_URL}/users?page=${page}&size=${size}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      }
    );

    if (response.data?.data?.content) {
      const apiUsers = response.data.data.content;
      const users = apiUsers.map(apiUser => this.mapApiUserToDisplayUser(apiUser));
      return {
        users,
        totalElements: response.data.data.totalElements || 0,
        totalPages: response.data.data.totalPages || 0
      };
    }

    return { users: [], totalElements: 0, totalPages: 0 };
  }

  // ✅ MÉTHODE CREATE USER COMPLÈTEMENT RÉVISÉE
  private async createUser(userData: UserFormData, file?: File): Promise<User> {
    const token = this.getToken();
    
    this.log('🔍 CREATE USER - userData détaillé:', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email?.replace(/(.{3}).*(@.*)/, '$1***$2'),
      username: userData.username,
      location: userData.location?.country
    });

    // ✅ Validation des données
    if (!userData || typeof userData !== 'object') {
      throw new Error('Données utilisateur invalides: userData doit être un objet');
    }

    if (!userData.firstName?.trim() || !userData.lastName?.trim() || !userData.email?.trim()) {
      throw new Error('Données utilisateur incomplètes: firstName, lastName et email sont requis');
    }

    // ✅ Vérification préventive de l'email
    try {
      const existingUsers = await this.fetchUsers(0, 1000);
      const emailExists = existingUsers.users.some(user => 
        user.email.toLowerCase() === userData.email!.toLowerCase()
      );
      
      if (emailExists) {
        throw new Error(`❌ Un utilisateur avec l'email "${userData.email}" existe déjà. Veuillez utiliser un autre email.`);
      }
    
    } catch (checkError: any) {
     
      if (checkError.message?.includes('existe déjà')) {
        throw checkError;
      
      }
     
      console.warn('⚠️ Impossible de vérifier les doublons:', checkError.message);
    }

    // ✅ Création du FormData selon le format de l'API
    const formData = new FormData();

    
    formData.append('email', userData.email.trim());
    formData.append('firstName', userData.firstName.trim());
    
    
    const dateJson = userData.dateOfBirth 
      ? new Date(userData.dateOfBirth).toISOString() 
      : new Date().toISOString();
    formData.append('dateOfBirth', dateJson);
    
    formData.append('gender', userData.gender || 'NON_SPECIFIED');
    formData.append('lastName', userData.lastName.trim());
    formData.append('password', userData.password || this.generateTempPassword());
    formData.append('phoneNumber', userData.phoneNumber?.trim() || '');
    
    
    const username = userData.username?.trim() || this.generateUniqueUsername(userData.email);
    formData.append('username', username);

    // ✅ Location au format JSON stringifié
    const locationObject = this.formatLocationObjectForAPI(userData.location);
    formData.append('location', JSON.stringify(locationObject));

    
    if (file && file instanceof File && file.size > 0) {
      formData.append('img', file, file.name);
      this.log('📎 Fichier image ajouté:', `${file.name} (Taille: ${file.size} bytes)`);
    } else {
      this.log('📎 Aucun fichier image, champ img omis');
    }

    
    try {
      const response = await axios.post<ApiResponse<ApiUser>>(
        `${this.API_BASE_URL}/users`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        }
      );

      this.log('📥 Réponse API createUser:', response.data);

      if (response.data?.data) {
        return this.mapApiUserToDisplayUser(response.data.data);
      } else {
        throw new Error('Réponse API invalide: données utilisateur manquantes');
      }
    } catch (error: any) {
      console.error('❌ Erreur détaillée création utilisateur:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

     
      if (error.response?.status === 409) {
        const conflictDetails = this.analyzeConflictError(error.response.data, userData);
        throw new Error(conflictDetails);
      }

      
      if (error.response?.status === 401) {
        throw new Error('Session expirée - veuillez vous reconnecter');
      }

     
      if (error.response?.status === 403) {
        throw new Error('Permissions insuffisantes pour créer un utilisateur');
      }



      throw error;
    }
  }

  // ✅ MÉTHODE UPDATE USER COMPLÈTEMENT CORRIGÉE
  private async updateUser(userId: string, userData: Partial<UserFormData>): Promise<User> {
    const token = this.getToken();
    
    console.log('🔍 === UPDATE USER API CALL ===');
    console.log('🔍 userId:', userId);
    console.log('🔍 userData:', userData);
    console.log('🔍 API_BASE_URL:', this.API_BASE_URL);
    
    // ✅ Validation stricte de l'URL
    const url = `${this.API_BASE_URL}/users/${userId}`;
    console.log('🔍 URL finale:', url);
    
    if (url.includes('undefined') || url.includes('null')) {
      throw new Error(`URL invalide: ${url}`);
    }
    
    try {
      const response = await axios.put<ApiResponse<ApiUser>>(
        url,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        }
      );

      console.log('✅ Réponse API updateUser:', response.data);

      // ✅ VOTRE API RETOURNE UN FORMAT DIFFÉRENT
      if (response.data?.status === 'Success' || response.data?.statusCodeValue === 200) {
        console.log('✅ API confirme la mise à jour, création utilisateur avec données envoyées');
        
        // ✅ Créer l'utilisateur avec les données que nous avons envoyées
        const updatedUser: User = {
          id: userId,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          userIdKeycloak: userData.userIdKeycloak || userId,
          phoneNumber: userData.phoneNumber || '',
          gender: userData.gender || 'NON_SPECIFIED',
          dateOfBirth: userData.dateOfBirth || new Date().toISOString().split('T')[0],
          location: userData.location || {
            locationInfoId: userId,
            nationality: 'Sénégalaise',
            country: 'Sénégal',
            region: 'Dakar',
            department: 'Dakar',
            address: 'Adresse non spécifiée'
          },
          role: this.normalizeRole(userData.role),
          active: userData.active !== undefined ? userData.active : true,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          category: this.getRoleLabel(userData.role),
          image: this.getDefaultImageByGender(userData.gender || 'NON_SPECIFIED'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('✅ Utilisateur mis à jour avec les nouvelles données:', updatedUser);
        
        // ✅ NOUVEAU : Si le rôle a changé, notifier pour forcer reconnexion
        if (userData.role && userData.role !== 'FAYDA_ROLE_USER') {
          console.log('🔄 Changement de rôle détecté, notification pour reconnexion');
          // Optionnel : Dispatch une action pour notifier le changement de rôle
          // this.store.dispatch(AuthActions.roleChangeDetected({ userId, newRole: userData.role }));
        }
        
        return updatedUser;
        
      } else if (response.data?.data) {
        // ✅ Format classique avec data
        return this.mapApiUserToDisplayUser(response.data.data);
      } else {
        // ✅ Fallback si aucun format reconnu
        console.warn('⚠️ Format de réponse API non reconnu:', response.data);
        throw new Error('Format de réponse API inattendu');
      }
    } catch (error: any) {
      console.error('❌ Erreur détaillée update utilisateur:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data
      });

      throw error;
   
    }
 
  }

  // ✅ MÉTHODE DELETE USER
  private async deleteUser(userId: string): Promise<void> {
    const token = this.getToken();
    await axios.delete<ApiResponse<void>>(
     
      `${this.API_BASE_URL}/users/${userId}`,
     
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      }
    );
  }

  // ✅ MÉTHODES UTILITAIRES POUR LES RÔLES

  private normalizeRole(role?: string): string {
    if (!role) return USER_ROLES.USER;
    
    // Si c'est déjà un rôle valide
    if (Object.values(USER_ROLES).includes(role as any)) {
      return role;
    }
    
    // Mapping depuis les anciens rôles
    if (role in LEGACY_ROLE_MAPPING) {
      return LEGACY_ROLE_MAPPING[role as keyof typeof LEGACY_ROLE_MAPPING];
    }
    
    // Mapping par contenu
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin')) return USER_ROLES.ADMIN;
    if (roleLower.includes('mouqadam')) return USER_ROLES.MOUQADAM;
    if (roleLower.includes('resp') || roleLower.includes('dahira')) return USER_ROLES.DAHIRA_RESP;
    if (roleLower.includes('disciple')) return USER_ROLES.DISCIPLE;
    
    return USER_ROLES.USER;
  }

  private getRoleLabel(role?: string): string {
    const normalizedRole = this.normalizeRole(role);
    return ROLE_LABELS[normalizedRole as keyof typeof ROLE_LABELS] || 'Utilisateur';
  }

  // ✅ MÉTHODE CORRIGÉE: Déterminer le rôle depuis userIdKeycloak
  private determineCategoryFromUserIdKeycloak(userIdKeycloak?: string): string {
    if (!userIdKeycloak) return USER_ROLES.DISCIPLE;
    
    const id = userIdKeycloak.toLowerCase();
    if (id.includes('admin')) return USER_ROLES.ADMIN;
    if (id.includes('mouqadam')) return USER_ROLES.MOUQADAM;
    if (id.includes('resp') || id.includes('responsable') || id.includes('dahira')) return USER_ROLES.DAHIRA_RESP;
    if (id.includes('visiteur') || id.includes('user')) return USER_ROLES.USER;
    
    return USER_ROLES.DISCIPLE;
  }

  private determineCategoryFromRole(role?: string): string {
    return this.getRoleLabel(role);
  }

  // ✅ MÉTHODES UTILITAIRES

  private getToken(): string | null {
    return localStorage.getItem('access_token') ||
           localStorage.getItem('token') ||
           sessionStorage.getItem('access_token') ||
           sessionStorage.getItem('token') ||
           null;
  }

  private mapApiUserToDisplayUser(apiUser: ApiUser): User {
    // ✅ Gestion du rôle depuis différentes sources possibles
    const roleFromApi = (apiUser as any).role || 
                       (apiUser as any).userRole || 
                       (apiUser as any).category ||
                       this.determineCategoryFromUserIdKeycloak(apiUser.userIdKeycloak);

    return {
      id: apiUser.userId,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      email: apiUser.email,
      userIdKeycloak: apiUser.userIdKeycloak,
      phoneNumber: apiUser.phoneNumber,
      gender: apiUser.gender,
      dateOfBirth: apiUser.dateOfBirth,
      location: apiUser.location,
      active: apiUser.active,
      createdAt: apiUser.createdAt,
      updatedAt: apiUser.updatedAt,
      name: `${apiUser.firstName} ${apiUser.lastName}`,
      role: this.normalizeRole(roleFromApi),
      category: this.getRoleLabel(roleFromApi),
      image: this.getDefaultImageByGender(apiUser.gender)
    };
  }

  // ✅ IMAGES AVEC FALLBACK SÉCURISÉ
  private getDefaultImageByGender(gender: string): string {
    const genderLower = gender?.toLowerCase() || '';
    
    if (genderLower.includes('femme') || genderLower.includes('female') || genderLower.includes('f')) {
      return 'assets/images/default-female-avatar.png';
    }
    
    return 'assets/images/default-male-avatar.png';
  }

  
  private generateDefaultAvatar(firstName: string, lastName: string, gender: string): string {
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    const colors = gender?.toLowerCase().includes('f') ? 
      { bg: 'FF69B4', fg: 'FFFFFF' } : 
      { bg: '4169E1', fg: 'FFFFFF' };
    
    return `https://ui-avatars.com/api/?name=${initials}&background=${colors.bg}&color=${colors.fg}&size=150`;
  }

  // ✅ MÉTHODES DE SUPPORT

  private analyzeConflictError(errorData: any, userData: UserFormData): string {
    console.error('🔍 ANALYSE ERREUR 409:', errorData);
    
    const errorMessage = errorData?.message || errorData?.error || '';
    
    if (errorMessage.toLowerCase().includes('email')) {
      return `❌ L'email "${userData.email}" est déjà utilisé.\n\nSuggestions:\n• Utilisez un autre email\n• Vérifiez si vous avez déjà un compte\n• Contactez l'administrateur si nécessaire`;
    }
    
    if (errorMessage.toLowerCase().includes('username')) {
      return `❌ Le nom d'utilisateur "${userData.username}" est déjà pris.\n\nUn nom unique sera généré automatiquement.`;
    }
    
    if (errorMessage.toLowerCase().includes('phone')) {
      return `❌ Le numéro "${userData.phoneNumber}" est déjà utilisé.\n\nVeuillez utiliser un autre numéro.`;
    }
    
    return `❌ Utilisateur déjà existant.\n\nVérifiez:\n• L'email: ${userData.email}\n• Le nom d'utilisateur: ${userData.username}\n• Le numéro de téléphone: ${userData.phoneNumber}`;
  }

  private generateUniqueUsername(email: string): string {
    const emailPrefix = email.split('@')[0];
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000);
    return `${emailPrefix}_${timestamp}_${random}`;
  }

  private formatLocationObjectForAPI(location?: any): any {
    if (!location) {
      return {
        nationality: 'Sénégalaise',
        country: 'Sénégal',
        region: 'Dakar',
        department: 'Dakar',
        address: 'Adresse non spécifiée'
      };
    }

    return {
      nationality: (location.nationality || 'Sénégalaise').toString().trim(),
      country: (location.country || 'Sénégal').toString().trim(),
      region: (location.region || 'Dakar').toString().trim(),
      department: (location.department || location.region || 'Dakar').toString().trim(),
      address: (location.address || 'Adresse non spécifiée').toString().trim()
    };
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass + '1A!';
  }

  
  private createUserWithFallback(userData: UserFormData): User {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Données utilisateur invalides pour le fallback');
    }

   
    const user: User = {
      id: Date.now().toString(),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      userIdKeycloak: userData.userIdKeycloak || '',
      phoneNumber: userData.phoneNumber || userData.phone || '',
      gender: userData.gender || 'NON_SPECIFIED',
      dateOfBirth: userData.dateOfBirth || new Date().toISOString().split('T')[0],
      location: {
        locationInfoId: userData.location?.locationInfoId || Date.now().toString(),
        nationality: userData.location?.nationality || 'Sénégalaise',
        country: userData.location?.country || 'Sénégal',
        region: userData.location?.region || 'Dakar',
        department: userData.location?.department || 'Dakar',
        address: userData.location?.address || userData.address || ''
      },
      role: this.normalizeRole(userData.role),
      active: userData.active !== undefined ? userData.active : true,
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      category: this.getRoleLabel(userData.role),
      image: this.getDefaultImageByGender(userData.gender || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

   
    return JSON.parse(JSON.stringify(user));
  }

 
  private log(message: string, data?: any) {
    if (this.debug) {
      console.log(message, data);
    }
  }
}